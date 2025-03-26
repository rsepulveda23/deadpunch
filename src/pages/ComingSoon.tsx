
import React from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ComingSoonProps {
  category: string;
  subcategory: string;
}

const ComingSoon = ({ category, subcategory }: ComingSoonProps) => {
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
              <Link 
                to="/" 
                className="flex items-center px-6 py-3 bg-transparent border border-deadpunch-red text-deadpunch-red rounded-md hover:bg-deadpunch-red hover:text-white transition-colors duration-300"
              >
                <ArrowLeft className="mr-2" size={18} />
                Back to Home
              </Link>
              
              <a 
                href="#notify" 
                className="px-6 py-3 bg-deadpunch-red text-white rounded-md hover:bg-deadpunch-red/80 transition-colors duration-300"
              >
                Notify Me When Available
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
