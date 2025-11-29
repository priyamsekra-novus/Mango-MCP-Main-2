import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ChatInterface from "./components/ChatInterface";
import DatabaseExplorer from "./components/DatabaseExplorer";
import AIDashboardAssistant from "./components/AIDashboard/AIDashboardAssistant";
import "./styles.css";

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    console.log('Current active view:', activeView);
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'ai-dashboard':
        return <AIDashboardAssistant />;
      case 'chat':
        return <ChatInterface />;
      case 'explorer':
        return <DatabaseExplorer />;
      case 'settings':
        return (
          <div className="settings-view">
            <h1>Settings</h1>
            <p>Settings panel coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}
