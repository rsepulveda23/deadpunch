
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { saveEmailSubscription } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ComingSoonProps {
  category?: string;
  subcategory?: string;
}

const ComingSoon = ({ category: propCategory, subcategory: propSubcategory }: ComingSoonProps = {}) => {
  // Extract route parameters
  const params = useParams();
  
  // Use props if provided, otherwise fall back to URL params
  const category = propCategory || params.category || 'Product';
  const subcategory = propSubcategory || params.tool || params.category || 'Feature';
  
  // Add navigate for proper navigation handling
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Handle dialog closing without redirecting
  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    // Don't do anything else when dialog closes - this prevents page navigation
  };

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
        
        // Reset the form after 2 seconds but don't navigate away
        setTimeout(() => {
          setEmail('');
          setIsSuccess(false);
          setIsDialogOpen(false);
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
    <div className="min-h-screen bg-deadpunch-dark flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 mt-16">
        <div className="w-full max-w-4xl mx-auto bg-deadpunch-dark-lighter rounded-lg shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {category} <span className="text-deadpunch-red">{subcategory}</span>
            </h1>
            
            <div className="w-24 h-1 bg-deadpunch-red mx-auto my-6"></div>
            
            <p className="text-xl md:text-2xl text-deadpunch-gray-light mb-8">
              We're working hard to bring you the best {subcategory.toLowerCase()} collection.
            </p>
            
            <div className="text-4xl md:text-6xl font-bold text-deadpunch-red mb-8">
              COMING SOON
            </div>
            
            <p className="text-deadpunch-gray-light mb-12">
              Check back later or sign up to be notified when we launch.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                variant="outline"
                asChild
              >
                <Link to="/">
                  <ArrowLeft className="mr-2" size={18} />
                  Back to Home
                </Link>
              </Button>
              
              {/* Updated Dialog to use our custom handler */}
              <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                  <Button>
                    Notify Me When Available
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white">Get Notified</DialogTitle>
                    <DialogDescription className="text-deadpunch-gray-light">
                      We'll let you know when {category} {subcategory} become available.
                    </DialogDescription>
                  </DialogHeader>
                  
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
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
