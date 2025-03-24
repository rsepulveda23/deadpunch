
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';

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

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-2 bg-deadpunch-dark/90 backdrop-blur-md shadow-lg'
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <a href="#" className="flex items-center">
          <img 
            src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png" 
            alt="DEADPUNCH" 
            className="h-10 md:h-12 object-contain transition-transform duration-300 hover:scale-105" 
          />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <a 
            href="https://www.tiktok.com/@deadpunch.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-deadpunch-red transition-colors duration-300"
            aria-label="TikTok"
          >
            <TikTokIcon size={64} />
          </a>
          <a href="#notify" className="btn-primary animate-reveal delay-300">
            Notify Me
          </a>
        </div>

        {/* Mobile TikTok Icon and Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <a 
            href="https://www.tiktok.com/@deadpunch.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-deadpunch-red transition-colors duration-300"
            aria-label="TikTok"
          >
            <TikTokIcon size={40} />
          </a>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-deadpunch-red focus:outline-none transition-colors duration-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute w-full bg-deadpunch-dark-lighter backdrop-blur-md transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'max-h-60 py-4 border-b border-deadpunch-gray-dark opacity-100' : 'max-h-0 py-0 opacity-0 border-b-0'
        } overflow-hidden`}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          <a 
            href="#notify" 
            className="btn-primary text-center my-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Notify Me
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
