import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../api";
import ReactMarkdown from 'react-markdown';
import { Send, Trash2 } from 'lucide-react';

export default function ChatInterface() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chat_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(messages));
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let botText = "";
    const botMsg = { role: "assistant", text: "" };
    setMessages((prev) => [...prev, botMsg]);

    const messageToSend = input;
    setInput("");

    await sendMessage(messageToSend, (chunk) => {
      botText += chunk;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          text: botText,
        };
        return updated;
      });
    });

    setIsLoading(false);
  }

  function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      localStorage.removeItem("chat_history");
    }
  }

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div>
          <h1>AI Assistant</h1>
          <p className="chat-subtitle">Ask anything about your MongoDB data</p>
        </div>
        <button className="clear-btn" onClick={clearChat} title="Clear chat">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="chat-messages" ref={chatRef}>
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>Start a conversation</h3>
            <p>Ask me anything about your MongoDB databases, collections, or data analysis.</p>
            <div className="suggestion-chips">
              <button onClick={() => setInput("Show me all databases")}>Show all databases</button>
              <button onClick={() => setInput("List all employees")}>List employees</button>
              <button onClick={() => setInput("Department statistics")}>Department stats</button>
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              <div className="message-avatar">
                {m.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                {m.role === 'assistant' ? (
                  <div className="markdown-content">
                    <ReactMarkdown
                      components={{
                        // Custom renderer for links to detect image URLs
                        a: ({node, href, children, ...props}) => {
                          // Check if the URL is an image (common image hosting domains or extensions)
                          const isImageUrl = href && (
                            href.includes('alipayobjects.com') ||
                            href.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)
                          );
                          
                          if (isImageUrl) {
                            return (
                              <div className="chart-container" style={{margin: '1rem 0'}}>
                                <img 
                                  src={href} 
                                  alt="Generated Chart" 
                                  style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb'
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `<a href="${href}" target="_blank" rel="noopener noreferrer">View Chart: ${href}</a>`;
                                  }}
                                />
                              </div>
                            );
                          }
                          
                          return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
                        },
                        // Also handle actual markdown images
                        img: ({node, src, alt, ...props}) => (
                          <div className="chart-container" style={{margin: '1rem 0'}}>
                            <img 
                              src={src} 
                              alt={alt || 'Chart'} 
                              style={{
                                maxWidth: '100%',
                                height: 'auto',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb'
                              }}
                              {...props}
                            />
                          </div>
                        )
                      }}
                    >
                      {m.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p>{m.text}</p>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      <div className="chat-input-container">
        <input
          className="chat-input-modern"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          disabled={isLoading}
        />
        <button 
          className="send-btn-modern" 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
