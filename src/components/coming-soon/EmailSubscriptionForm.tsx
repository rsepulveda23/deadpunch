import React, { useState } from 'react';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { saveEmailSubscription } from '@/lib/supabase';
import { validateEmailFormat, formatEmail } from '@/utils/emailUtils';

interface EmailSubscriptionFormProps {
  category: string;
  subcategory: string;
  onSuccess: () => void;
}

/**
 * EmailSubscriptionForm Component
 * 
 * A specialized email subscription form used on "Coming Soon" pages.
 * Collects name and email with additional metadata about which product/feature
 * the user is interested in.
 * 
 * @param {string} category - The product category (e.g., 'Training')
 * @param {string} subcategory - The product subcategory (e.g., 'Pool Tools')
 * @param {Function} onSuccess - Callback function to execute after successful submission
 */
export const EmailSubscriptionForm = ({ 
  category, 
  subcategory, 
  onSuccess 
}: EmailSubscriptionFormProps) => {
  // Form state management
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Handles the email and name submission form
   * 
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset state for new submission
    setErrorMsg(null);
    
    // Basic validation
    if (!name.trim()) {
      setErrorMsg("Please enter your name");
      toast({
        title: "Name required",
        description: "Please enter your name.",
        variant: "destructive"
      });
      return;
    }
    
    const formattedEmail = formatEmail(email);
    if (!formattedEmail || !validateEmailFormat(formattedEmail)) {
      setErrorMsg("Please enter a valid email address");
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    // Submit data to Supabase
    setIsSubmitting(true);
    
    try {
      console.log('[ComingSoon] Submitting subscription:', { name, email: formattedEmail, category, subcategory });
      
      // Save email with rich metadata, now including the name
      const result = await saveEmailSubscription(formattedEmail, {
        name: name.trim(),
        category, 
        subcategory,
        source: 'coming_soon_page',
        timestamp: new Date().toISOString()
      });
      
      // Handle successful submission
      if (result.success) {
        setIsSuccess(true);
        
        // Different message for duplicate vs new subscription
        if (result.duplicate) {
          toast({
            title: "Already Subscribed",
            description: "This email is already on our notification list.",
            variant: "default"
          });
        } else {
          toast({
            title: "Success!",
            description: "You've been added to our notification list.",
            variant: "default"
          });
        }
        
        // Reset form after delay and trigger parent callback
        setTimeout(() => {
          setName('');
          setEmail('');
          setIsSuccess(false);
          onSuccess(); // Notify parent component
        }, 2000);
      } else {
        // Handle errors from the service
        throw new Error(result.error || 'Failed to save subscription');
      }
    } catch (error) {
      console.error('[ComingSoon] Submission error:', error);
      
      setErrorMsg(`Failed to submit subscription`);
      toast({
        title: "Something went wrong",
        description: `There was an error submitting your details. Please try again later.`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-deadpunch-gray-light">
          Your Name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
          disabled={isSubmitting || isSuccess}
          required
        />
      </div>
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
        {errorMsg && (
          <div className="text-sm text-red-500 mt-1">
            <AlertTriangle className="inline-block mr-1" size={14} />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
      
      <Button
        type="submit"
        className={`w-full bg-deadpunch-red hover:bg-deadpunch-red-hover text-white ${
          isSuccess 
            ? 'bg-green-600 hover:bg-green-700' 
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
