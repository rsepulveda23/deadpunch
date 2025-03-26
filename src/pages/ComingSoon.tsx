
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { saveEmailSubscription } from '@/lib/supabase';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ComingSoonProps {
  category: string;
  subcategory: string;
}

const ComingSoon = ({ category, subcategory }: ComingSoonProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
        
        // Reset the form after 2 seconds
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
              <Link 
                to="/" 
                className="flex items-center px-6 py-3 bg-transparent border border-deadpunch-red text-deadpunch-red rounded-md hover:bg-deadpunch-red hover:text-white transition-colors duration-300"
              >
                <ArrowLeft className="mr-2" size={18} />
                Back to Home
              </Link>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button 
                    className="px-6 py-3 bg-deadpunch-red text-white rounded-md hover:bg-deadpunch-red/80 transition-colors duration-300"
                  >
                    Notify Me When Available
                  </button>
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
                    
                    <button
                      type="submit"
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                        isSuccess 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-deadpunch-red hover:bg-deadpunch-red/80 text-white'
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
