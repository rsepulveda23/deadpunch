
import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatUI from './ChatUI';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const isMobile = useIsMobile();

  // Auto-open the chat after 5 seconds if user hasn't interacted yet
  useEffect(() => {
    if (!hasInteracted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasInteracted(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [hasInteracted]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  // If using Popover
  if (!isMobile) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <div className="fixed bottom-6 right-6 z-50">
          <PopoverTrigger asChild>
            <button 
              onClick={handleToggle}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-deadpunch-red hover:bg-deadpunch-red-hover text-white shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none"
              aria-label="Chat with us"
            >
              {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>
          </PopoverTrigger>
          
          <PopoverContent 
            side="top" 
            align="end" 
            className="p-0 w-80 sm:w-96 max-h-[600px] border border-deadpunch-dark-lighter backdrop-blur-md bg-deadpunch-dark/90"
            sideOffset={16}
          >
            <ChatUI onClose={() => setIsOpen(false)} />
          </PopoverContent>
        </div>
      </Popover>
    );
  }
  
  // Mobile fullscreen version
  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={handleToggle}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-deadpunch-red hover:bg-deadpunch-red-hover text-white shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none"
          aria-label="Chat with us"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-deadpunch-dark border-deadpunch-dark-lighter animate-fade-in">
          <ChatUI onClose={() => setIsOpen(false)} isMobile={true} />
        </div>
      )}
    </>
  );
};

export default ChatBubble;
