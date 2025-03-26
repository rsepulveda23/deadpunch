import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';
import { Link } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    {
      name: "Men",
      subcategories: [
        { name: "Hats", path: "/men/hats" },
        { name: "Hoodies & Jackets", path: "/men/hoodies-jackets" },
        { name: "T-shirts", path: "/men/t-shirts" },
        { name: "Accessories", path: "/men/accessories" }
      ]
    },
    {
      name: "Women",
      subcategories: [
        { name: "Hats", path: "/women/hats" },
        { name: "Hoodies & Jackets", path: "/women/hoodies-jackets" },
        { name: "T-shirts", path: "/women/t-shirts" },
        { name: "Accessories", path: "/women/accessories" }
      ]
    },
    {
      name: "New Arrivals",
      subcategories: [
        { name: "Hats", path: "/new-arrivals/hats" },
        { name: "Hoodies & Jackets", path: "/new-arrivals/hoodies-jackets" },
        { name: "T-shirts", path: "/new-arrivals/t-shirts" },
        { name: "Accessories", path: "/new-arrivals/accessories" }
      ]
    }
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-2 bg-deadpunch-dark/90 backdrop-blur-md shadow-lg'
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png" 
              alt="Deadpunch" 
              className="h-10 md:h-12 object-contain transition-transform duration-300 hover:scale-105" 
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center justify-center flex-1">
          <NavigationMenu>
            <NavigationMenuList>
              {categories.map((category) => (
                <NavigationMenuItem key={category.name}>
                  <NavigationMenuTrigger className="text-white hover:text-deadpunch-red transition-colors duration-300 bg-transparent focus:bg-deadpunch-dark-lighter">
                    {category.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory.name} className="row-span-1">
                          <NavigationMenuLink asChild>
                            <Link
                              to={subcategory.path}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-deadpunch-dark-lighter hover:text-deadpunch-red focus:bg-deadpunch-dark-lighter focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{subcategory.name}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-deadpunch-red mt-1">
                                Coming Soon
                              </p>
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
        </div>

        <div className="flex-1 flex justify-end">
          <div className="hidden md:flex items-center space-x-4">
            <HoverCard>
              <HoverCardTrigger asChild>
                <a 
                  href="https://www.tiktok.com/@deadpunch.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-white hover:text-deadpunch-red transition-colors duration-300"
                  aria-label="TikTok"
                >
                  <TikTokIcon size={64} />
                  <span className="ml-2 font-medium">Follow Us</span>
                </a>
              </HoverCardTrigger>
              <HoverCardContent 
                className="w-80 p-0 bg-deadpunch-dark-lighter border-deadpunch-gray-dark" 
                sideOffset={12}
              >
                <div className="flex flex-col">
                  <div className="relative aspect-video w-full overflow-hidden rounded-t-md">
                    <img 
                      src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png" 
                      alt="Deadpunch TikTok" 
                      className="w-full h-full object-contain bg-deadpunch-dark p-6"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <TikTokIcon size={32} />
                      <span className="text-white text-sm font-medium ml-2">@deadpunch.com</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-white font-medium mb-1">DEADPUNCH on TikTok</h4>
                    <p className="text-deadpunch-gray-light text-sm mb-3">
                      Check out our latest videos and updates on TikTok
                    </p>
                    <Button 
                      variant="default" 
                      className="w-full bg-deadpunch-red hover:bg-deadpunch-red-hover"
                      onClick={() => window.open('https://www.tiktok.com/@deadpunch.com', '_blank')}
                    >
                      Visit our TikTok
                    </Button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            <Button variant="default" className="bg-deadpunch-red hover:bg-deadpunch-red-hover text-white">
              Notify Me
            </Button>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <HoverCard>
              <HoverCardTrigger asChild>
                <a 
                  href="https://www.tiktok.com/@deadpunch.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-white hover:text-deadpunch-red transition-colors duration-300"
                  aria-label="TikTok"
                >
                  <TikTokIcon size={40} />
                  <span className="ml-1 text-sm font-medium">Follow Us</span>
                </a>
              </HoverCardTrigger>
              <HoverCardContent 
                className="w-72 p-0 bg-deadpunch-dark-lighter border-deadpunch-gray-dark" 
                sideOffset={12}
              >
                <div className="flex flex-col">
                  <div className="relative aspect-video w-full overflow-hidden rounded-t-md">
                    <img 
                      src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png" 
                      alt="Deadpunch TikTok" 
                      className="w-full h-full object-contain bg-deadpunch-dark p-6"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <TikTokIcon size={24} />
                      <span className="text-white text-xs font-medium ml-1">@deadpunch.com</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-white text-sm font-medium mb-1">DEADPUNCH on TikTok</h4>
                    <p className="text-deadpunch-gray-light text-xs mb-2">
                      Check out our latest videos and updates
                    </p>
                    <Button 
                      variant="default" 
                      size="sm"
                      className="w-full bg-deadpunch-red hover:bg-deadpunch-red-hover"
                      onClick={() => window.open('https://www.tiktok.com/@deadpunch.com', '_blank')}
                    >
                      Visit our TikTok
                    </Button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-deadpunch-red focus:outline-none transition-colors duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      <div 
        className={`md:hidden absolute w-full bg-deadpunch-dark-lighter backdrop-blur-md transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'max-h-screen py-4 border-b border-deadpunch-gray-dark opacity-100' : 'max-h-0 py-0 opacity-0 border-b-0'
        } overflow-hidden`}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          {categories.map((category) => (
            <div key={category.name} className="border-b border-deadpunch-gray-dark pb-3">
              <div 
                className="flex justify-between items-center py-2 cursor-pointer"
                onClick={() => {
                  const content = document.getElementById(`mobile-${category.name.replace(/\s+/g, '-').toLowerCase()}`);
                  if (content) {
                    content.classList.toggle('hidden');
                  }
                }}
              >
                <span className="text-white font-medium">{category.name}</span>
                <ChevronDown className="h-5 w-5 text-deadpunch-gray-light transition-transform" />
              </div>
              
              <div id={`mobile-${category.name.replace(/\s+/g, '-').toLowerCase()}`} className="hidden pl-4 mt-2 space-y-2">
                {category.subcategories.map((subcategory) => (
                  <div key={subcategory.name} className="py-1">
                    <Link to={subcategory.path} className="block text-white hover:text-deadpunch-red">
                      <div>{subcategory.name}</div>
                      <p className="text-xs text-deadpunch-red">Coming Soon</p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <Button 
            variant="default" 
            className="bg-deadpunch-red hover:bg-deadpunch-red-hover text-white w-full my-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Notify Me
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
