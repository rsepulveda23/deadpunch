
import { useState } from 'react';
import { Mail, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { saveEmailSubscription } from '@/lib/supabase';

const EmailForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    // Basic email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous error state
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
      const result = await saveEmailSubscription(email, { 
        source: 'homepage',
        timestamp: new Date().toISOString() 
      });
      
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
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to save subscription');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
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
                className={`btn-primary min-w-[150px] flex items-center justify-center gap-2 ${
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
            <div className="text-center space-y-1">
              <p className="text-xs text-deadpunch-gray-light">
                We respect your privacy and will never share your information.
              </p>
              <p className="text-xs text-deadpunch-red font-medium">
                No spam, just heat.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EmailForm;
