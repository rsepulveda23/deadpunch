
import React from 'react';
import { X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatToggleButtonProps {
  isOpen: boolean;
  showHint: boolean;
  onClick: () => void;
}

/**
 * ChatToggleButton Component
 * 
 * Button to open/close the chat interface
 */
const ChatToggleButton = ({ isOpen, showHint, onClick }: ChatToggleButtonProps) => {
  return (
    <Button 
      onClick={onClick} 
      className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl bg-deadpunch-red hover:bg-deadpunch-red-hover transition-all duration-300 relative"
      aria-label="Toggle chat"
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <MessageSquare className="h-6 w-6" />
      )}
      
      {/* Notification dot - only shows if hint is visible */}
      {showHint && !isOpen && (
        <span className="absolute top-0 right-0 h-3 w-3 bg-white rounded-full animate-pulse"></span>
      )}
    </Button>
  );
};

export default ChatToggleButton;
