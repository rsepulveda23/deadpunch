
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import NavbarBrand from './navbar/NavbarBrand';
import DesktopNavMenu from './navbar/DesktopNavMenu';
import MobileMenu from './navbar/MobileMenu';
import NavbarActions from './navbar/NavbarActions';
import NotifyDialog from './NotifyDialog';
import { navCategories } from './navbar/navCategories';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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
          <NavbarBrand />
        </div>

        <div className="hidden md:flex items-center justify-center flex-1">
          <DesktopNavMenu categories={navCategories} />
        </div>

        <NavbarActions 
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          notifyDialogOpen={notifyDialogOpen}
          setNotifyDialogOpen={setNotifyDialogOpen}
        />
      </div>
      
      <div ref={mobileMenuRef}>
        <MobileMenu 
          categories={navCategories}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          setNotifyDialogOpen={setNotifyDialogOpen}
        />
      </div>
      
      <NotifyDialog 
        open={notifyDialogOpen} 
        onOpenChange={setNotifyDialogOpen}
      />
    </nav>
  );
};

export default Navbar;
