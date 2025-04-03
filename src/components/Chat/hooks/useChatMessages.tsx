
import { useState, useEffect } from 'react';
import { Message } from '@/types/chat';
import { sendChatMessage, defaultChatSettings } from '@/services/chatService';
import { useToast } from '@/hooks/use-toast';

/**
 * Custom hook to manage chat messages and API interactions
 */
export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Adds a user message to the chat and gets AI response
   * 
   * @param {string} userMessage - The user's input message
   */
  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;
    
    // Add user message to the chat
    const userMessageObj: Message = {
      id: Date.now().toString(),
      content: userMessage,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessageObj]);
    setIsLoading(true);

    try {
      console.log('[Chat] Sending message to AI:', userMessage);
      
      // Call the chat service using default settings
      const response = await sendChatMessage({
        message: userMessage,
        model: defaultChatSettings.model,
        systemPrompt: defaultChatSettings.systemPrompt
      });
      
      // Add AI response to the chat
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("[Chat] Error getting AI response:", error);
      
      // Show error toast if API call fails
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Adds a new message to the chat
   * 
   * @param {Message} message - The message to add
   */
  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  /**
   * Initializes the chat with a welcome message if empty
   */
  const initializeChat = (hasEmail: boolean) => {
    if (messages.length === 0) {
      if (hasEmail) {
        // Show regular welcome message if email was already provided
        addMessage({
          id: '1',
          content: 'Welcome to DEADPUNCH! How can I help you today?',
          isUser: false,
          timestamp: new Date(),
        });
      } else {
        // Show email request message if email not yet provided
        addMessage({
          id: '1',
          content: 'Welcome to DEADPUNCH! To help us serve you better, please provide your email address before we start chatting.',
          isUser: false,
          timestamp: new Date(),
        });
      }
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    addMessage,
    initializeChat,
  };
};
