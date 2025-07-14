import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { useUserEducation } from '../hooks/useUserEducation';
import { db, auth} from '../database/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs
} from 'firebase/firestore';

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
    await saveMessageToFirestore(userMessage);

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
      await saveMessageToFirestore(aiMessage);
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
  const saveMessageToFirestore = async (message: ChatMessage) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, 'Chatbot-History', user.uid, 'tutorHistory'), {
        timestamp: serverTimestamp(),
        role: message.role,
        parts: message.parts
      });
    } catch (error) {
      console.error("Error saving chat message to Firestore:", error);
    }
  };

  useEffect(() => {
    const fetchMessagesFromFirestore = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, 'Chatbot-History', user.uid, 'tutorHistory'),
          orderBy('timestamp', 'asc')
        );

        const querySnapshot = await getDocs(q);
        const loadedMessages: ChatMessage[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          loadedMessages.push({
            role: data.role,
            parts: data.parts,
            timestamp: data.timestamp?.toDate?.() || new Date()
          });
        });

        setMessages(loadedMessages);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchMessagesFromFirestore();
  }, []);

    // const openChatbot = () => setIsOpen(true);
    const openChatbot = async () => {
    setIsOpen(true);

    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(
        collection(db, 'Chatbot-History', user.uid, 'tutorHistory'),
        orderBy('timestamp', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const loadedMessages: ChatMessage[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedMessages.push({
          role: data.role,
          parts: data.parts,
          timestamp: data.timestamp?.toDate?.() || new Date()
        });
      });

      setMessages(loadedMessages);
    } catch (error) {
      console.error('Error fetching chat history on open:', error);
    }
  };
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