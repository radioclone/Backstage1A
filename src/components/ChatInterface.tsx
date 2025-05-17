'use client';

import { useState, useEffect, useRef } from 'react';
import useStore from '@/lib/stateManager';
import { useAgents } from '@/hooks/useAgents';
import { AgentMessage } from '@/types/global';

/**
 * Chat interface component for multi-user and agent interactions
 */
export default function ChatInterface(): JSX.Element {
  // Get state from store
  const { messages, addMessage } = useStore();
  
  // Get agent functionality
  const { getAgentResponses } = useAgents();
  
  // Local state
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);
  
  // Trigger agent responses periodically
  useEffect(() => {
    // Only trigger when chat is open
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      getAgentResponses();
    }, 15000); // Every 15 seconds
    
    return () => clearInterval(interval);
  }, [isOpen, getAgentResponses]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Create user message
    const userMessage: AgentMessage = {
      id: crypto.randomUUID(),
      sender: 'You',
      content: inputValue,
      timestamp: Date.now(),
      type: 'text'
    };
    
    // Add to chat
    addMessage(userMessage);
    
    // Clear input
    setInputValue('');
    
    // Trigger agent responses
    setTimeout(() => {
      getAgentResponses();
    }, 1000);
  };
  
  // Toggle chat open/closed
  const toggleChat = (): void => {
    setIsOpen(!isOpen);
  };
  
  // Format timestamp
  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className={`chat-container ${isOpen ? 'open' : 'closed'}`}>
      <button className="chat-toggle" onClick={toggleChat}>
        {isOpen ? 'Close Chat' : 'Open Chat'}
      </button>
      
      <div className="chat-content">
        <div className="chat-header">
          <h2>Festival Chat</h2>
        </div>
        
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <p>No messages yet. Say hello!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'You' ? 'user-message' : 'agent-message'}`}
              >
                <div className="message-header">
                  <span className="sender">{message.sender}</span>
                  <span className="timestamp">{formatTime(message.timestamp)}</span>
                </div>
                <div className="message-content">{message.content}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form className="chat-input" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
      
      <style jsx>{`
        .chat-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 350px;
          height: 500px;
          background-color: rgba(0, 0, 0, 0.8);
          border-radius: 10px;
          color: white;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease;
          z-index: 100;
        }
        
        .chat-container.closed {
          transform: translateY(calc(100% - 50px));
        }
        
        .chat-toggle {
          height: 50px;
          background-color: transparent;
          border: 1px solid #ffffff;
          border-radius: 10px 10px 0 0;
          color: white;
          font-weight: bold;
          cursor: pointer;
        }
        
        .chat-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .chat-header {
          padding: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .chat-header h2 {
          margin: 0;
          font-size: 1.2rem;
        }
        
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
        }
        
        .empty-chat {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.5;
        }
        
        .message {
          margin-bottom: 10px;
          padding: 10px;
          border-radius: 5px;
          max-width: 80%;
        }
        
        .user-message {
          background-color: transparent;
          border: 1px solid #ffffff;
          align-self: flex-end;
          margin-left: auto;
        }
        
        .agent-message {
          background-color: #333;
          align-self: flex-start;
        }
        
        .message-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 0.8rem;
        }
        
        .sender {
          font-weight: bold;
        }
        
        .timestamp {
          opacity: 0.7;
        }
        
        .message-content {
          word-break: break-word;
        }
        
        .chat-input {
          display: flex;
          padding: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .chat-input input {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 5px 0 0 5px;
          background-color: #333;
          color: white;
        }
        
        .chat-input button {
          padding: 10px 15px;
          background-color: transparent;
          border: 1px solid #ffffff;
          border-radius: 0 5px 5px 0;
          color: #ffffff;
          font-weight: bold;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
