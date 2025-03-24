
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { generateChatResponse } from '@/lib/openai';
import { saveEmailSubscription } from '@/lib/supabase';

interface ChatUIProps {
  onClose: () => void;
  isMobile?: boolean;
}

type MessageType = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
};

// Initial welcome message from the bot
const initialMessages: MessageType[] = [
  {
    role: 'assistant',
    content: 'Hey there! I'm the DEADPUNCH assistant. How can I help you today?',
    timestamp: Date.now(),
  },
];

const ChatUI = ({ onClose, isMobile = false }: ChatUIProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input.trim(), timestamp: Date.now() } as MessageType;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Email capture logic
      if (input.toLowerCase().includes('@') && 
          (input.toLowerCase().includes('subscribe') || 
           input.toLowerCase().includes('notify') || 
           input.toLowerCase().includes('update') || 
           input.toLowerCase().includes('email'))) {
        
        // Extract email using regex
        const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
        const found = input.match(emailRegex);
        
        if (found && found[0]) {
          const email = found[0];
          const result = await saveEmailSubscription(email);
          
          if (result.success) {
            const successMessage = { 
              role: 'assistant', 
              content: `Thanks! I've added your email (${email}) to our notification list. You'll be among the first to know when DEADPUNCH launches!`,
              timestamp: Date.now() 
            } as MessageType;
            
            setMessages(prev => [...prev, successMessage]);
            toast({
              title: "Success!",
              description: "Your email has been added to our notification list.",
            });
          } else {
            // If it failed, let the user know
            const errorMessage = { 
              role: 'assistant', 
              content: "I couldn't add your email to our list. It might already be registered or there was a technical issue. Please try again or use the form at the bottom of the page.",
              timestamp: Date.now() 
            } as MessageType;
            
            setMessages(prev => [...prev, errorMessage]);
          }
          
          setIsLoading(false);
          return;
        }
      }
      
      // Regular chatbot response
      const response = await generateChatResponse(
        messages.filter(m => m.role !== 'system')
      );
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response, 
        timestamp: Date.now() 
      }]);
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please try again later.",
        timestamp: Date.now() 
      }]);
      
      toast({
        title: "Error",
        description: "Couldn't get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col ${isMobile ? 'h-full' : 'h-[500px]'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-deadpunch-dark-lighter bg-deadpunch-dark-lighter">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png" 
            alt="DEADPUNCH" 
            className="h-6" 
          />
          <h3 className="font-display text-white">DEADPUNCH Assistant</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-deadpunch-gray-light hover:text-white">
          <X size={18} />
        </Button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1A1A1A]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-deadpunch-red text-white'
                  : 'bg-deadpunch-dark-lighter text-white'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.timestamp && (
                <div className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-4 bg-deadpunch-dark-lighter text-white">
              <Loader2 className="animate-spin h-4 w-4" />
            </div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-deadpunch-dark-lighter">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-deadpunch-dark-lightest border-deadpunch-dark-lighter focus:border-deadpunch-red"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="bg-deadpunch-red hover:bg-deadpunch-red-hover text-white"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-deadpunch-gray-light mt-2 text-center">
          Powered by OpenAI
        </p>
      </form>
    </div>
  );
};

export default ChatUI;
