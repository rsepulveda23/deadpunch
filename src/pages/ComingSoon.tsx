
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { ComingSoonContent } from '@/components/coming-soon/ComingSoonContent';

interface ComingSoonProps {
  category?: string;
  subcategory?: string;
}

/**
 * ComingSoon Page
 * 
 * A placeholder page for upcoming products, features, or sections of the app.
 * Allows users to sign up for notifications when the content becomes available.
 * 
 * @param {string} [category] - Optional category name, falls back to URL param
 * @param {string} [subcategory] - Optional subcategory name, falls back to URL param
 */
const ComingSoon = ({ category: propCategory, subcategory: propSubcategory }: ComingSoonProps = {}) => {
  // Extract route parameters
  const params = useParams();
  
  // Use props if provided, otherwise fall back to URL params
  const category = propCategory || params.category || 'Product';
  const subcategory = propSubcategory || params.tool || params.category || 'Feature';
  
  // State for dialog control
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-deadpunch-dark flex flex-col">
      <Navbar />
      <ComingSoonContent 
        category={category}
        subcategory={subcategory}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </div>
  );
};

export default ComingSoon;
