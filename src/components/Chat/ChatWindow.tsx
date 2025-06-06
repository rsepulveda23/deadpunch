
import React from 'react';
import { Message } from '@/types/chat';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

/**
 * ChatWindow Component
 * 
 * Displays the chat message history with scrolling functionality
 */
const ChatWindow = ({ messages, isLoading, messagesEndRef }: ChatWindowProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-area">
      {/* Map through and display all messages */}
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              message.isUser
                ? 'bg-deadpunch-red text-white'
                : 'bg-gray-900 text-white'
            }`}
          >
            <p className="break-words">{message.content}</p>
            <span className="text-xs opacity-70 block mt-1">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      ))}
      
      {/* Loading indicator - only shows when waiting for API response */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg p-3 bg-gray-900 text-white">
            <div className="flex space-x-2 items-center">
              <div className="w-2 h-2 rounded-full bg-deadpunch-red animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-deadpunch-red animate-pulse delay-75"></div>
              <div className="w-2 h-2 rounded-full bg-deadpunch-red animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Invisible element for scroll reference */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
