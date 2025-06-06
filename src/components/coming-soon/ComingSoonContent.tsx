
import React from 'react';
import { ComingSoonHeader } from '@/components/coming-soon/ComingSoonHeader';
import { ComingSoonActions } from '@/components/coming-soon/ComingSoonActions';

interface ComingSoonContentProps {
  category: string;
  subcategory: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

/**
 * ComingSoonContent Component
 * 
 * Container for all the content displayed on the coming soon page.
 */
export const ComingSoonContent = ({
  category,
  subcategory,
  isDialogOpen,
  setIsDialogOpen
}: ComingSoonContentProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 mt-16">
      <div className="w-full max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
        <div className="p-8 md:p-12 text-center">
          <ComingSoonHeader category={category} subcategory={subcategory} />
          <ComingSoonActions 
            category={category} 
            subcategory={subcategory} 
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        </div>
      </div>
    </div>
  );
};
