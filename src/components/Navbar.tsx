
import { useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import DesktopNavMenu from './navbar/DesktopNavMenu';
import MobileMenu from './navbar/MobileMenu';
import UserMenu from './UserMenu';
import NotifyDialog from './NotifyDialog';
import { navCategories } from './navbar/navCategories';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-deadpunch-dark/90 backdrop-blur-xl border-b border-deadpunch-gray-dark'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      {/* Top status strip */}
      <div className="hidden md:flex items-center justify-between px-6 lg:px-10 py-1.5 text-mono text-[10px] tracking-[0.2em] text-deadpunch-gray-light border-b border-deadpunch-gray-dark/60 bg-deadpunch-dark">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-deadpunch-red animate-ticker-flash" />
            LIVE / EARLY ACCESS OPEN
          </span>
          <span className="text-deadpunch-gray-light/40">·</span>
          <span>FREE SHIPPING ON DROP 01</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://www.tiktok.com/@deadpunch.com" target="_blank" rel="noopener noreferrer" className="hover:text-deadpunch-red transition-colors">@DEADPUNCH.COM</a>
          <span className="text-deadpunch-gray-light/40">·</span>
          <span>EST · 2024</span>
        </div>
      </div>

      {/* Main nav row */}
      <div className="px-4 md:px-6 lg:px-10 py-3 md:py-4 flex items-center gap-6 lg:gap-10">
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-8 h-8 bg-deadpunch-red flex items-center justify-center transition-transform group-hover:rotate-12">
            <span className="font-display font-bold text-deadpunch-dark text-lg leading-none">D</span>
          </div>
          <span className="font-display font-bold tracking-tighter text-deadpunch-bone text-lg md:text-xl">
            DEADPUNCH
          </span>
        </Link>

        <div className="hidden md:flex items-center flex-1">
          <DesktopNavMenu categories={navCategories} />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:block">
            <UserMenu />
          </div>
          <NotifyDialog
            trigger={
              <Button className="hidden md:inline-flex h-9 px-5 rounded-none bg-deadpunch-red hover:bg-deadpunch-red-hover text-deadpunch-dark font-display font-semibold uppercase tracking-wider text-xs border-0">
                Notify Me
              </Button>
            }
            open={notifyDialogOpen}
            onOpenChange={setNotifyDialogOpen}
          />

          <div className="md:hidden flex items-center gap-2">
            <UserMenu />
            <Button
              variant="ghost"
              size="icon"
              className="text-deadpunch-bone hover:text-deadpunch-red hover:bg-deadpunch-dark-lighter"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      <div ref={mobileMenuRef}>
        <MobileMenu
          categories={navCategories}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          setNotifyDialogOpen={setNotifyDialogOpen}
        />
      </div>
    </nav>
  );
};

export default Navbar;
