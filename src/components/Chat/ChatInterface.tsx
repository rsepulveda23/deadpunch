
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { sendChatMessage, defaultChatSettings } from '@/services/chatService';
import { Message } from '@/types/chat';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(() => {
    // Check localStorage to see if hint has been dismissed
    return localStorage.getItem('chatHintDismissed') !== 'true';
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-hide hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    // If opening chat for the first time, mark hint as dismissed
    if (!isOpen && showHint) {
      setShowHint(false);
      localStorage.setItem('chatHintDismissed', 'true');
    }

    if (!isOpen && messages.length === 0) {
      // Add welcome message when opening an empty chat
      setMessages([
        {
          id: '1',
          content: 'Welcome to DEADPUNCH! How can I help you today?',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call the chat service with default settings - GPT-4o Mini
      const response = await sendChatMessage({
        message: inputValue,
        model: defaultChatSettings.model,
        systemPrompt: defaultChatSettings.systemPrompt
      });
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat indicator message - only shows if not previously dismissed */}
      {showHint && !isOpen && (
        <div className="absolute bottom-16 right-0 transform transition-all duration-300 ease-in-out">
          <div className="bg-deadpunch-dark text-white rounded-lg p-3 shadow-lg mb-2 max-w-[200px] border border-deadpunch-gray-dark">
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle size={16} className="text-deadpunch-red" />
              <span className="font-medium text-sm">Have questions?</span>
            </div>
            <p className="text-xs text-deadpunch-gray-light">Click to chat with us!</p>
          </div>
        </div>
      )}

      {/* Chat toggle button */}
      <Button 
        onClick={toggleChat} 
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

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-[500px] bg-deadpunch-dark rounded-lg shadow-2xl flex flex-col border border-deadpunch-gray-dark overflow-hidden transition-all duration-300 ease-in-out">
          {/* Chat header */}
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
              onClick={toggleChat}
              className="text-deadpunch-gray-light hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-area">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? 'bg-deadpunch-red text-white'
                      : 'bg-deadpunch-dark-lighter text-white'
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                  <span className="text-xs opacity-70 block mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-deadpunch-dark-lighter text-white">
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-deadpunch-red animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-deadpunch-red animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-deadpunch-red animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-deadpunch-gray-dark flex space-x-2">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-deadpunch-dark border-deadpunch-gray-dark focus:border-deadpunch-red"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-deadpunch-red hover:bg-deadpunch-red-hover"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
