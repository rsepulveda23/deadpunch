
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { NotificationDialog } from '@/components/coming-soon/NotificationDialog';

interface ComingSoonActionsProps {
  category: string;
  subcategory: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

/**
 * ComingSoonActions Component
 * 
 * Provides action buttons for the coming soon page, including navigation
 * back to home and notification sign-up.
 */
export const ComingSoonActions = ({ 
  category, 
  subcategory,
  isDialogOpen,
  setIsDialogOpen
}: ComingSoonActionsProps) => {
  return (
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
      
      <NotificationDialog 
        category={category}
        subcategory={subcategory}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};
