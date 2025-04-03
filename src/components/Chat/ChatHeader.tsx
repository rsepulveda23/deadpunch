
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
    <div className="p-4 bg-deadpunch-dark-lighter border-b border-deadpunch-gray-dark flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img 
          src="/lovable-uploads/4e57f636-100a-48d1-ae1e-dbfa44e28d6d.png" 
          alt="DEADPUNCH" 
          className="h-6 object-contain" 
        />
        <span className="font-display text-lg">CHAT</span>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose}
        className="text-deadpunch-gray-light hover:text-white"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ChatHeader;
