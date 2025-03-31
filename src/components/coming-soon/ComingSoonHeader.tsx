
import React from 'react';

interface ComingSoonHeaderProps {
  category: string;
  subcategory: string;
}

/**
 * ComingSoonHeader Component
 * 
 * Displays the header section of the coming soon page with category and subcategory titles.
 */
export const ComingSoonHeader = ({ category, subcategory }: ComingSoonHeaderProps) => {
  return (
    <>
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
        {category} <span className="text-deadpunch-red">{subcategory}</span>
      </h1>
      
      <div className="w-24 h-1 bg-deadpunch-red mx-auto my-6"></div>
      
      <p className="text-xl md:text-2xl text-deadpunch-gray-light mb-8">
        We're working hard to bring you the best {subcategory.toLowerCase()} collection.
      </p>
      
      <div className="text-4xl md:text-6xl font-bold text-deadpunch-red mb-8">
        COMING SOON
      </div>
      
      <p className="text-deadpunch-gray-light mb-12">
        Check back later or sign up to be notified when we launch.
      </p>
    </>
  );
};
