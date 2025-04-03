
import { useState } from 'react';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { saveEmailSubscription } from '@/lib/supabase';

interface NotifyDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const NotifyDialog = ({ trigger, open, onOpenChange }: NotifyDialogProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
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
      const result = await saveEmailSubscription(email, { source: 'dialog' });
      
      if (result.success) {
        setIsSuccess(true);
        
        // If it's a mock response, show a different message
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
        
        // Reset the form after 2 seconds
        setTimeout(() => {
          setEmail('');
          setIsSuccess(false);
          if (onOpenChange) {
            onOpenChange(false);
          }
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
          <input
            type="email"
            placeholder="Enter your email address"
            className="input-field w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting || isSuccess}
            required
          />
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
  
  // If controlled from outside
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
