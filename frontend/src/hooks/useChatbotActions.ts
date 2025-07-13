import { useChatbot } from '../contexts/ChatbotContext';

export const useChatbotActions = () => {
  const { openChatbot, closeChatbot, sendMessage, clearChat } = useChatbot();

  return {
    openChatbot,
    closeChatbot,
    sendMessage,
    clearChat,
  };
}; 