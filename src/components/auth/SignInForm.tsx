
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface SignInFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleSignIn: (e: React.FormEvent) => Promise<void>;
}

const SignInForm: React.FC<SignInFormProps> = ({
  email,
  password,
  isLoading,
  setEmail,
  setPassword,
  handleSignIn
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signin-email">Email</Label>
        <Input 
          id="signin-email" 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signin-password">Password</Label>
        <div className="relative">
          <Input 
            id="signin-password" 
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark"
            required
          />
          <Button 
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full aspect-square"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-deadpunch-red hover:bg-deadpunch-red-hover mt-6"
        disabled={isLoading}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default SignInForm;
