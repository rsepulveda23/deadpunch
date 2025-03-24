
import { useEffect } from 'react';
import { TikTok } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import EmailForm from '@/components/EmailForm';
import ChatInterface from '@/components/Chat/ChatInterface';

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
      <EmailForm />
      
      {/* Add the ChatInterface component */}
      <ChatInterface />
      
      <footer className="py-6 border-t border-deadpunch-dark-lighter">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png" 
              alt="DEADPUNCH" 
              className="h-8 object-contain" 
            />
          </div>
          
          {/* Social Media Links */}
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <a 
              href="https://www.tiktok.com/@deadpunchofficial" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-deadpunch-gray-light hover:text-deadpunch-red transition-colors duration-300"
              aria-label="TikTok"
            >
              <TikTok size={22} />
            </a>
          </div>
          
          <div className="text-deadpunch-gray-light text-sm">
            &copy; {new Date().getFullYear()} DEADPUNCH. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
