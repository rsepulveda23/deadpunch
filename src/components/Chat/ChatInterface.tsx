
/**
 * ChatInterface Component
 * 
 * A responsive, floating chat widget that provides AI assistance to users.
 * Features a toggle button, chat window with message history, and loading states.
 * Collects user email before allowing chat interaction.
 */

import React, { useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import EmailCollectionForm from './EmailCollectionForm';
import ChatHeader from './ChatHeader';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import ChatHint from './ChatHint';
import ChatToggleButton from './ChatToggleButton';
import { useChatMessages } from './hooks/useChatMessages';
import { useChatState } from './hooks/useChatState';

/**
 * ChatInterface Component
 * 
 * Provides a floating chat widget with AI assistance for users.
 */
const ChatInterface = () => {
  /**
   * Set up state using custom hooks
   */
  const {
    isOpen,
    showHint,
    hasProvidedEmail,
    toggleChat,
    markEmailProvided
  } = useChatState();
  
  const {
    messages,
    isLoading,
    sendMessage,
    addMessage,
    initializeChat
  } = useChatMessages();
  
  // Reference to the messages end for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Auto-scroll to bottom when messages change
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Initialize chat with welcome message when opened
   */
  useEffect(() => {
    if (isOpen) {
      initializeChat(hasProvidedEmail);
    }
  }, [isOpen, hasProvidedEmail]);

  /**
   * Handles successful email submission
   * 
   * @param {string} email - The submitted email
   * @param {boolean} success - Whether submission was successful
   */
  const handleEmailSubmitResult = (email: string, success: boolean) => {
    if (success) {
      // Add confirmation message
      const confirmationMessage: Message = {
        id: Date.now().toString(),
        content: 'Thank you for providing your email! How can I help you today?',
        isUser: false,
        timestamp: new Date(),
      };
      
      addMessage(confirmationMessage);
      
      // Mark as having provided email
      markEmailProvided();
    } else {
      // Add error message but allow chat to continue
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'Sorry, there was an issue saving your email. Please try again or proceed with your questions.',
        isUser: false,
        timestamp: new Date(),
      };
      
      addMessage(errorMessage);
    }
  };

  /**
   * Adds user email message to chat
   * 
   * @param {Message} message - The message object containing user email
   */
  const handleEmailMessage = (message: Message) => {
    addMessage(message);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat indicator message - only shows if not previously dismissed */}
      <ChatHint show={showHint && !isOpen} />

      {/* Chat toggle button */}
      <ChatToggleButton isOpen={isOpen} showHint={showHint} onClick={toggleChat} />

      {/* Chat window - only displayed when isOpen is true */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-[500px] bg-black rounded-lg shadow-2xl flex flex-col border border-gray-800 overflow-hidden transition-all duration-300 ease-in-out">
          {/* Chat header with brand logo and close button */}
          <ChatHeader onClose={toggleChat} />

          {/* Chat messages area with scroll */}
          <ChatWindow 
            messages={messages}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
          />

          {/* Chat input form - changes based on whether email is needed */}
          {!hasProvidedEmail ? (
            <EmailCollectionForm 
              onSubmit={handleEmailSubmitResult}
              onEmailMessage={handleEmailMessage}
            />
          ) : (
            <ChatInput onSubmit={sendMessage} isLoading={isLoading} />
          )}
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
