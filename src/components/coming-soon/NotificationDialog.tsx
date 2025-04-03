
import React from 'react';
import { EmailSubscriptionForm } from './EmailSubscriptionForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NotificationDialogProps {
  category: string;
  subcategory: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * NotificationDialog Component
 * 
 * A dialog modal that allows users to sign up for notifications
 * when a product or feature becomes available.
 */
export const NotificationDialog = ({ 
  category, 
  subcategory, 
  isOpen, 
  onOpenChange 
}: NotificationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-deadpunch-red hover:bg-deadpunch-red-hover text-white">
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
        
        <EmailSubscriptionForm 
          category={category} 
          subcategory={subcategory}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
