
import { useState } from 'react';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const EmailForm = () => {
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
    
    // Simulate API call
    try {
      // Here you would connect to Supabase 
      // This is just simulating the request for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      toast({
        title: "Success!",
        description: "You've been added to our notification list.",
        variant: "default"
      });
      
      // Reset the form after 2 seconds
      setTimeout(() => {
        setEmail('');
        setIsSuccess(false);
      }, 2000);
      
    } catch (error) {
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
            <p className="text-xs text-deadpunch-gray-light text-center mt-4">
              We respect your privacy and will never share your information.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EmailForm;
