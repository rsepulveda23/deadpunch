
import React from 'react';
import { Menu, X } from 'lucide-react';
import UserMenu from '../UserMenu';
import TikTokFollowButton from './TikTokFollowButton';
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import NotifyDialog from '../NotifyDialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarActionsProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  setNotifyDialogOpen: (isOpen: boolean) => void;
  notifyDialogOpen: boolean;
}

const NavbarActions = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  setNotifyDialogOpen,
  notifyDialogOpen
}: NavbarActionsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex-1 flex justify-end">
      <div className="hidden md:flex items-center space-x-4">
        <TikTokFollowButton size="normal" />
        <UserMenu />
        <NotifyDialog 
          trigger={
            <Button variant="default" className="bg-deadpunch-red hover:bg-deadpunch-red-hover text-white">
              Notify Me
            </Button>
          }
        />
      </div>

      <div className="md:hidden flex items-center space-x-4">
        <TikTokFollowButton size="small" />
        <UserMenu />
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost"
              size="icon"
              className="text-white hover:text-deadpunch-red focus:outline-none transition-colors duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </SheetTrigger>
        </Sheet>
      </div>
    </div>
  );
};

export default NavbarActions;
