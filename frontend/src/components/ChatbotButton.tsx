import React, { useRef, useEffect } from 'react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
          bottom: 32,
          right: 32,
          zIndex: 200,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#FF6B2C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 36,
            color: '#fff',
            fontWeight: 700,
            userSelect: 'none',
            boxShadow: '0 4px 12px rgba(255, 107, 44, 0.3)',
            transition: 'transform 0.2s ease',
          }}
          onClick={openChatbot}
          title="Open TuklasTutor"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
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
            bottom: 120,
            right: 40,
            width: 400,
            height: 500,
            background: '#fff',
            borderRadius: 18,
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
              padding: '16px 24px',
              borderRadius: '18px 18px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>TuklasTutor</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>Ask me anything!</div>
            </div>
            <button
              onClick={closeChatbot}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: 24,
                cursor: 'pointer',
                padding: 0,
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#666', fontSize: 14, marginTop: 20 }}>
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
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: message.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: message.role === 'user' ? '#FF6B2C' : '#f3f4f6',
                    color: message.role === 'user' ? '#fff' : '#1f2937',
                    fontSize: 14,
                    lineHeight: 1.4,
                    wordWrap: 'break-word',
                  }}
                >
                  <div>{message.parts}</div>
                  <div
                    style={{
                      fontSize: 11,
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
                    padding: '12px 16px',
                    borderRadius: '18px 18px 18px 4px',
                    background: '#f3f4f6',
                    color: '#1f2937',
                    fontSize: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <div 
                        style={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          background: '#FF6B2C',
                          animation: 'bounce1 1.4s infinite ease-in-out'
                        }}
                      ></div>
                      <div 
                        style={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          background: '#FF6B2C',
                          animation: 'bounce2 1.4s infinite ease-in-out'
                        }}
                      ></div>
                      <div 
                        style={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          background: '#FF6B2C',
                          animation: 'bounce3 1.4s infinite ease-in-out'
                        }}
                      ></div>
                    </div>
                    Thinking...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '16px',
              borderTop: '1px solid #e5e7eb',
              background: '#fff',
            }}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: 20,
                  fontSize: 14,
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  minHeight: 44,
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
                  width: 44,
                  height: 44,
                  cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  transition: 'background-color 0.2s ease',
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
        `}
      </style>
    </>
  );
};

export default ChatbotButton; 