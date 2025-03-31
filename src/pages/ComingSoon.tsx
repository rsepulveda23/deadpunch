
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { NotificationDialog } from '@/components/coming-soon/NotificationDialog';

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
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 mt-16">
        <div className="w-full max-w-4xl mx-auto bg-deadpunch-dark-lighter rounded-lg shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12 text-center">
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
              
              {/* Notification dialog with extracted component */}
              <NotificationDialog 
                category={category}
                subcategory={subcategory}
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
