import { useState, useRef, useEffect } from 'react';
import { Send, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendDashboardMessage } from '../../api/dashboardApi';
import useDashboardStore from '../../store/dashboardStore';
import { parseChartsFromResponse, generateEmployeePerformanceCharts } from '../../utils/chartDataParser';

/**
 * DashboardChatPanel - Left side chat interface
 * Allows users to create and modify dashboard via conversation
 */
export default function DashboardChatPanel({ isCollapsed, onToggleCollapse }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi! I\'m your AI Dashboard Assistant. I can help you create interactive analytics dashboards from your MongoDB data.\n\nTry asking me to:\n• Create a dashboard for a specific database\n• Add charts showing specific metrics\n• Modify existing charts\n• Analyze your data',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chartsAdded, setChartsAdded] = useState(0);
  const chatRef = useRef(null);
  const { addCharts, updateChart, charts, setLoading } = useDashboardStore();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setLoading(true);

    const messageToSend = input;
    setInput('');

    try {
      let botText = '';
      const botMsg = { role: 'assistant', text: '' };
      setMessages((prev) => [...prev, botMsg]);

      await sendDashboardMessage(messageToSend, (chunk) => {
        botText += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            text: botText,
          };
          return updated;
        });
      });

      // Don't automatically parse - let user click "Generate Charts" button instead
      // This prevents unwanted hardcoded charts from appearing
      console.log('AI response received. Click "Generate Charts" button to create visualizations.');
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          text: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // Parse dashboard commands from agent response
  const parseDashboardCommands = (text) => {
    console.log('=== Parsing dashboard commands ===');
    console.log('Response length:', text.length);
    
    // Try to parse chart data from response
    const parsedCharts = parseChartsFromResponse(text);
    
    if (parsedCharts.length > 0) {
      const currentChartCount = charts.length;
      console.log(`✅ Adding ${parsedCharts.length} new charts to dashboard (current: ${currentChartCount})`);
      addCharts(parsedCharts);
      setChartsAdded(parsedCharts.length);
      // Clear notification after 3 seconds
      setTimeout(() => setChartsAdded(0), 3000);
      console.log(`📊 Total charts: ${currentChartCount + parsedCharts.length}`);
    } else {
      console.warn('❌ Could not parse any charts from AI response');
      console.log('Response preview:', text.substring(0, 500));
      console.log('💡 Tip: Charts should be created automatically if the AI returns JSON data blocks');
    }
  };

  const handleGenerateChartsFromLastResponse = () => {
    if (messages.length > 0) {
      const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
      if (lastAssistantMessage) {
        parseDashboardCommands(lastAssistantMessage.text);
      }
    }
  };

  const suggestions = [
    'Show me top 5 collections by document count',
    'Analyze sales data from the database',
    'Display customer statistics',
    'Compare performance across departments',
  ];

  if (isCollapsed) {
    return (
      <div className="dashboard-chat-collapsed">
        <button className="expand-btn" onClick={onToggleCollapse}>
          <ChevronRight size={20} />
          <span className="expand-text">Chat</span>
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-chat-panel">
      {/* Header */}
      <div className="chat-panel-header">
        <div className="header-content">
          <Sparkles size={20} />
          <h3>AI Assistant</h3>
        </div>
        <button className="icon-btn" onClick={onToggleCollapse}>
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages" ref={chatRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              {msg.role === 'assistant' ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      {/* Generate Charts Button (always show when there are messages) */}
      {messages.length > 2 && (
        <div className="chat-suggestions">
          <p className="suggestions-title">
            {charts.length === 0 ? 'Generate Charts:' : 'Add More Charts:'}
          </p>
          <button
            className="suggestion-chip generate-charts-btn"
            onClick={handleGenerateChartsFromLastResponse}
          >
            {charts.length === 0 ? '📊 Generate Charts from Conversation' : '➕ Add More Charts from Conversation'}
          </button>
          {chartsAdded > 0 && (
            <div className="charts-added-notification">
              ✅ Added {chartsAdded} chart{chartsAdded > 1 ? 's' : ''} to dashboard!
            </div>
          )}
        </div>
      )}

      {/* Suggestions (when no charts) */}
      {charts.length === 0 && messages.length <= 2 && (
        <div className="chat-suggestions">
          <p className="suggestions-title">Quick start:</p>
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              className="suggestion-chip"
              onClick={() => setInput(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="chat-input-container">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me to create or modify charts..."
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={isLoading}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
