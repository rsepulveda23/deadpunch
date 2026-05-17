
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { NotificationDialog } from '@/components/coming-soon/NotificationDialog';

interface ComingSoonActionsProps {
  category: string;
  subcategory: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export const ComingSoonActions = ({
  category,
  subcategory,
  isDialogOpen,
  setIsDialogOpen
}: ComingSoonActionsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <NotificationDialog
        category={category}
        subcategory={subcategory}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      <Link to="/" className="btn-ghost">
        <ArrowLeft size={14} />
        Back to Home
      </Link>

      <Link to="/tournaments" className="inline-flex items-center gap-2 px-2 text-mono text-[11px] tracking-[0.25em] text-deadpunch-gray-light hover:text-deadpunch-red transition-colors">
        TOURNAMENTS
        <ArrowRight size={12} />
      </Link>
    </div>
  );
};
