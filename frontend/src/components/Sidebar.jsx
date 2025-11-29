import { LayoutDashboard, MessageSquare, Database, Settings, Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar({ activeView, setActiveView }) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'ai-dashboard', icon: Sparkles, label: 'AI Dashboard Assistant' },
    { id: 'chat', icon: MessageSquare, label: 'AI Assistant' },
    { id: 'explorer', icon: Database, label: 'Database Explorer' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Database className="sidebar-logo" size={32} />
          {isOpen && <h2 className="sidebar-title">MongoDB AI</h2>}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
              title={!isOpen ? item.label : ''}
            >
              <item.icon size={20} />
              {isOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">V</div>
            {isOpen && (
              <div className="user-info">
                <p className="user-name">Vatsal Joshi</p>
                <p className="user-role">Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
