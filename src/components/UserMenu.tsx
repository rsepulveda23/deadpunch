
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { LogOut, User, Settings } from 'lucide-react';

const UserMenu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (!user) {
    return (
      <Button 
        variant="default" 
        className="bg-deadpunch-red hover:bg-deadpunch-red-hover text-white"
        onClick={() => navigate('/auth')}
      >
        Sign In
      </Button>
    );
  }

  const getUserInitials = () => {
    const email = user.email || '';
    return email.substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed out",
          description: "You've been successfully signed out.",
        });
        navigate('/');
      }
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full focus:ring-0 focus:ring-offset-0">
          <Avatar className="h-9 w-9 bg-deadpunch-red">
            <AvatarFallback className="text-white">{getUserInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
        <DropdownMenuLabel className="text-deadpunch-gray-light">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-deadpunch-gray-dark" />
        <DropdownMenuItem className="text-white cursor-pointer hover:bg-deadpunch-dark" onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white cursor-pointer hover:bg-deadpunch-dark" onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-deadpunch-gray-dark" />
        <DropdownMenuItem 
          className="text-red-500 cursor-pointer hover:bg-deadpunch-dark" 
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isSigningOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
