
import React from 'react';
import { ComingSoonHeader } from '@/components/coming-soon/ComingSoonHeader';
import { ComingSoonActions } from '@/components/coming-soon/ComingSoonActions';

interface ComingSoonContentProps {
  category: string;
  subcategory: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export const ComingSoonContent = ({
  category,
  subcategory,
  isDialogOpen,
  setIsDialogOpen
}: ComingSoonContentProps) => {
  return (
    <div className="flex-1 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-spot pointer-events-none" />
      <div className="noise-overlay" />

      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-20 relative">
        <div className="w-full max-w-4xl mx-auto">
          {/* Top meta row */}
          <div className="flex items-center justify-between mb-10 md:mb-14 text-mono text-[11px] tracking-[0.25em] text-deadpunch-gray-light">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-deadpunch-red animate-ticker-flash" />
              IN PRODUCTION
            </span>
            <span>SECTION · {category.toUpperCase()}</span>
          </div>

          <ComingSoonHeader category={category} subcategory={subcategory} />
          <ComingSoonActions
            category={category}
            subcategory={subcategory}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        </div>
      </div>

      {/* Bottom mono strip */}
      <div className="relative border-t border-deadpunch-gray-dark py-4 px-4 md:px-10 text-mono text-[10px] tracking-[0.25em] text-deadpunch-gray-light/60 flex flex-col md:flex-row md:justify-between gap-2">
        <span>SHIPPING WHEN IT'S READY · NOT BEFORE</span>
        <span className="text-deadpunch-red">FOR PLAYERS WHO PLAY TO WIN</span>
      </div>
    </div>
  );
};
