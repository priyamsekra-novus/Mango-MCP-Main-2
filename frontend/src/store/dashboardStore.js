import { create } from 'zustand';

/**
 * Dashboard Store - Manages all dashboard state
 * Handles charts, layouts, and interactions
 */
const useDashboardStore = create((set, get) => ({
  // Charts array
  charts: [],
  
  // Current layout configuration
  layout: [],
  
  // Currently editing chart
  editingChart: null,
  
  // Dashboard metadata
  dashboardTitle: 'AI Analytics Dashboard',
  lastUpdated: null,
  isLoading: false,
  
  // Add a new chart
  addChart: (chart) => {
    const newChart = {
      ...chart,
      id: chart.id || `chart_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({
      charts: [...state.charts, newChart],
      lastUpdated: new Date().toISOString(),
    }));
    
    return newChart.id;
  },
  
  // Add multiple charts at once (from agent)
  addCharts: (charts) => {
    const newCharts = charts.map((chart, idx) => ({
      ...chart,
      id: chart.id || `chart_${Date.now()}_${idx}`,
      createdAt: new Date().toISOString(),
    }));
    
    set((state) => ({
      charts: [...state.charts, ...newCharts],
      lastUpdated: new Date().toISOString(),
    }));
  },
  
  // Update a specific chart
  updateChart: (id, updates) => {
    set((state) => ({
      charts: state.charts.map((chart) =>
        chart.id === id ? { ...chart, ...updates, updatedAt: new Date().toISOString() } : chart
      ),
      lastUpdated: new Date().toISOString(),
    }));
  },
  
  // Remove a chart
  removeChart: (id) => {
    set((state) => ({
      charts: state.charts.filter((chart) => chart.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
  },
  
  // Clear all charts
  clearDashboard: () => {
    set({
      charts: [],
      layout: [],
      lastUpdated: new Date().toISOString(),
    });
  },
  
  // Replace entire dashboard (load saved dashboard)
  setDashboard: (charts, layout, title) => {
    set({
      charts,
      layout: layout || [],
      dashboardTitle: title || 'AI Analytics Dashboard',
      lastUpdated: new Date().toISOString(),
    });
  },
  
  // Update layout (when user drags/resizes)
  updateLayout: (newLayout) => {
    set({
      layout: newLayout,
      lastUpdated: new Date().toISOString(),
    });
  },
  
  // Set editing chart
  setEditingChart: (chartId) => {
    set({ editingChart: chartId });
  },
  
  // Get chart by ID
  getChart: (id) => {
    return get().charts.find((chart) => chart.id === id);
  },
  
  // Set loading state
  setLoading: (isLoading) => {
    set({ isLoading });
  },
  
  // Update dashboard title
  setTitle: (title) => {
    set({ dashboardTitle: title });
  },
  
  // Duplicate a chart
  duplicateChart: (id) => {
    const chart = get().charts.find((c) => c.id === id);
    if (chart) {
      const duplicate = {
        ...chart,
        id: `chart_${Date.now()}`,
        title: `${chart.title} (Copy)`,
        position: {
          ...chart.position,
          y: chart.position.y + chart.position.h + 1, // Place below original
        },
        createdAt: new Date().toISOString(),
      };
      
      set((state) => ({
        charts: [...state.charts, duplicate],
        lastUpdated: new Date().toISOString(),
      }));
    }
  },
  
  // Refresh chart data
  refreshChart: async (id) => {
    // This will be called to re-fetch data from backend
    const chart = get().charts.find((c) => c.id === id);
    if (chart) {
      set((state) => ({
        charts: state.charts.map((c) =>
          c.id === id ? { ...c, isRefreshing: true } : c
        ),
      }));
      
      // Backend will handle the actual refresh
      // This just updates the UI state
    }
  },
  
  // Export dashboard configuration
  exportDashboard: () => {
    const state = get();
    return {
      title: state.dashboardTitle,
      charts: state.charts,
      layout: state.layout,
      exportedAt: new Date().toISOString(),
    };
  },
}));

export default useDashboardStore;
