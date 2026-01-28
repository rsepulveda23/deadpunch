
import { useState } from 'react';
import { Mail, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { saveEmailSubscription } from '@/lib/supabase';
import { validateEmailFormat, formatEmail } from '@/utils/emailUtils';

/**
 * EmailForm Component
 * 
 * A homepage email subscription form that allows visitors to sign up
 * for notifications about DEADPUNCH product updates and launches.
 */
const EmailForm = () => {
  // Form state management
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();

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
    
    // Submit email to Supabase
    setIsSubmitting(true);
    
    try {
      console.log('[HomePage] Submitting email subscription:', formattedEmail);
      
      const result = await saveEmailSubscription(formattedEmail, { 
        source: 'homepage',
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
        }, 2000);
      } else {
        // Handle errors from the service
        throw new Error(result.error || 'Failed to save subscription');
      }
    } catch (error) {
      // Handle and display errors
      console.error('[HomePage] Email submission error:', error);
      
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

  return (
    <section id="notify" className="relative py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-radial from-deadpunch-red/5 to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto glass p-8 md:p-12 rounded-xl relative z-10 animate-reveal">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-deadpunch-red rounded-full flex items-center justify-center red-glow">
            <Mail className="text-white" size={20} />
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Be The First To Know
            </h2>
            <p className="text-deadpunch-gray-light">
              Sign up to receive exclusive updates and early access when DEADPUNCH launches.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="input-field flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || isSuccess}
                required
              />
              <button
                type="submit"
                className={`btn-primary min-w-[150px] flex items-center justify-center gap-2 bg-deadpunch-red hover:bg-deadpunch-red-hover ${
                  isSuccess ? 'bg-green-600 hover:bg-green-700' : ''
                }`}
                disabled={isSubmitting || isSuccess}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Submitting...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle size={18} />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  'Notify Me'
                )}
              </button>
            </div>
            
            {errorMsg && (
              <div className="text-sm text-red-500 flex items-center justify-center mt-2">
                <AlertTriangle className="mr-2" size={16} />
                <span>{errorMsg}</span>
              </div>
            )}
            
            <p className="text-xs text-deadpunch-gray-light text-center">
              We respect your privacy. No spam.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EmailForm;
