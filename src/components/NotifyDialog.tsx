
import { useState } from 'react';
import { Mail, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { saveEmailSubscription } from '@/lib/supabase';

interface NotifyDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * NotifyDialog Component
 * 
 * A reusable dialog for collecting email subscriptions throughout the app.
 * Can be used as both controlled and uncontrolled component.
 * 
 * @param {React.ReactNode} [trigger] - Optional trigger element for uncontrolled mode
 * @param {boolean} [open] - Optional open state for controlled mode
 * @param {Function} [onOpenChange] - Optional open state change handler for controlled mode
 */
const NotifyDialog = ({ trigger, open, onOpenChange }: NotifyDialogProps) => {
  // Form state management
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();
  
  /**
   * Validates email format using regex
   * 
   * @param {string} email - Email to validate
   * @returns {boolean} True if email format is valid
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handles the email submission form
   * 
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset state for new submission
    setErrorMsg(null);
    
    // Validate email format
    if (!email || !validateEmail(email)) {
      setErrorMsg("Please enter a valid email address");
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    // Submit email to Supabase
    setIsSubmitting(true);
    
    try {
      console.log('[Dialog] Submitting email subscription:', email);
      
      const result = await saveEmailSubscription(email, { 
        source: 'dialog', 
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
        
        // Reset form after delay for better UX
        setTimeout(() => {
          setEmail('');
          setIsSuccess(false);
          
          // Close dialog if in controlled mode
          if (onOpenChange) {
            onOpenChange(false);
          }
        }, 2000);
      } else {
        // Handle errors from the service
        throw new Error(result.error || 'Failed to save subscription');
      }
    } catch (error) {
      // Handle and display errors
      console.error('[Dialog] Email submission error:', error);
      
      setErrorMsg('Failed to submit email');
      toast({
        title: "Something went wrong",
        description: "There was an error submitting your email. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-[425px] bg-deadpunch-dark border-deadpunch-gray-dark text-white">
      <DialogHeader>
        <div className="mx-auto w-12 h-12 bg-deadpunch-red rounded-full flex items-center justify-center red-glow mb-4">
          <Mail className="text-white" size={20} />
        </div>
        <DialogTitle className="text-center text-xl">Be The First To Know</DialogTitle>
        <DialogDescription className="text-deadpunch-gray-light text-center">
          Sign up to receive exclusive updates and early access when DEADPUNCH launches.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter your email address"
            className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          className={`w-full ${
            isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-deadpunch-red hover:bg-deadpunch-red-hover'
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
              <CheckCircle className="mr-2" size={18} />
              <span>Subscribed!</span>
            </>
          ) : (
            'Notify Me'
          )}
        </Button>
        
        <div className="text-center space-y-1 pt-2">
          <p className="text-xs text-deadpunch-gray-light">
            We respect your privacy and will never share your information.
          </p>
          <p className="text-xs text-deadpunch-red font-medium">
            No spam, just heat.
          </p>
        </div>
      </form>
    </DialogContent>
  );
  
  // Support both controlled and uncontrolled usage
  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        {dialogContent}
      </Dialog>
    );
  }
  
  // Uncontrolled version with its own trigger
  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {dialogContent}
    </Dialog>
  );
};

export default NotifyDialog;
