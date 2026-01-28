
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  onClose: () => void;
}

/**
 * ChatHeader Component
 * 
 * Header for the chat window with branding and close button
 */
const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <div className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="logo-container">
          <img
            src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png"
            alt="DEADPUNCH"
            className="h-6 object-contain"
          />
        </div>
        <span className="font-display text-lg">CHAT</span>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose}
        className="text-gray-400 hover:text-white"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ChatHeader;
