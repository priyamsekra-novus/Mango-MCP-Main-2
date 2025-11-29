import { useState, useEffect } from 'react';
import { LayoutDashboard } from 'lucide-react';
import DashboardPanel from './DashboardPanel';
import DashboardChatPanel from './DashboardChatPanel';
import useDashboardStore from '../../store/dashboardStore';

/**
 * AI Dashboard Assistant - Main component
 * Split view: Chat on left, Interactive Dashboard on right
 */
export default function AIDashboardAssistant() {
  const { dashboardTitle, charts, isLoading } = useDashboardStore();
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);

  return (
    <div className="ai-dashboard-assistant">
      {/* Header */}
      <div className="dashboard-assistant-header">
        <div className="header-left">
          <LayoutDashboard size={24} />
          <div>
            <h1>{dashboardTitle}</h1>
            <p className="subtitle">AI-powered interactive analytics dashboard</p>
          </div>
        </div>
        <div className="header-right">
          {charts.length > 0 && (
            <span className="chart-count-badge">
              {charts.length} {charts.length === 1 ? 'chart' : 'charts'}
            </span>
          )}
          {isLoading && <div className="loading-spinner" />}
        </div>
      </div>

      {/* Main Split View */}
      <div className={`dashboard-split-view ${isChatCollapsed ? 'chat-collapsed' : ''}`}>
        {/* Left Side: Chat Panel */}
        <DashboardChatPanel 
          isCollapsed={isChatCollapsed}
          onToggleCollapse={() => setIsChatCollapsed(!isChatCollapsed)}
        />

        {/* Right Side: Dashboard Panel */}
        <DashboardPanel />
      </div>
    </div>
  );
}
