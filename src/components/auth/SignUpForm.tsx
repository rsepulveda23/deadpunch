
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface SignUpFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  isAdminEmailAuthorized: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleSignUp: (e: React.FormEvent) => Promise<void>;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  email,
  password,
  isLoading,
  isAdminEmailAuthorized,
  setEmail,
  setPassword,
  handleSignUp
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input 
          id="signup-email" 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark"
          required
          readOnly={isAdminEmailAuthorized}
        />
        {isAdminEmailAuthorized && (
          <p className="text-xs text-deadpunch-gray-light">This email is pre-authorized</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Input 
            id="signup-password" 
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark"
            required
            minLength={6}
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
        <p className="text-xs text-deadpunch-gray-light">Password must be at least 6 characters</p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-deadpunch-red hover:bg-deadpunch-red-hover mt-6"
        disabled={isLoading}
      >
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </Button>
    </form>
  );
};

export default SignUpForm;
