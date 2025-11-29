import { useState, useRef, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import ChartWidget from './ChartWidget';
import ChartEditorModal from './ChartEditorModal';
import useDashboardStore from '../../store/dashboardStore';
import { Plus, Download, Trash2 } from 'lucide-react';

/**
 * DashboardPanel - Right side panel with interactive grid layout
 * Contains draggable, resizable chart widgets
 */
export default function DashboardPanel() {
  const {
    charts,
    layout,
    updateLayout,
    updateChart,
    removeChart,
    duplicateChart,
    clearDashboard,
    exportDashboard,
  } = useDashboardStore();

  const [editingChartId, setEditingChartId] = useState(null);
  const [gridWidth, setGridWidth] = useState(1200);
  const gridContainerRef = useRef(null);

  // Calculate grid width dynamically
  useEffect(() => {
    const updateWidth = () => {
      if (gridContainerRef.current) {
        const width = gridContainerRef.current.offsetWidth - 32; // Subtract padding
        setGridWidth(width);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Convert charts to grid layout format
  const gridLayout = charts.map((chart, idx) => ({
    i: chart.id,
    x: chart.position?.x || (idx % 2) * 6,
    y: chart.position?.y || Math.floor(idx / 2) * 4,
    w: chart.position?.w || 6,
    h: chart.position?.h || 4,
    minW: 3,
    minH: 3,
  }));

  const handleLayoutChange = (newLayout) => {
    // Update positions in store
    updateLayout(newLayout);
    
    // Update each chart's position
    newLayout.forEach((item) => {
      updateChart(item.i, {
        position: { x: item.x, y: item.y, w: item.w, h: item.h },
      });
    });
  };

  const handleEditChart = (chartId) => {
    setEditingChartId(chartId);
  };

  const handleSaveChart = (updatedChart) => {
    updateChart(updatedChart.id, updatedChart);
    setEditingChartId(null);
  };

  const handleDeleteChart = (chartId) => {
    removeChart(chartId);
  };

  const handleDuplicateChart = (chartId) => {
    duplicateChart(chartId);
  };

  const handleExport = () => {
    const config = exportDashboard();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all charts from the dashboard?')) {
      clearDashboard();
    }
  };

  const editingChart = charts.find((c) => c.id === editingChartId);

  return (
    <div className="dashboard-panel">
      {/* Toolbar */}
      <div className="dashboard-toolbar">
        <div className="toolbar-left">
          <button className="btn-icon" title="Add Chart" disabled>
            <Plus size={18} />
            <span>Add Chart (Use Chat)</span>
          </button>
        </div>
        <div className="toolbar-right">
          <button className="btn-icon" onClick={handleExport} title="Export Dashboard">
            <Download size={18} />
          </button>
          <button 
            className="btn-icon" 
            onClick={handleClearAll} 
            title="Clear All"
            disabled={charts.length === 0}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="dashboard-grid-container" ref={gridContainerRef}>
        {charts.length === 0 ? (
          <div className="dashboard-empty">
            <div className="empty-icon">📊</div>
            <h3>No Charts Yet</h3>
            <p>Use the chat panel to create your first chart!</p>
            <div className="suggestion-box">
              <p className="suggestion-title">Try asking:</p>
              <ul>
                <li>"Show me top 5 collections by document count"</li>
                <li>"Analyze sales data and create charts"</li>
                <li>"Display customer statistics with visualizations"</li>
                <li>"Compare revenue across regions"</li>
              </ul>
              <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#888' }}>
                After the AI responds, click "📊 Generate Charts" to create visualizations
              </p>
            </div>
          </div>
        ) : (
          <GridLayout
            className="dashboard-grid"
            layout={gridLayout}
            cols={12}
            rowHeight={80}
            width={gridWidth}
            onLayoutChange={handleLayoutChange}
            draggableHandle=".drag-handle"
            compactType="vertical"
            preventCollision={false}
            isResizable={true}
            isDraggable={true}
            resizeHandles={['se']}
          >
            {charts.map((chart) => (
              <div key={chart.id} className="grid-item">
                <ChartWidget
                  {...chart}
                  onEdit={handleEditChart}
                  onDelete={handleDeleteChart}
                  onDuplicate={handleDuplicateChart}
                  onRefresh={(id) => {
                    console.log('Refresh chart:', id);
                    // TODO: Implement refresh via API
                  }}
                />
              </div>
            ))}
          </GridLayout>
        )}
      </div>

      {/* Chart Editor Modal */}
      {editingChart && (
        <ChartEditorModal
          chart={editingChart}
          onSave={handleSaveChart}
          onClose={() => setEditingChartId(null)}
        />
      )}
    </div>
  );
}
