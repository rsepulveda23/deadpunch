
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProductTeasers from '@/components/ProductTeasers';
import EmailForm from '@/components/EmailForm';
import ChatInterface from '@/components/Chat/ChatInterface';
import TimeIndicator from '@/components/TimeIndicator';
import TikTokIcon from '@/components/icons/TikTokIcon';
import { Mail, Phone, Target } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isDayTime, isNightTime } = useTheme();
  
  useEffect(() => {
    // Scroll reveal animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    const revealElements = document.querySelectorAll('.animate-reveal');
    revealElements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  // Generate stars for night time - Fixed to use proper themed colors
  const renderStars = () => {
    if (!isNightTime) return null;
    
    return (
      <div className="stars">
        {Array.from({ length: 50 }).map((_, i) => {
          const size = Math.random() * 3 + 1;
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const animationDelay = Math.random() * 5;
          
          return (
            <div 
              key={i} 
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${top}%`,
                left: `${left}%`,
                opacity: Math.random() * 0.7 + 0.3,
                animationDelay: `${animationDelay}s`,
                animationDuration: '3s'
              }}
            />
          );
        })}
      </div>
    );
  };
  
  return (
    <main className={`relative min-h-screen overflow-hidden ${isDayTime ? 'theme-day' : 'theme-night'}`}>
      {/* Celestial elements */}
      {isDayTime && (
        <div className="fixed top-20 right-20 sun z-0" />
      )}
      {isNightTime && (
        <div className="fixed top-20 right-20 moon z-0" />
      )}
      {renderStars()}
      
      {/* Noise texture overlay */}
      <div className="noise-overlay"></div>
      
      <Navbar />
      <TimeIndicator />
      <HeroSection />
      <AboutSection />
      <ProductTeasers />
      <EmailForm />
      
      {/* Add the ChatInterface component */}
      <ChatInterface />
      
      <footer className="py-6 border-t border-gray-800 bg-black">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="logo-container mr-4">
              <img 
                src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png" 
                alt="Deadpunch" 
                className="h-8 object-contain" 
              />
            </div>
            
            {/* Social Media Links moved next to logo */}
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
                  <span className="ml-2 text-sm font-medium">Follow Us</span>
                </a>
              </HoverCardTrigger>
              <HoverCardContent 
                className="w-80 p-0 bg-gray-900 border-gray-800 rounded-lg overflow-hidden" 
                sideOffset={12}
              >
                <div className="flex flex-col">
                  <div className="relative w-full aspect-[1/1] overflow-hidden">
                    {/* Replace the image with the Deadpunch logo */}
                    <img 
                      src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png" 
                      alt="Deadpunch TikTok" 
                      className="w-full h-full object-contain bg-black p-6"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <TikTokIcon size={32} />
                      <span className="text-white text-sm font-medium ml-2">@deadpunch.com</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-white font-medium mb-1">DEADPUNCH on TikTok</h4>
                    <p className="text-white text-sm mb-3">
                      Check out our latest videos and updates on TikTok
                    </p>
                    <Button 
                      variant="default" 
                      className="w-full bg-deadpunch-red hover:bg-deadpunch-red-hover text-white"
                      onClick={() => window.open('https://www.tiktok.com/@deadpunch.com', '_blank')}
                    >
                      Visit our TikTok
                    </Button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          
          {/* Contact info in the middle */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0 text-white">
            <a href="mailto:contact@deadpunch.com" className="flex items-center hover:text-deadpunch-red transition-colors duration-300">
              <Mail size={16} className="mr-2" />
              <span className="text-sm">contact@deadpunch.com</span>
            </a>
            <a href="tel:+14134759156" className="flex items-center hover:text-deadpunch-red transition-colors duration-300">
              <Phone size={16} className="mr-2" />
              <span className="text-sm">413-475-9156</span>
            </a>
            <Link to="/training-tools/pool-tools" className="flex items-center hover:text-deadpunch-red transition-colors duration-300">
              <Target size={16} className="mr-2" />
              <span className="text-sm">Pool Tools</span>
            </Link>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="text-white text-sm">
              &copy; {new Date().getFullYear()} Deadpunch™. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
