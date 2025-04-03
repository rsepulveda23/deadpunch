
import { useState } from 'react';
import { Mail, Loader2, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
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
import { saveEmailSubscription, testSupabaseConnection } from '@/lib/supabase';

interface NotifyDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const NotifyDialog = ({ trigger, open, onOpenChange }: NotifyDialogProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const { toast } = useToast();
  
  const validateEmail = (email: string) => {
    // Basic email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  /**
   * Tests the Supabase connection
   * Useful for diagnosing issues
   */
  const handleTestConnection = async (e: React.MouseEvent) => {
    e.preventDefault();
    setDebugInfo('Testing connection...');
    
    try {
      const result = await testSupabaseConnection();
      setDebugInfo(result.success 
        ? `Connection successful: ${JSON.stringify(result.data)}` 
        : `Connection failed: ${JSON.stringify(result.error)}`
      );
    } catch (error) {
      setDebugInfo(`Test error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous error and debug state
    setErrorMsg(null);
    setDebugInfo(null);
    
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
      console.log("Submitting email from dialog:", email);
      setDebugInfo(`Attempting to save email: ${email}`);
      
      const result = await saveEmailSubscription(email, { 
        source: 'dialog', 
        timestamp: new Date().toISOString() 
      });
      
      console.log("Subscription result:", result);
      setDebugInfo(prev => `${prev}\nResult: ${JSON.stringify(result)}`);
      
      if (result.success) {
        setIsSuccess(true);
        setErrorMsg(null);
        
        // If it's a mock response, show a different message
        if (result.mock) {
          toast({
            title: "Development Mode",
            description: "Email saved in development mode. Connect Supabase to enable database storage.",
            variant: "default"
          });
        } else if (result.duplicate) {
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
        
        // Reset the form after 2 seconds
        setTimeout(() => {
          setEmail('');
          setIsSuccess(false);
          if (onOpenChange) {
            onOpenChange(false);
          }
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to save subscription');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setErrorMsg(`Failed to submit: ${errorMessage}`);
      setDebugInfo(prev => `${prev}\nError: ${errorMessage}`);
      toast({
        title: "Something went wrong",
        description: `There was an error submitting your email. Please try again later.`,
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
          {debugInfo && (
            <div className="text-xs text-deadpunch-gray-light mt-1 p-2 bg-deadpunch-dark-lighter rounded-md whitespace-pre-wrap">
              <span className="block font-medium mb-1">Debug info:</span>
              {debugInfo}
              <button 
                onClick={handleTestConnection}
                className="block mt-1 text-deadpunch-red text-xs underline"
              >
                Test connection
              </button>
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
        <div className="text-center pt-2">
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setDebugInfo(debugInfo ? null : "Click 'Test connection' to check Supabase connectivity");
            }}
            className="text-xs text-deadpunch-gray-light underline"
          >
            {debugInfo ? "Hide debug info" : "Show debug info"}
          </button>
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
