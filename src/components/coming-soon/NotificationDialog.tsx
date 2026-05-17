
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { EmailSubscriptionForm } from './EmailSubscriptionForm';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NotificationDialogProps {
  category: string;
  subcategory: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationDialog = ({
  category,
  subcategory,
  isOpen,
  onOpenChange
}: NotificationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="btn-primary">
          Notify Me When Available
          <ArrowRight size={14} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px] bg-deadpunch-dark border border-deadpunch-gray-dark rounded-none p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 bg-deadpunch-dark-lighter border-b border-deadpunch-gray-dark">
          <span className="text-mono text-[10px] tracking-[0.25em] text-deadpunch-red">
            DEADPUNCH / {category.toUpperCase()}
          </span>
          <span className="flex items-center gap-1.5 text-mono text-[10px] tracking-[0.2em] text-deadpunch-gray-light">
            <span className="w-1.5 h-1.5 rounded-full bg-deadpunch-red animate-ticker-flash" />
            LIVE
          </span>
        </div>

        <div className="p-8">
          <h3 className="text-display text-3xl text-deadpunch-bone leading-tight mb-2">
            Get notified.
          </h3>
          <p className="text-deadpunch-gray-light text-sm leading-relaxed mb-6">
            We'll let you know the second <span className="text-deadpunch-red">{category} {subcategory}</span> drops.
          </p>

          <EmailSubscriptionForm
            category={category}
            subcategory={subcategory}
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
