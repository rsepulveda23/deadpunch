
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast({
          title: "Error resetting password",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsSubmitted(true);
        toast({
          title: "Password reset email sent",
          description: "Check your email for the password reset link.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-deadpunch-dark p-4">
      <div className="w-full max-w-md">
        <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png" 
                alt="Deadpunch" 
                className="h-16 object-contain" 
              />
            </div>
            <CardTitle className="text-2xl text-center font-bold text-white">Reset Your Password</CardTitle>
            <CardDescription className="text-deadpunch-gray-light text-center">
              {isSubmitted 
                ? "We've sent you an email with a link to reset your password" 
                : "Enter your email to receive a password reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-deadpunch-dark border-deadpunch-gray text-white"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-deadpunch-red hover:bg-deadpunch-red-hover"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4 py-4">
                <p className="text-center text-deadpunch-gray-light">
                  Check your email for the reset link. The link will expire in 24 hours.
                </p>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="w-full bg-deadpunch-red hover:bg-deadpunch-red-hover"
                >
                  Return to Sign In
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              className="text-deadpunch-red"
              onClick={() => navigate('/auth')}
            >
              Back to Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
