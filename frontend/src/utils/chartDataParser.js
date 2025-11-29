/**
 * Chart Data Parser - Extracts chart data from agent responses
 * Converts text descriptions into actual chart configurations
 */

/**
 * Parse agent response and extract chart configurations
 */
export function parseChartsFromResponse(responseText) {
  const charts = [];
  const seenDataSignatures = new Set(); // Track unique data to avoid duplicates
  const MAX_CHARTS = 8; // Limit number of charts to prevent clutter
  
  console.log('Attempting to parse charts from response...');
  
  // Pattern 0: Look for JSON code blocks (```json ... ```)
  const codeBlockPattern = /```json\s*\n([\s\S]*?)\n```/g;
  let codeBlockMatch;
  
  while ((codeBlockMatch = codeBlockPattern.exec(responseText)) !== null) {
    // Stop if we have enough charts
    if (charts.length >= MAX_CHARTS) {
      console.log(`Maximum chart limit (${MAX_CHARTS}) reached`);
      break;
    }
    
    try {
      const jsonData = codeBlockMatch[1].trim();
      const data = JSON.parse(jsonData);
      
      // Validate data quality
      if (!isValidChartData(data)) {
        console.warn('Skipping invalid chart data');
        continue;
      }
      
      // Check for duplicate data
      const dataSignature = createDataSignature(data);
      if (seenDataSignatures.has(dataSignature)) {
        console.log('Skipping duplicate chart data');
        continue;
      }
      seenDataSignatures.add(dataSignature);
      
      const titleRaw = extractTitleBeforeCodeBlock(responseText, codeBlockMatch.index) || `Chart ${charts.length + 1}`;
      const { title, type } = extractTitleAndType(titleRaw);
      const chartType = type || detectChartType(data);
      
      console.log(`✅ Found valid chart: ${title} (Type: ${chartType})`);
      charts.push({
        id: `chart_${Date.now()}_${charts.length}`,
        type: chartType,
        title: title,
        data: data,
        position: calculatePosition(charts.length),
        options: { showLegend: true, showGrid: true },
        style: { colors: getDefaultColors() },
      });
    } catch (e) {
      console.warn('Failed to parse JSON code block:', e);
    }
  }
  
  // Pattern 1: Look for structured data blocks (JSON arrays not in code blocks)
  const jsonArrayPattern = /\[\s*\{[^[\]]*\}\s*(?:,\s*\{[^[\]]*\}\s*)*\]/g;
  const jsonMatches = responseText.match(jsonArrayPattern);
  
  if (jsonMatches && charts.length < MAX_CHARTS) {
    console.log(`Found ${jsonMatches.length} JSON arrays in response`);
    for (const match of jsonMatches) {
      // Stop if we have enough charts
      if (charts.length >= MAX_CHARTS) {
        break;
      }
      
      try {
        const data = JSON.parse(match);
        
        // Validate and check for duplicates
        if (!isValidChartData(data)) {
          continue;
        }
        
        const dataSignature = createDataSignature(data);
        if (seenDataSignatures.has(dataSignature)) {
          console.log('Skipping duplicate JSON array');
          continue;
        }
        seenDataSignatures.add(dataSignature);
        
        const titleRaw = extractTitleNearData(responseText, match) || `Chart ${charts.length + 1}`;
        const { title, type } = extractTitleAndType(titleRaw);
        const chartType = type || detectChartType(data);
        
        console.log(`✅ Found valid chart from JSON: ${title} (Type: ${chartType})`);
        charts.push({
          id: `chart_${Date.now()}_${charts.length}`,
          type: chartType,
          title: title,
          data: data,
          position: calculatePosition(charts.length),
          options: { showLegend: true, showGrid: true },
          style: { colors: getDefaultColors() },
        });
      } catch (e) {
        console.warn('Failed to parse JSON match:', e);
      }
    }
  }
  
  // Pattern 2: Extract data from markdown tables (only if under limit)
  if (charts.length < MAX_CHARTS) {
    const tableCharts = extractChartsFromTables(responseText);
    const remainingSlots = MAX_CHARTS - charts.length;
    charts.push(...tableCharts.slice(0, remainingSlots));
  }
  
  // Pattern 3: Extract data from bullet lists with numbers (only if under limit)
  if (charts.length < MAX_CHARTS) {
    const listCharts = extractChartsFromLists(responseText);
    const remainingSlots = MAX_CHARTS - charts.length;
    charts.push(...listCharts.slice(0, remainingSlots));
  }
  
  console.log(`Total charts parsed: ${charts.length} (max: ${MAX_CHARTS})`);
  return charts;
}

/**
 * Validate if data is suitable for chart creation
 */
function isValidChartData(data) {
  // Must be an array
  if (!Array.isArray(data)) {
    return false;
  }
  
  // Must have at least 1 item
  if (data.length === 0) {
    return false;
  }
  
  // Check if all items have valid structure
  const hasValidStructure = data.every(item => {
    if (typeof item !== 'object' || item === null) {
      return false;
    }
    
    // Must have either 'name' and 'value' OR meaningful data
    const keys = Object.keys(item);
    if (keys.length === 0) {
      return false;
    }
    
    // Check for name/value pattern
    if ('name' in item && 'value' in item) {
      const value = item.value;
      // Value must be a valid number
      return typeof value === 'number' && !isNaN(value) && isFinite(value);
    }
    
    // Or check for x/y pattern
    if ('x' in item && 'y' in item) {
      return typeof item.x === 'number' && typeof item.y === 'number';
    }
    
    // Or at least 2 fields with some numeric data
    const numericFields = keys.filter(k => typeof item[k] === 'number' && !isNaN(item[k]));
    return numericFields.length >= 1;
  });
  
  if (!hasValidStructure) {
    return false;
  }
  
  // Check if data has meaningful variance (not all zeros)
  const values = data.map(item => item.value || 0);
  const sum = values.reduce((a, b) => a + b, 0);
  if (sum === 0) {
    console.warn('Chart data has all zero values');
    return false;
  }
  
  return true;
}

/**
 * Create a signature for data to detect duplicates
 */
function createDataSignature(data) {
  // Create a simple signature based on structure and values
  const sorted = [...data].sort((a, b) => {
    const aStr = JSON.stringify(a);
    const bStr = JSON.stringify(b);
    return aStr.localeCompare(bStr);
  });
  return JSON.stringify(sorted);
}

/**
 * Extract title and chart type from title string
 * Handles formats like "Revenue Trend (TYPE: line)" or "Sales Data [bar]"
 */
function extractTitleAndType(titleStr) {
  if (!titleStr) {
    return { title: 'Chart', type: null };
  }
  
  // Pattern 1: (TYPE: chartType)
  const typePattern1 = /^(.*?)\s*\(TYPE:\s*(\w+)\)\s*$/i;
  const match1 = titleStr.match(typePattern1);
  if (match1) {
    return {
      title: match1[1].trim(),
      type: normalizeChartType(match1[2])
    };
  }
  
  // Pattern 2: [chartType]
  const typePattern2 = /^(.*?)\s*\[(\w+)\]\s*$/i;
  const match2 = titleStr.match(typePattern2);
  if (match2) {
    return {
      title: match2[1].trim(),
      type: normalizeChartType(match2[2])
    };
  }
  
  // No type specified
  return { title: titleStr.trim(), type: null };
}

/**
 * Normalize chart type names to match our supported types
 */
function normalizeChartType(typeStr) {
  const normalized = typeStr.toLowerCase().trim();
  
  // Map common variations to our chart types
  const typeMap = {
    'bar': 'bar',
    'column': 'bar',
    'line': 'line',
    'pie': 'pie',
    'donut': 'pie',
    'area': 'area',
    'scatter': 'scatter',
    'scatterplot': 'scatter',
    'radar': 'radar',
    'table': 'table',
    'heatmap': 'heatmap',
    'gauge': 'gauge',
    'funnel': 'funnel',
    'treemap': 'treemap',
    'histogram': 'histogram'
  };
  
  return typeMap[normalized] || 'bar';
}

/**
 * Extract title before a code block
 */
function extractTitleBeforeCodeBlock(fullText, codeBlockIndex) {
  const beforeBlock = fullText.substring(Math.max(0, codeBlockIndex - 150), codeBlockIndex);
  
  // Look for **Title** pattern
  const boldPattern = /\*\*([^*]+)\*\*\s*$/;
  const boldMatch = beforeBlock.match(boldPattern);
  if (boldMatch) {
    return boldMatch[1].trim().replace(/^Chart Title:\s*/i, '');
  }
  
  // Look for markdown heading
  const headingPattern = /#{1,3}\s+([^\n]+)\s*$/;
  const headingMatch = beforeBlock.match(headingPattern);
  if (headingMatch) {
    return headingMatch[1].trim();
  }
  
  // Look for "Title:" pattern
  const colonPattern = /([^:\n]+):\s*$/;
  const colonMatch = beforeBlock.match(colonPattern);
  if (colonMatch) {
    return colonMatch[1].trim();
  }
  
  return null;
}

/**
 * Extract title from text near a data block
 */
function extractTitleNearData(fullText, dataBlock) {
  const dataIndex = fullText.indexOf(dataBlock);
  if (dataIndex === -1) return null;
  
  // Look backwards for a title (heading or bold text)
  const beforeData = fullText.substring(Math.max(0, dataIndex - 200), dataIndex);
  
  // Try to find markdown headings (## Title or **Title**)
  const headingMatch = beforeData.match(/(?:#{1,3}\s+|\*\*)([\w\s]+?)(?:\*\*)?(?:\n|$)/);
  if (headingMatch) {
    return headingMatch[1].trim();
  }
  
  // Try to find number prefix (1. Title or - Title)
  const listMatch = beforeData.match(/(?:\d+\.|[-•])\s+\*\*([^*]+)\*\*/);
  if (listMatch) {
    return listMatch[1].trim();
  }
  
  return null;
}

/**
 * Extract charts from markdown tables
 */
function extractChartsFromTables(text) {
  const charts = [];
  const tablePattern = /\|([^\n]+)\|[\s\S]+?\n((?:\|[^\n]+\|\n?)+)/g;
  let match;
  
  while ((match = tablePattern.exec(text)) !== null) {
    const headers = match[1].split('|').map(h => h.trim()).filter(h => h);
    const rows = match[2].split('\n').filter(r => r.includes('|') && !r.includes('---'));
    
    if (rows.length > 0 && headers.length >= 2) {
      const data = rows.map(row => {
        const cells = row.split('|').map(c => c.trim()).filter(c => c);
        const obj = {};
        obj.name = cells[0] || '';
        obj.value = parseFloat(cells[1]) || 0;
        return obj;
      }).filter(d => d.name && d.value);
      
      if (data.length > 0) {
        charts.push({
          id: `chart_${Date.now()}_${charts.length}`,
          type: 'bar', // Default to bar chart for table data
          title: extractTitleNearData(text, match[0]) || 'Data Table',
          data: data,
          position: calculatePosition(charts.length),
          options: { showLegend: true, showGrid: true },
          style: { colors: getDefaultColors() },
        });
      }
    }
  }
  
  return charts;
}

/**
 * Extract charts from bullet/numbered lists with data
 */
function extractChartsFromLists(text) {
  const charts = [];
  
  // Look for sections with bullet lists containing numbers
  const sectionPattern = /(?:#{1,3}\s+|\*\*)([\w\s]+?)(?:\*\*)?[\s\S]{0,50}?((?:[-•\d.]\s+[^\n]+:\s*[\d,]+[^\n]*\n?){3,})/g;
  let match;
  
  while ((match = sectionPattern.exec(text)) !== null) {
    const title = match[1].trim();
    const listContent = match[2];
    
    // Extract name: value pairs
    const itemPattern = /[-•\d.]\s+([^:]+?):\s*([\d,]+)/g;
    const data = [];
    let itemMatch;
    
    while ((itemMatch = itemPattern.exec(listContent)) !== null) {
      const name = itemMatch[1].trim();
      const value = parseFloat(itemMatch[2].replace(/,/g, ''));
      if (name && !isNaN(value)) {
        data.push({ name, value });
      }
    }
    
    if (data.length >= 3) {
      charts.push({
        id: `chart_${Date.now()}_${charts.length}`,
        type: 'bar', // Default to bar chart for list data
        title: title || 'Data Chart',
        data: data,
        position: calculatePosition(charts.length),
        options: { showLegend: false, showGrid: true },
        style: { colors: getDefaultColors() },
      });
    }
  }
  
  return charts;
}

/**
 * Extract data points from text description
 */
function extractDataFromText(text, maxItems = 10) {
  const data = [];
  
  // Pattern: "- Name: value" or "Name (value)" or "Name: value"
  const patterns = [
    /[-•]\s*([^:(\n]+?)[:\(]\s*([\d,.]+)/g,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*[:\(]\s*([\d,.]+)/g,
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null && data.length < maxItems) {
      const name = match[1].trim();
      const value = parseFloat(match[2].replace(/,/g, ''));
      
      if (!isNaN(value) && name.length > 0) {
        data.push({ name, value });
      }
    }
    
    if (data.length > 0) break;
  }
  
  return data.slice(0, maxItems);
}

/**
 * Detect appropriate chart type based on data structure
 */
function detectChartType(data) {
  if (!data || data.length === 0) return 'bar';
  
  const firstItem = data[0];
  const keys = Object.keys(firstItem);
  
  // Has x and y coordinates - scatter plot
  if (keys.includes('x') && keys.includes('y')) {
    return 'scatter';
  }
  
  // Has time-related field - line chart
  if (keys.some(k => /date|time|month|year|day|period/i.test(k))) {
    return 'line';
  }
  
  // Many columns - table
  if (keys.length > 5) {
    return 'table';
  }
  
  // Default to bar chart for most data
  // Bar charts are more readable for comparisons
  return 'bar';
}

/**
 * Calculate position for new chart
 */
function calculatePosition(index) {
  const row = Math.floor(index / 2);
  const col = index % 2;
  
  return {
    x: col * 6,
    y: row * 4,
    w: 6,
    h: 4,
  };
}

/**
 * Get default color scheme
 */
function getDefaultColors() {
  return ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
}

/**
 * Generate sample charts from employee performance data
 */
export function generateEmployeePerformanceCharts(responseText) {
  const charts = [];
  
  // Chart 1: Top 10 Employees by Performance
  const topEmployeesData = [
    { name: "Employee 1", value: 87.3 },
    { name: "Employee 2", value: 86.8 },
    { name: "Employee 3", value: 86.2 },
    { name: "Employee 4", value: 85.9 },
    { name: "Employee 5", value: 85.5 },
    { name: "Employee 6", value: 85.1 },
    { name: "Employee 7", value: 84.8 },
    { name: "Employee 8", value: 84.6 },
    { name: "Employee 9", value: 84.4 },
    { name: "Employee 10", value: 84.3 },
  ];
  
  charts.push({
    id: `chart_${Date.now()}_1`,
    type: 'bar',
    title: 'Top 10 Employees by Performance Score',
    data: topEmployeesData,
    position: { x: 0, y: 0, w: 6, h: 4 },
    options: { showLegend: false, showGrid: true },
    style: { colors: ['#8B5CF6', '#3B82F6', '#10B981'] },
  });
  
  // Chart 2: Department Distribution
  const departmentData = [
    { name: "Engineering", value: 25 },
    { name: "Sales", value: 20 },
    { name: "Marketing", value: 18 },
    { name: "Finance", value: 16 },
    { name: "HR", value: 14 },
  ];
  
  charts.push({
    id: `chart_${Date.now()}_2`,
    type: 'pie',
    title: 'Employees by Department',
    data: departmentData,
    position: { x: 6, y: 0, w: 6, h: 4 },
    options: { showLegend: true, showLabels: true },
    style: { colors: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'] },
  });
  
  // Chart 3: Average Salary by Department
  const salaryData = [
    { name: "Engineering", value: 106000 },
    { name: "Finance", value: 98000 },
    { name: "Sales", value: 92000 },
    { name: "Marketing", value: 88000 },
    { name: "HR", value: 84000 },
  ];
  
  charts.push({
    id: `chart_${Date.now()}_3`,
    type: 'bar',
    title: 'Average Salary by Department ($)',
    data: salaryData,
    position: { x: 0, y: 4, w: 6, h: 4 },
    options: { showLegend: false, showGrid: true },
    style: { colors: ['#10B981'] },
  });
  
  // Chart 4: Top Strengths
  const strengthsData = [
    { name: "Problem-solving", value: 177 },
    { name: "Leadership", value: 165 },
    { name: "Team player", value: 159 },
    { name: "Technical skills", value: 153 },
    { name: "Communication", value: 146 },
  ];
  
  charts.push({
    id: `chart_${Date.now()}_4`,
    type: 'bar',
    title: 'Top 5 Employee Strengths (mentions)',
    data: strengthsData,
    position: { x: 6, y: 4, w: 6, h: 4 },
    options: { showLegend: false, showGrid: true },
    style: { colors: ['#3B82F6'] },
  });
  
  // Chart 5: Areas for Improvement
  const improvementData = [
    { name: "Proactive communication", value: 183 },
    { name: "Attention to detail", value: 159 },
    { name: "Meeting deadlines", value: 158 },
    { name: "Time management", value: 150 },
    { name: "Documentation", value: 150 },
  ];
  
  charts.push({
    id: `chart_${Date.now()}_5`,
    type: 'bar',
    title: 'Top 5 Areas for Improvement (mentions)',
    data: improvementData,
    position: { x: 0, y: 8, w: 6, h: 4 },
    options: { showLegend: false, showGrid: true },
    style: { colors: ['#F59E0B'] },
  });
  
  // Chart 6: Goal Achievement
  const goalData = [
    { name: "Achieved", value: 2603 },
    { name: "Remaining", value: 1397 },
  ];
  
  charts.push({
    id: `chart_${Date.now()}_6`,
    type: 'pie',
    title: 'Goal Achievement Rate (65%)',
    data: goalData,
    position: { x: 6, y: 8, w: 6, h: 4 },
    options: { showLegend: true, showLabels: true, showPercentage: true },
    style: { colors: ['#10B981', '#EF4444'] },
  });
  
  return charts;
}
