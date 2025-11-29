/**
 * Chart Configurations and Metadata
 * All available chart types with their configurations
 */

export const CHART_CATEGORIES = [
  {
    name: 'Basic',
    description: 'Essential chart types for common visualizations',
    types: [
      {
        value: 'bar',
        label: 'Bar Chart',
        icon: '📊',
        description: 'Compare values across categories',
        useCases: ['Comparisons', 'Rankings', 'Distributions'],
        dataFormat: 'categorical',
      },
      {
        value: 'line',
        label: 'Line Chart',
        icon: '📈',
        description: 'Show trends over time',
        useCases: ['Time series', 'Trends', 'Continuous data'],
        dataFormat: 'timeseries',
      },
      {
        value: 'pie',
        label: 'Pie Chart',
        icon: '🥧',
        description: 'Show proportions of a whole',
        useCases: ['Percentages', 'Composition', 'Parts of whole'],
        dataFormat: 'categorical',
      },
      {
        value: 'area',
        label: 'Area Chart',
        icon: '📉',
        description: 'Show cumulative trends',
        useCases: ['Cumulative values', 'Volume over time', 'Stacked data'],
        dataFormat: 'timeseries',
      },
    ],
  },
  {
    name: 'Statistical',
    description: 'Advanced statistical visualizations',
    types: [
      {
        value: 'scatter',
        label: 'Scatter Plot',
        icon: '⚫',
        description: 'Show correlation between two variables',
        useCases: ['Correlation', 'Clustering', 'Outlier detection'],
        dataFormat: 'numeric',
      },
      {
        value: 'histogram',
        label: 'Histogram',
        icon: '📶',
        description: 'Show distribution of values',
        useCases: ['Frequency distribution', 'Data distribution', 'Statistical analysis'],
        dataFormat: 'numeric',
      },
      {
        value: 'boxplot',
        label: 'Box Plot',
        icon: '📦',
        description: 'Show statistical distribution',
        useCases: ['Quartiles', 'Outliers', 'Statistical summary'],
        dataFormat: 'numeric',
      },
    ],
  },
  {
    name: 'Comparison',
    description: 'Charts for comparing multiple dimensions',
    types: [
      {
        value: 'radar',
        label: 'Radar Chart',
        icon: '📡',
        description: 'Compare multiple variables',
        useCases: ['Multi-dimensional comparison', 'Performance metrics', 'Feature comparison'],
        dataFormat: 'multivariate',
      },
      {
        value: 'heatmap',
        label: 'Heatmap',
        icon: '🔥',
        description: 'Show intensity across two dimensions',
        useCases: ['Correlation matrix', 'Density', 'Pattern detection'],
        dataFormat: 'matrix',
      },
      {
        value: 'waterfall',
        label: 'Waterfall',
        icon: '💧',
        description: 'Show cumulative effect',
        useCases: ['Financial analysis', 'Sequential changes', 'Variance analysis'],
        dataFormat: 'sequential',
      },
    ],
  },
  {
    name: 'Specialized',
    description: 'Specialized chart types for specific use cases',
    types: [
      {
        value: 'gauge',
        label: 'Gauge Chart',
        icon: '🎯',
        description: 'Show progress toward a goal',
        useCases: ['KPIs', 'Progress tracking', 'Performance metrics'],
        dataFormat: 'single-value',
      },
      {
        value: 'funnel',
        label: 'Funnel Chart',
        icon: '🔽',
        description: 'Show stages in a process',
        useCases: ['Conversion rates', 'Sales pipeline', 'Process flow'],
        dataFormat: 'sequential',
      },
      {
        value: 'treemap',
        label: 'Treemap',
        icon: '🌳',
        description: 'Show hierarchical data as nested rectangles',
        useCases: ['Hierarchies', 'Proportions', 'Space utilization'],
        dataFormat: 'hierarchical',
      },
    ],
  },
  {
    name: 'Data',
    description: 'Tabular data representations',
    types: [
      {
        value: 'table',
        label: 'Data Table',
        icon: '📋',
        description: 'Display data in tabular format',
        useCases: ['Detailed data', 'Lists', 'Raw data viewing'],
        dataFormat: 'tabular',
      },
    ],
  },
];

// Default color schemes
export const COLOR_SCHEMES = {
  default: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'],
  professional: ['#1E40AF', '#7C3AED', '#059669', '#D97706', '#DC2626'],
  pastel: ['#A78BFA', '#93C5FD', '#6EE7B7', '#FCD34D', '#FCA5A5'],
  vibrant: ['#7C3AED', '#2563EB', '#059669', '#D97706', '#DC2626'],
  monochrome: ['#1F2937', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB'],
  ocean: ['#0EA5E9', '#06B6D4', '#14B8A6', '#10B981', '#22C55E'],
  sunset: ['#F59E0B', '#F97316', '#EF4444', '#EC4899', '#A855F7'],
  forest: ['#065F46', '#047857', '#059669', '#10B981', '#34D399'],
};

// Default chart configurations
export const DEFAULT_CHART_CONFIG = {
  bar: {
    type: 'bar',
    options: {
      showGrid: true,
      showLegend: true,
      animationDuration: 300,
    },
    style: {
      colors: COLOR_SCHEMES.default,
      barSize: 40,
    },
  },
  line: {
    type: 'line',
    options: {
      showGrid: true,
      showLegend: true,
      smooth: true,
      showDots: true,
    },
    style: {
      colors: COLOR_SCHEMES.default,
      strokeWidth: 2,
    },
  },
  pie: {
    type: 'pie',
    options: {
      showLegend: true,
      showLabels: true,
      showPercentage: true,
    },
    style: {
      colors: COLOR_SCHEMES.default,
    },
  },
  area: {
    type: 'area',
    options: {
      showGrid: true,
      showLegend: true,
      stacked: false,
    },
    style: {
      colors: COLOR_SCHEMES.default,
      opacity: 0.6,
    },
  },
  scatter: {
    type: 'scatter',
    options: {
      showGrid: true,
      showLegend: true,
    },
    style: {
      colors: COLOR_SCHEMES.default,
      dotSize: 6,
    },
  },
  radar: {
    type: 'radar',
    options: {
      showLegend: true,
      fillOpacity: 0.3,
    },
    style: {
      colors: COLOR_SCHEMES.default,
    },
  },
  heatmap: {
    type: 'heatmap',
    options: {
      showLegend: true,
      showValues: true,
    },
    style: {
      colors: ['#3B82F6', '#EF4444'],
    },
  },
  table: {
    type: 'table',
    options: {
      sortable: true,
      searchable: true,
      pagination: true,
      pageSize: 10,
    },
    style: {
      striped: true,
    },
  },
};

// Get default config for a chart type
export const getDefaultConfig = (type) => {
  return DEFAULT_CHART_CONFIG[type] || DEFAULT_CHART_CONFIG.bar;
};

// Get all chart types as flat array
export const getAllChartTypes = () => {
  return CHART_CATEGORIES.flatMap((category) => category.types);
};

// Find chart type info
export const getChartTypeInfo = (type) => {
  const allTypes = getAllChartTypes();
  return allTypes.find((t) => t.value === type);
};

// Default grid layout positions
export const DEFAULT_POSITIONS = {
  small: { w: 4, h: 4 },
  medium: { w: 6, h: 4 },
  large: { w: 8, h: 5 },
  wide: { w: 12, h: 4 },
  tall: { w: 6, h: 6 },
  fullWidth: { w: 12, h: 5 },
};

// Get suggested chart type based on data
export const suggestChartType = (data) => {
  if (!data || !data.length) return 'bar';
  
  const keys = Object.keys(data[0] || {});
  const hasTimestamp = keys.some((k) => k.toLowerCase().includes('date') || k.toLowerCase().includes('time'));
  const hasNumericValues = keys.some((k) => typeof data[0][k] === 'number');
  
  if (hasTimestamp && hasNumericValues) return 'line';
  if (data.length <= 7) return 'pie';
  if (hasNumericValues && data.length > 20) return 'bar';
  
  return 'bar';
};
