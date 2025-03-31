
import React, { useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { saveEmailSubscription } from '@/lib/supabase';

interface EmailSubscriptionFormProps {
  category: string;
  subcategory: string;
  onSuccess: () => void;
}

/**
 * EmailSubscriptionForm Component
 * 
 * Handles the collection and submission of user email addresses for notification
 * when a product or feature becomes available.
 */
export const EmailSubscriptionForm = ({ 
  category, 
  subcategory, 
  onSuccess 
}: EmailSubscriptionFormProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  /**
   * Handles the email subscription form submission
   * Validates the email, submits to Supabase, and shows appropriate feedback
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save email subscription with metadata about source
      const result = await saveEmailSubscription(email, {
        category, 
        subcategory,
        source: 'coming_soon_page'
      });
      
      if (result.success) {
        setIsSuccess(true);
        
        if (result.mock) {
          toast({
            title: "Development Mode",
            description: "Email saved in development mode. Connect Supabase to enable database storage.",
            variant: "default"
          });
        } else {
          toast({
            title: "Success!",
            description: "You've been added to our notification list.",
            variant: "default"
          });
        }
        
        // Reset the form after 2 seconds and notify parent
        setTimeout(() => {
          setEmail('');
          setIsSuccess(false);
          onSuccess();
        }, 2000);
      } else {
        throw new Error('Failed to save subscription');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Something went wrong",
        description: "There was an error submitting your email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-deadpunch-gray-light">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
          disabled={isSubmitting || isSuccess}
          required
        />
      </div>
      
      <Button
        type="submit"
        className={`w-full ${
          isSuccess 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : ''
        }`}
        disabled={isSubmitting || isSuccess}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin mr-2" size={18} />
            <span>Submitting...</span>
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle size={18} className="mr-2" />
            <span>Subscribed!</span>
          </>
        ) : (
          'Notify Me'
        )}
      </Button>
    </form>
  );
};
