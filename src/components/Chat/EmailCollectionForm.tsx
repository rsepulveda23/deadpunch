
import React, { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { saveEmailSubscription } from '@/lib/supabase';
import { validateEmailFormat, formatEmail } from '@/utils/emailUtils';
import { Message } from '@/types/chat';

interface EmailCollectionFormProps {
  onSubmit: (email: string, success: boolean) => void;
  onEmailMessage: (message: Message) => void;
}

/**
 * EmailCollectionForm Component
 * 
 * A form for collecting email addresses in the chat interface.
 * Used to get user contact information before starting a chat.
 * 
 * @param {Function} onSubmit - Handler for email submission result
 * @param {Function} onEmailMessage - Handler to add user email as a message
 */
const EmailCollectionForm = ({ 
  onSubmit,
  onEmailMessage 
}: EmailCollectionFormProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  /**
   * Handles the email submission form
   * 
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email format
    const formattedEmail = formatEmail(email);
    if (!formattedEmail || !validateEmailFormat(formattedEmail) || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Add user's email as a chat message
      const userEmailMessage: Message = {
        id: Date.now().toString(),
        content: formattedEmail,
        isUser: true,
        timestamp: new Date(),
      };
      
      onEmailMessage(userEmailMessage);
      
      console.log('[Chat] Submitting email subscription from chat:', formattedEmail);
      
      // Save email to Supabase with chat-specific metadata
      const result = await saveEmailSubscription(formattedEmail, { 
        source: 'chat',
        captureLocation: 'chat interface',
        timestamp: new Date().toISOString()
      });
      
      if (result.success) {
        toast({
          title: "Email Saved",
          description: "Thanks for providing your email!",
          variant: "default"
        });
        
        onSubmit(formattedEmail, true);
      } else {
        throw new Error('Failed to save email');
      }
    } catch (error) {
      console.error('[Chat] Error saving email:', error);
      
      toast({
        title: "Error",
        description: "Failed to save your email. Please try again.",
        variant: "destructive",
      });
      
      onSubmit(email, false);
    } finally {
      setIsSubmitting(false);
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-deadpunch-gray-dark flex flex-col space-y-2">
      <div className="flex items-center text-deadpunch-gray-light text-sm mb-1">
        <Mail className="h-4 w-4 mr-1" />
        <span>Please provide your email to continue</span>
      </div>
      <div className="flex space-x-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 bg-deadpunch-dark border-deadpunch-gray-dark focus:border-deadpunch-red"
          disabled={isSubmitting}
          required
        />
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-deadpunch-red hover:bg-deadpunch-red-hover whitespace-nowrap"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-75"></div>
              <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-150"></div>
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
      <p className="text-xs text-deadpunch-gray-light mt-1">
        We'll use this to keep you updated on DEADPUNCH products and updates.
      </p>
    </form>
  );
};

export default EmailCollectionForm;
