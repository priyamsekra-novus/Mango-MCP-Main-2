import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { CHART_CATEGORIES, COLOR_SCHEMES } from '../../utils/chartConfigs';

/**
 * ChartEditorModal - Comprehensive chart editor
 * Allows users to modify chart type, data, styling, and options
 */
export default function ChartEditorModal({ chart, onSave, onClose }) {
  const [editedChart, setEditedChart] = useState({ ...chart });
  const [activeTab, setActiveTab] = useState('type');

  const handleSave = () => {
    onSave(editedChart);
    onClose();
  };

  const updateChart = (field, value) => {
    setEditedChart((prev) => ({ ...prev, [field]: value }));
  };

  const updateStyle = (field, value) => {
    setEditedChart((prev) => ({
      ...prev,
      style: { ...prev.style, [field]: value },
    }));
  };

  const updateOptions = (field, value) => {
    setEditedChart((prev) => ({
      ...prev,
      options: { ...prev.options, [field]: value },
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content chart-editor-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Edit Chart</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'type' ? 'active' : ''}`}
            onClick={() => setActiveTab('type')}
          >
            Chart Type
          </button>
          <button
            className={`tab-btn ${activeTab === 'style' ? 'active' : ''}`}
            onClick={() => setActiveTab('style')}
          >
            Style
          </button>
          <button
            className={`tab-btn ${activeTab === 'options' ? 'active' : ''}`}
            onClick={() => setActiveTab('options')}
          >
            Options
          </button>
          <button
            className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            Data
          </button>
        </div>

        {/* Tab Content */}
        <div className="modal-body">
          {/* Chart Type Tab */}
          {activeTab === 'type' && (
            <div className="tab-content">
              <div className="form-group">
                <label>Chart Title</label>
                <input
                  type="text"
                  value={editedChart.title || ''}
                  onChange={(e) => updateChart('title', e.target.value)}
                  className="form-input"
                  placeholder="Enter chart title"
                />
              </div>

              <div className="form-group">
                <label>Chart Type</label>
                <div className="chart-type-grid">
                  {CHART_CATEGORIES.map((category) => (
                    <div key={category.name} className="chart-category">
                      <h4>{category.name}</h4>
                      <div className="type-buttons">
                        {category.types.map((type) => (
                          <button
                            key={type.value}
                            className={`type-btn ${editedChart.type === type.value ? 'active' : ''}`}
                            onClick={() => updateChart('type', type.value)}
                            title={type.description}
                          >
                            <span className="type-icon">{type.icon}</span>
                            <span className="type-label">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Style Tab */}
          {activeTab === 'style' && (
            <div className="tab-content">
              <div className="form-group">
                <label>Color Scheme</label>
                <div className="color-scheme-grid">
                  {Object.entries(COLOR_SCHEMES).map(([name, colors]) => (
                    <button
                      key={name}
                      className={`color-scheme-btn ${
                        JSON.stringify(editedChart.style?.colors) === JSON.stringify(colors)
                          ? 'active'
                          : ''
                      }`}
                      onClick={() => updateStyle('colors', colors)}
                    >
                      <div className="color-preview">
                        {colors.slice(0, 4).map((color, idx) => (
                          <div
                            key={idx}
                            className="color-swatch"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="color-scheme-name">{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {(editedChart.type === 'line' || editedChart.type === 'area') && (
                <div className="form-group">
                  <label>Line Width</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={editedChart.style?.strokeWidth || 2}
                    onChange={(e) => updateStyle('strokeWidth', parseInt(e.target.value))}
                    className="form-range"
                  />
                  <span>{editedChart.style?.strokeWidth || 2}px</span>
                </div>
              )}

              {editedChart.type === 'area' && (
                <div className="form-group">
                  <label>Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={editedChart.style?.opacity || 0.6}
                    onChange={(e) => updateStyle('opacity', parseFloat(e.target.value))}
                    className="form-range"
                  />
                  <span>{Math.round((editedChart.style?.opacity || 0.6) * 100)}%</span>
                </div>
              )}
            </div>
          )}

          {/* Options Tab */}
          {activeTab === 'options' && (
            <div className="tab-content">
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editedChart.options?.showLegend !== false}
                    onChange={(e) => updateOptions('showLegend', e.target.checked)}
                  />
                  Show Legend
                </label>
              </div>

              {['bar', 'line', 'area', 'scatter'].includes(editedChart.type) && (
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={editedChart.options?.showGrid !== false}
                      onChange={(e) => updateOptions('showGrid', e.target.checked)}
                    />
                    Show Grid
                  </label>
                </div>
              )}

              {editedChart.type === 'line' && (
                <>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={editedChart.options?.smooth !== false}
                        onChange={(e) => updateOptions('smooth', e.target.checked)}
                      />
                      Smooth Curves
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={editedChart.options?.showDots !== false}
                        onChange={(e) => updateOptions('showDots', e.target.checked)}
                      />
                      Show Data Points
                    </label>
                  </div>
                </>
              )}

              {editedChart.type === 'pie' && (
                <>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={editedChart.options?.showLabels !== false}
                        onChange={(e) => updateOptions('showLabels', e.target.checked)}
                      />
                      Show Labels
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={editedChart.options?.showPercentage !== false}
                        onChange={(e) => updateOptions('showPercentage', e.target.checked)}
                      />
                      Show Percentages
                    </label>
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Animation Duration (ms)</label>
                <input
                  type="number"
                  value={editedChart.options?.animationDuration || 300}
                  onChange={(e) => updateOptions('animationDuration', parseInt(e.target.value))}
                  className="form-input"
                  min="0"
                  max="2000"
                  step="100"
                />
              </div>
            </div>
          )}

          {/* Data Tab */}
          {activeTab === 'data' && (
            <div className="tab-content">
              <div className="form-group">
                <label>Data Preview</label>
                <div className="data-preview">
                  <pre>{JSON.stringify(editedChart.data, null, 2)}</pre>
                </div>
                <p className="form-help">
                  Data is managed by the AI agent. Use chat commands to modify data sources.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
