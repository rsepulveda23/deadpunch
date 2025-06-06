
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
      <NavigationMenuList>
        {categories.map((category) => (
          <NavigationMenuItem key={category.name}>
            <NavigationMenuTrigger className="text-deadpunch-gray-light hover:text-deadpunch-red transition-colors duration-300 bg-transparent focus:bg-deadpunch-dark-lighter">
              {category.name}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-deadpunch-dark border-deadpunch-gray-dark">
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                {category.subcategories.map((subcategory) => (
                  <li key={subcategory.name} className="row-span-1">
                    <NavigationMenuLink asChild>
                      <Link
                        to={subcategory.path}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-deadpunch-dark-lighter hover:text-deadpunch-red focus:bg-deadpunch-dark-lighter focus:text-deadpunch-red text-deadpunch-gray-light"
                      >
                        <div className="text-sm font-medium leading-none">{subcategory.name}</div>
                        {!subcategory.isActive && (
                          <p className="line-clamp-2 text-sm leading-snug text-deadpunch-red mt-1">
                            Coming Soon
                          </p>
                        )}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNavMenu;
