/**
 * Dashboard API - Handles all dashboard-related backend communication
 */

const API_BASE = 'http://localhost:8000';

/**
 * Send a chat message for dashboard generation
 * Uses the dashboard-specific endpoint for proper formatting
 */
export async function sendDashboardMessage(message, onChunk) {
  const response = await fetch(`${API_BASE}/dashboard/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: message }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  // Call the chunk handler with the full response
  if (onChunk) {
    onChunk(data.response);
  }
  
  return data.response;
}

/**
 * Generate dashboard from a query
 */
export async function generateDashboard(query) {
  try {
    const response = await fetch(`${API_BASE}/dashboard/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating dashboard:', error);
    throw error;
  }
}

/**
 * Update a specific chart
 */
export async function updateChartData(chartId, config) {
  try {
    const response = await fetch(`${API_BASE}/dashboard/update-chart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chartId, config }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating chart:', error);
    throw error;
  }
}

/**
 * Execute a dashboard command via chat
 */
export async function executeDashboardCommand(command, currentDashboard) {
  try {
    const response = await fetch(`${API_BASE}/dashboard/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command, currentDashboard }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error executing dashboard command:', error);
    throw error;
  }
}

/**
 * Fetch data for a chart based on query
 */
export async function fetchChartData(query, chartType) {
  try {
    const response = await fetch(`${API_BASE}/dashboard/chart-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, chartType }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
}

/**
 * Save dashboard configuration
 */
export async function saveDashboard(dashboardConfig) {
  try {
    const response = await fetch(`${API_BASE}/dashboard/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dashboardConfig),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving dashboard:', error);
    throw error;
  }
}

/**
 * Load saved dashboards
 */
export async function loadDashboards() {
  try {
    const response = await fetch(`${API_BASE}/dashboard/list`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error loading dashboards:', error);
    throw error;
  }
}
