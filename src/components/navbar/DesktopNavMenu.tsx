
import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";

interface DesktopNavMenuProps {
  categories: {
    name: string;
    subcategories: {
      name: string;
      path: string;
      isActive?: boolean;
    }[];
  }[];
}

const DesktopNavMenu = ({ categories }: DesktopNavMenuProps) => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-1">
        {categories.map((category) => (
          <NavigationMenuItem key={category.name}>
            <NavigationMenuTrigger className="bg-transparent text-deadpunch-bone/80 hover:text-deadpunch-red focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-deadpunch-red font-display font-medium text-sm tracking-wide px-3 h-9">
              {category.name}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-deadpunch-dark border border-deadpunch-gray-dark rounded-none">
              <div className="w-[480px] p-2">
                <div className="px-3 py-2 mb-1 border-b border-deadpunch-gray-dark">
                  <p className="text-mono text-[10px] tracking-[0.2em] text-deadpunch-red">
                    {category.name.toUpperCase()}
                  </p>
                </div>
                <ul className="grid grid-cols-2 gap-1 p-1">
                  {category.subcategories.map((subcategory) => (
                    <li key={subcategory.name}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={subcategory.path}
                          className="group block px-3 py-3 transition-colors outline-none hover:bg-deadpunch-dark-lighter"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-display font-medium text-sm text-deadpunch-bone group-hover:text-deadpunch-red transition-colors">
                              {subcategory.name}
                            </div>
                            {!subcategory.isActive && (
                              <span className="text-mono text-[9px] tracking-[0.18em] text-deadpunch-red shrink-0">
                                SOON
                              </span>
                            )}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNavMenu;
