
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProductTeasers from '@/components/ProductTeasers';
import EmailForm from '@/components/EmailForm';
import ChatInterface from '@/components/Chat/ChatInterface';
import TikTokIcon from '@/components/icons/TikTokIcon';
import { Mail, Phone } from 'lucide-react';

const Index = () => {
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

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Noise texture overlay */}
      <div className="noise-overlay"></div>
      
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProductTeasers />
      <EmailForm />
      
      {/* Add the ChatInterface component */}
      <ChatInterface />
      
      <footer className="py-6 border-t border-deadpunch-dark-lighter">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png" 
              alt="DEADPUNCH" 
              className="h-8 object-contain mr-4" 
            />
            
            {/* Social Media Links moved next to logo */}
            <a 
              href="https://www.tiktok.com/@deadpunch.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-deadpunch-gray-light hover:text-deadpunch-red transition-colors duration-300"
              aria-label="TikTok"
            >
              <TikTokIcon size={64} />
              <span className="ml-2 text-sm font-medium">Follow Us</span>
            </a>
          </div>
          
          {/* Contact info in the middle */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0 text-deadpunch-gray-light">
            <a href="mailto:contact@deadpunch.com" className="flex items-center hover:text-deadpunch-red transition-colors duration-300">
              <Mail size={16} className="mr-2" />
              <span className="text-sm">contact@deadpunch.com</span>
            </a>
            <a href="tel:+14134759156" className="flex items-center hover:text-deadpunch-red transition-colors duration-300">
              <Phone size={16} className="mr-2" />
              <span className="text-sm">413-475-9156</span>
            </a>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="text-deadpunch-gray-light text-sm">
              &copy; {new Date().getFullYear()} DEADPUNCH™. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
