
import React, { useState } from 'react';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setErrorMsg(null);
    
    // Validate email
    if (!email || !validateEmail(email)) {
      setErrorMsg("Please enter a valid email address");
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
        source: 'coming_soon_page',
        timestamp: new Date().toISOString()
      });
      
      if (result.success) {
        setIsSuccess(true);
        
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
        
        // Reset the form after success and notify parent
        setTimeout(() => {
          setEmail('');
          setIsSuccess(false);
          onSuccess();
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to save subscription');
      }
    } catch (error) {
      setErrorMsg(`Failed to submit email`);
      toast({
        title: "Something went wrong",
        description: `There was an error submitting your email. Please try again later.`,
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
