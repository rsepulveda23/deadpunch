
import React from 'react';
import { HelpCircle } from 'lucide-react';

interface ChatHintProps {
  show: boolean;
}

/**
 * ChatHint Component
 * 
 * Small hint message that prompts users to engage with the chat
 */
const ChatHint = ({ show }: ChatHintProps) => {
  if (!show) return null;
  
  return (
    <div className="absolute bottom-16 right-0 transform transition-all duration-300 ease-in-out">
      <div className="bg-deadpunch-dark text-white rounded-lg p-3 shadow-lg mb-2 max-w-[200px] border border-deadpunch-gray-dark">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle size={16} className="text-deadpunch-red" />
          <span className="font-medium text-sm">Have questions?</span>
        </div>
        <p className="text-xs text-deadpunch-gray-light">Click to chat with us!</p>
      </div>
    </div>
  );
};

export default ChatHint;
