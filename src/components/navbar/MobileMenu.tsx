
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggle = (name: string) => {
    setExpanded((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetContent
        side="left"
        className="bg-deadpunch-dark border-r border-deadpunch-gray-dark w-[320px] p-0 overflow-y-auto"
      >
        <div className="px-5 py-6 border-b border-deadpunch-gray-dark flex items-center gap-3">
          <div className="w-8 h-8 bg-deadpunch-red flex items-center justify-center">
            <span className="font-display font-bold text-deadpunch-dark text-lg leading-none">D</span>
          </div>
          <span className="font-display font-bold tracking-tighter text-deadpunch-bone text-lg">
            DEADPUNCH
          </span>
        </div>

        <div className="px-2 py-4">
          {categories.map((category) => (
            <div key={category.name} className="border-b border-deadpunch-gray-dark/60">
              <button
                className="w-full flex justify-between items-center px-4 py-4 text-left"
                onClick={() => toggle(category.name)}
              >
                <span className="font-display font-medium text-deadpunch-bone hover:text-deadpunch-red transition-colors">
                  {category.name}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-deadpunch-gray-light transition-transform ${
                    expanded.includes(category.name) ? 'rotate-180 text-deadpunch-red' : ''
                  }`}
                />
              </button>

              {expanded.includes(category.name) && (
                <div className="pl-4 pb-3 pr-3 space-y-1">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.name}
                      to={subcategory.path}
                      className="group flex items-center justify-between px-3 py-2.5 hover:bg-deadpunch-dark-lighter transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-sm text-deadpunch-bone group-hover:text-deadpunch-red transition-colors">
                        {subcategory.name}
                      </span>
                      {!subcategory.isActive && (
                        <span className="text-mono text-[9px] tracking-[0.18em] text-deadpunch-red">SOON</span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="px-4 mt-6">
            <Button
              className="w-full h-11 rounded-none bg-deadpunch-red hover:bg-deadpunch-red-hover text-deadpunch-dark font-display font-semibold uppercase tracking-wider text-xs border-0"
              onClick={() => {
                setIsMenuOpen(false);
                setNotifyDialogOpen(true);
              }}
            >
              Notify Me
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
