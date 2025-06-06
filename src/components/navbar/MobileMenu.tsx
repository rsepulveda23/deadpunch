
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  categories: {
    name: string;
    subcategories: {
      name: string;
      path: string;
      isActive?: boolean;
    }[];
  }[];
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  setNotifyDialogOpen: (isOpen: boolean) => void;
}

const MobileMenu = ({ categories, isMenuOpen, setIsMenuOpen, setNotifyDialogOpen }: MobileMenuProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(cat => cat !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetContent 
        side="left" 
        className="bg-black border-gray-800 w-[300px] p-0 overflow-y-auto"
      >
        <div className="p-4 border-b border-gray-800">
          <div className="logo-container mx-auto w-32">
            <img 
              src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png" 
              alt="Deadpunch" 
              className="h-8 object-contain mx-auto" 
            />
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {categories.map((category) => (
            <div key={category.name} className="border-b border-gray-800 pb-3">
              <div 
                className="flex justify-between items-center py-2 cursor-pointer"
                onClick={() => toggleCategory(category.name)}
              >
                <span className="text-gray-400 font-medium hover:text-deadpunch-red transition-colors duration-300">{category.name}</span>
                <ChevronDown 
                  className={`h-5 w-5 text-gray-400 transition-transform hover:text-deadpunch-red ${
                    expandedCategories.includes(category.name) ? 'rotate-180' : ''
                  }`} 
                />
              </div>
              
              <div 
                className={`pl-4 mt-2 space-y-2 ${
                  expandedCategories.includes(category.name) ? 'block' : 'hidden'
                }`}
              >
                {category.subcategories.map((subcategory) => (
                  <div key={subcategory.name} className="py-1">
                    <Link 
                      to={subcategory.path} 
                      className="block text-gray-400 hover:text-deadpunch-red transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="text-gray-400 hover:text-deadpunch-red">{subcategory.name}</div>
                      {!subcategory.isActive && (
                        <p className="text-xs text-deadpunch-red">Coming Soon</p>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <Button 
            variant="default" 
            className="bg-deadpunch-red hover:bg-deadpunch-red-hover text-white border-deadpunch-red w-full my-2"
            onClick={() => {
              setIsMenuOpen(false);
              setNotifyDialogOpen(true);
            }}
          >
            Notify Me
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
