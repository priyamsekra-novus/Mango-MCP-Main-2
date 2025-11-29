import { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, Copy, RefreshCw, MoreVertical } from 'lucide-react';
import UniversalChartRenderer from './UniversalChartRenderer';

/**
 * ChartWidget - Individual chart component with interactions
 * Supports drag, resize, edit, delete, duplicate, refresh
 */
export default function ChartWidget({ 
  id, 
  type, 
  title, 
  data, 
  options, 
  style,
  onEdit,
  onDelete,
  onDuplicate,
  onRefresh
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      // Use capture phase to ensure we catch the click before drag handler
      document.addEventListener('mousedown', handleClickOutside, true);
      return () => document.removeEventListener('mousedown', handleClickOutside, true);
    }
  }, [showMenu]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh(id);
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleEdit = () => {
    console.log('Edit clicked for chart:', id);
    setShowMenu(false);
    if (onEdit) {
      onEdit(id);
    } else {
      console.warn('onEdit handler not provided');
    }
  };

  const handleDelete = () => {
    console.log('Delete clicked for chart:', id);
    if (confirm('Are you sure you want to delete this chart?')) {
      if (onDelete) {
        onDelete(id);
      } else {
        console.warn('onDelete handler not provided');
      }
    }
    setShowMenu(false);
  };

  const handleDuplicate = () => {
    console.log('Duplicate clicked for chart:', id);
    setShowMenu(false);
    if (onDuplicate) {
      onDuplicate(id);
    } else {
      console.warn('onDuplicate handler not provided');
    }
  };

  return (
    <div className="chart-widget">
      {/* Chart Header with Drag Handle */}
      <div className="chart-header drag-handle">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            className="icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleRefresh();
            }}
            disabled={isRefreshing}
            title="Refresh data"
          >
            <RefreshCw size={16} className={isRefreshing ? 'spinning' : ''} />
          </button>
          <button 
            className="icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            title="Edit chart"
          >
            <Edit size={16} />
          </button>
          <div className="menu-container" ref={menuRef}>
            <button 
              className="icon-btn"
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShowMenu(!showMenu);
              }}
              title="More options"
            >
              <MoreVertical size={16} />
            </button>
            
            {showMenu && (
              <div className="chart-context-menu" onMouseDown={(e) => e.stopPropagation()}>
                <button 
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleEdit();
                  }}
                >
                  <Edit size={14} />
                  <span>Edit Chart</span>
                </button>
                <button 
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleDuplicate();
                  }}
                >
                  <Copy size={14} />
                  <span>Duplicate</span>
                </button>
                <button 
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleRefresh();
                  }}
                >
                  <RefreshCw size={14} />
                  <span>Refresh Data</span>
                </button>
                <div className="menu-divider"></div>
                <button 
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleDelete();
                  }} 
                  className="delete-btn"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart Body */}
      <div className="chart-body">
        {data && data.length > 0 ? (
          <UniversalChartRenderer
            type={type}
            data={data}
            options={options}
            style={style}
          />
        ) : (
          <div className="chart-empty">
            <p>No data available</p>
          </div>
        )}
      </div>

      {/* Chart Footer (optional - can show metadata) */}
      <div className="chart-footer">
        <span className="chart-type-badge">{type}</span>
        {data && <span className="chart-count">{data.length} items</span>}
      </div>
    </div>
  );
}
