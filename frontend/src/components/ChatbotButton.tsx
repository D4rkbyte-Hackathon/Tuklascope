import React, { useState } from 'react';

const ChatbotButton = () => {
  const [open, setOpen] = useState(false);

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
          }}
          onClick={() => setOpen(true)}
          title="Open Chatbot"
        >
          ?
        </div>
      </div>
      {/* Modal Placeholder */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 120,
            right: 40,
            width: 340,
            minHeight: 220,
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            zIndex: 201,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 22, color: '#FF6B2C', marginBottom: 12 }}>Chatbot</div>
          <div style={{ color: '#1F2937', fontSize: 16, textAlign: 'center', marginBottom: 24 }}>
            This is a placeholder for your chatbot UI.<br />You can add your chat interface here!
          </div>
          <button
            style={{
              background: '#FF6B2C',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 24px',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
            }}
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default ChatbotButton; 