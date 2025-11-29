import { Database, Table, FileText, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function DatabaseExplorer() {
  const [selectedDb, setSelectedDb] = useState(null);

  const databases = [
    {
      name: 'employee_performance_db',
      size: '2.4 MB',
      collections: [
        { name: 'employees', documents: 100, size: '450 KB' },
        { name: 'departments', documents: 5, size: '12 KB' },
        { name: 'performance_kpis', documents: 400, size: '1.2 MB' },
        { name: 'payroll', documents: 500, size: '650 KB' },
        { name: 'attendance', documents: 2500, size: '180 KB' },
      ]
    },
    {
      name: 'Sample_data',
      size: '8 KB',
      collections: [
        { name: 'test_collection', documents: 10, size: '8 KB' },
      ]
    },
    {
      name: 'test',
      size: '389 KB',
      collections: [
        { name: 'users', documents: 50, size: '200 KB' },
        { name: 'logs', documents: 150, size: '189 KB' },
      ]
    }
  ];

  return (
    <div className="database-explorer">
      <div className="explorer-header">
        <h1>Database Explorer</h1>
        <p className="explorer-subtitle">Browse your MongoDB databases and collections</p>
      </div>

      <div className="explorer-content">
        <div className="databases-list">
          <h3 className="section-title">
            <Database size={18} />
            Databases
          </h3>
          {databases.map((db, idx) => (
            <div key={idx} className="database-item">
              <button
                className={`db-button ${selectedDb === db.name ? 'active' : ''}`}
                onClick={() => setSelectedDb(selectedDb === db.name ? null : db.name)}
              >
                <div className="db-info">
                  <Database size={16} />
                  <span>{db.name}</span>
                </div>
                <div className="db-meta">
                  <span className="db-size">{db.size}</span>
                  <ChevronRight 
                    size={16} 
                    className={`chevron ${selectedDb === db.name ? 'rotated' : ''}`}
                  />
                </div>
              </button>

              {selectedDb === db.name && (
                <div className="collections-list">
                  {db.collections.map((col, colIdx) => (
                    <div key={colIdx} className="collection-item">
                      <Table size={14} />
                      <div className="collection-info">
                        <span className="collection-name">{col.name}</span>
                        <span className="collection-meta">
                          {col.documents} docs • {col.size}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="explorer-details">
          {selectedDb ? (
            <div className="details-content">
              <h3>Database Details: {selectedDb}</h3>
              <div className="details-grid">
                <div className="detail-card">
                  <FileText size={20} />
                  <div>
                    <p className="detail-label">Total Collections</p>
                    <p className="detail-value">
                      {databases.find(db => db.name === selectedDb)?.collections.length || 0}
                    </p>
                  </div>
                </div>
                <div className="detail-card">
                  <Database size={20} />
                  <div>
                    <p className="detail-label">Total Size</p>
                    <p className="detail-value">
                      {databases.find(db => db.name === selectedDb)?.size || '0 KB'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="schema-preview">
                <h4>Collections Overview</h4>
                <div className="schema-list">
                  {databases.find(db => db.name === selectedDb)?.collections.map((col, idx) => (
                    <div key={idx} className="schema-item">
                      <div className="schema-header">
                        <Table size={16} />
                        <span>{col.name}</span>
                      </div>
                      <div className="schema-stats">
                        <span>{col.documents} documents</span>
                        <span>{col.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-details">
              <Database size={48} opacity={0.3} />
              <p>Select a database to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
