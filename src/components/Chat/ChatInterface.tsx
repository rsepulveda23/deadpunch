
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { sendChatMessage } from '@/services/chatService';
import { Message } from '@/types/chat';

const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isApiKeyValid, setIsApiKeyValid] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check for saved API key in localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('chatApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setHasApiKey(true);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
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

  const validateApiKey = (key: string) => {
    // Basic validation: OpenAI API keys typically start with "sk-" and are around 51 characters
    return key.trim().startsWith('sk-') && key.trim().length > 40;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    if (!hasApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key first.",
        variant: "destructive",
      });
      return;
    }

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
      // Call the chat service
      const response = await sendChatMessage({
        message: inputValue,
        apiKey: apiKey,
      });
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // If we got an error message containing "API key", mark the key as invalid
      if (response.message.toLowerCase().includes("api key") && response.message.toLowerCase().includes("error")) {
        setIsApiKeyValid(false);
        toast({
          title: "API Key Error",
          description: "Your OpenAI API key appears to be invalid. Please check it and try again.",
          variant: "destructive",
        });
      } else {
        setIsApiKeyValid(true);
      }
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

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "API key cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate API key format
    if (!validateApiKey(apiKey)) {
      toast({
        title: "Invalid API Key Format",
        description: "Please enter a valid OpenAI API key. It should start with 'sk-' and be around 51 characters long.",
        variant: "destructive",
      });
      setIsApiKeyValid(false);
      return;
    }
    
    // Save API key to localStorage
    localStorage.setItem('chatApiKey', apiKey);
    setHasApiKey(true);
    setIsApiKeyValid(true);
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved. You can now start chatting with the GPT-4o-mini model.",
    });
  };

  const clearApiKey = () => {
    localStorage.removeItem('chatApiKey');
    setApiKey('');
    setHasApiKey(false);
    setIsApiKeyValid(true);
    toast({
      title: "API Key Removed",
      description: "Your API key has been removed.",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat toggle button */}
      <Button 
        onClick={toggleChat} 
        className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl bg-deadpunch-red hover:bg-deadpunch-red-hover transition-all duration-300"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-[500px] bg-deadpunch-dark rounded-lg shadow-2xl flex flex-col border border-deadpunch-gray-dark overflow-hidden transition-all duration-300 ease-in-out">
          {/* Chat header */}
          <div className="p-4 bg-deadpunch-dark-lighter border-b border-deadpunch-gray-dark flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/1bed301a-1af7-4ee5-9f14-78213e983de5.png" 
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

          {/* API Key form (shown only if API key not provided) */}
          {!hasApiKey ? (
            <div className="p-4 bg-deadpunch-dark-lighter border-b border-deadpunch-gray-dark">
              <form onSubmit={handleApiKeySubmit} className="space-y-2">
                <label htmlFor="api-key" className="block text-sm text-deadpunch-gray-light">
                  Enter your OpenAI API Key to start chatting with GPT-4o-mini
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Your OpenAI API key"
                    className={`flex-1 bg-deadpunch-dark border-deadpunch-gray-dark ${!isApiKeyValid ? 'border-red-500' : ''}`}
                  />
                  <Button type="submit" variant="default" size="sm">
                    Save
                  </Button>
                </div>
                {!isApiKeyValid && (
                  <p className="text-xs text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Invalid API key format. Should start with sk-
                  </p>
                )}
              </form>
            </div>
          ) : (
            <div className="px-4 py-2 bg-deadpunch-dark-lighter border-b border-deadpunch-gray-dark flex justify-between items-center">
              <span className="text-xs text-deadpunch-gray-light">Using OpenAI GPT-4o-mini</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearApiKey}
                className="text-xs text-deadpunch-gray-light hover:text-white"
              >
                Reset Key
              </Button>
            </div>
          )}

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              disabled={isLoading || !hasApiKey}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !hasApiKey}
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
