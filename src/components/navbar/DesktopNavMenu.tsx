
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
            <NavigationMenuTrigger className="text-gray-400 hover:text-deadpunch-red transition-colors duration-300 bg-transparent focus:bg-gray-900 data-[state=open]:bg-gray-900 data-[state=open]:text-deadpunch-red">
              {category.name}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-black border-gray-800">
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                {category.subcategories.map((subcategory) => (
                  <li key={subcategory.name} className="row-span-1">
                    <NavigationMenuLink asChild>
                      <Link
                        to={subcategory.path}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-900 hover:text-deadpunch-red focus:bg-gray-900 focus:text-deadpunch-red text-gray-400"
                      >
                        <div className="text-sm font-medium leading-none text-gray-400">{subcategory.name}</div>
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
