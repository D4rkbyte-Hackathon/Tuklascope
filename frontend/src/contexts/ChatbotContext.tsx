import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { useUserEducation } from '../hooks/useUserEducation';

interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
  timestamp: Date;
}

interface ChatbotContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { education } = useUserEducation();

  const sendMessage = async (userQuestion: string) => {
    if (!userQuestion.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      parts: userQuestion.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare chat history for API (excluding timestamps)
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        parts: msg.parts
      }));

      const response = await fetch('http://localhost:8000/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_question: userMessage.parts,
          grade_level: education || 'Junior High (Grades 7-10)', // Use user's actual grade level with fallback
          chat_history: chatHistory,
          object_context: null // Can be updated later if needed
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from TuklasTutor');
      }

      const data = await response.json();
      
      const aiMessage: ChatMessage = {
        role: 'model',
        parts: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'model',
        parts: 'Sorry, TuklasTutor encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const openChatbot = () => setIsOpen(true);
  const closeChatbot = () => setIsOpen(false);
  const clearChat = () => setMessages([]);

  const value: ChatbotContextType = {
    messages,
    isOpen,
    isLoading,
    openChatbot,
    closeChatbot,
    sendMessage,
    clearChat,
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
}; 