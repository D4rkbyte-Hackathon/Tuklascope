import React, { useRef, useEffect, useState } from 'react';
import { useChatbot } from '../contexts/ChatbotContext';

const ChatbotButton = () => {
  const { 
    messages, 
    isOpen, 
    isLoading, 
    openChatbot, 
    closeChatbot, 
    sendMessage 
  } = useChatbot();
  
  const [inputValue, setInputValue] = React.useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const messageToSend = inputValue.trim();
    setInputValue('');
    await sendMessage(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Button */}
      <div
        style={{
          position: 'fixed',
          bottom: isMobile ? 16 : 32,
          right: isMobile ? 16 : 32,
          zIndex: 200,
          width: isMobile ? 56 : 72,
          height: isMobile ? 56 : 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: isMobile ? 56 : 72,
            height: isMobile ? 56 : 72,
            borderRadius: '50%',
            background: '#FF6B2C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: isMobile ? 26 : 36,
            color: '#fff',
            fontWeight: 700,
            userSelect: 'none',
            boxShadow: '0 4px 12px rgba(255, 107, 44, 0.3)',
            transition: 'transform 0.2s ease',
          }}
          onClick={openChatbot}
          title="Open TuklasTutor"
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.currentTarget.style.transform = 'scale(1.1)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ?
        </div>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: isMobile ? 0 : 120,
            right: isMobile ? 0 : 40,
            left: isMobile ? 0 : 'auto',
            width: isMobile ? '100%' : 400,
            height: isMobile ? '100vh' : 500,
            background: '#fff',
            borderRadius: isMobile ? 0 : 18,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            zIndex: 201,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: '#FF6B2C',
              color: '#fff',
              padding: isMobile ? '20px 24px' : '16px 24px',
              borderRadius: isMobile ? 0 : '18px 18px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: isMobile ? 20 : 18 }}>TuklasTutor</div>
              <div style={{ fontSize: isMobile ? 14 : 12, opacity: 0.9 }}>Ask me anything!</div>
            </div>
            <button
              onClick={closeChatbot}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: isMobile ? 20 : 24, // Exactly match TuklasTutor text size on mobile
                cursor: 'pointer',
                padding: 0,
                width: isMobile ? 48 : 32, // Large touch target on mobile
                height: isMobile ? 48 : 32, // Large touch target on mobile
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 44, // Touch target size
              }}
            >
              ×
            </button>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              padding: isMobile ? '20px' : '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '16px' : '12px',
              WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
            }}
          >
            {messages.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                color: '#666', 
                fontSize: isMobile ? 16 : 14, 
                marginTop: 20,
                padding: isMobile ? '40px 20px' : '20px'
              }}>
                Start a conversation with your TuklasTutor!
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: isMobile ? '85%' : '80%',
                    padding: isMobile ? '16px 20px' : '12px 16px',
                    borderRadius: message.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: message.role === 'user' ? '#FF6B2C' : '#f3f4f6',
                    color: message.role === 'user' ? '#fff' : '#1f2937',
                    fontSize: isMobile ? 16 : 14,
                    lineHeight: 1.4,
                    wordWrap: 'break-word',
                  }}
                >
                  <div>{message.parts}</div>
                  <div
                    style={{
                      fontSize: isMobile ? 12 : 11,
                      opacity: 0.7,
                      marginTop: 4,
                      textAlign: message.role === 'user' ? 'right' : 'left',
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: isMobile ? '16px 20px' : '12px 16px',
                    borderRadius: '18px 18px 18px 4px',
                    background: '#f3f4f6',
                    color: '#1f2937',
                    fontSize: isMobile ? 16 : 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <div 
                        style={{ 
                          width: isMobile ? 8 : 6, 
                          height: isMobile ? 8 : 6, 
                          borderRadius: '50%', 
                          background: '#FF6B2C',
                          animation: 'bounce1 1.4s infinite ease-in-out'
                        }}
                      ></div>
                      <div 
                        style={{ 
                          width: isMobile ? 8 : 6, 
                          height: isMobile ? 8 : 6, 
                          borderRadius: '50%', 
                          background: '#FF6B2C',
                          animation: 'bounce2 1.4s infinite ease-in-out'
                        }}
                      ></div>
                      <div 
                        style={{ 
                          width: isMobile ? 8 : 6, 
                          height: isMobile ? 8 : 6, 
                          borderRadius: '50%', 
                          background: '#FF6B2C',
                          animation: 'bounce3 1.4s infinite ease-in-out'
                        }}
                      ></div>
                    </div>
                    <span style={{ fontSize: isMobile ? 16 : 14 }}>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: isMobile ? '20px' : '16px',
              borderTop: '1px solid #e5e7eb',
              background: '#fff',
            }}
          >
            <div style={{ display: 'flex', gap: isMobile ? 12 : 8 }}>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                style={{
                  flex: 1,
                  padding: isMobile ? '16px 20px' : '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: 20,
                  fontSize: isMobile ? 16 : 14,
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  minHeight: isMobile ? 48 : 44,
                  maxHeight: 100,
                }}
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                style={{
                  background: inputValue.trim() && !isLoading ? '#FF6B2C' : '#d1d5db',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: isMobile ? 48 : 44,
                  height: isMobile ? 48 : 44,
                  cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? 20 : 18,
                  transition: 'background-color 0.2s ease',
                  minHeight: 44, // Touch target size
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes bounce1 {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          @keyframes bounce2 {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          @keyframes bounce3 {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          .bounce1 { animation-delay: 0s; }
          .bounce2 { animation-delay: 0.2s; }
          .bounce3 { animation-delay: 0.4s; }
          
          /* Mobile-specific styles */
          @media (max-width: 768px) {
            .chatbot-modal {
              border-radius: 0 !important;
              bottom: 0 !important;
              right: 0 !important;
              left: 0 !important;
              width: 100% !important;
              height: 100vh !important;
            }
            
            .chatbot-header {
              padding: 20px 24px !important;
            }
            
            .chatbot-messages {
              padding: 20px !important;
              gap: 16px !important;
            }
            
            .chatbot-input {
              padding: 20px !important;
            }
            
            .chatbot-textarea {
              font-size: 16px !important;
              padding: 16px 20px !important;
              min-height: 48px !important;
            }
            
            .chatbot-send-button {
              width: 48px !important;
              height: 48px !important;
              font-size: 20px !important;
            }
          }
          
          /* Prevent zoom on iOS input focus */
          @media screen and (-webkit-min-device-pixel-ratio: 0) {
            .chatbot-textarea {
              font-size: 16px !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default ChatbotButton; 