
import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Reveal animation for elements
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
          }
        });
      },
      { threshold: 0.1 }
    );

    const animateElements = document.querySelectorAll('.animate-reveal');
    animateElements.forEach((el) => observer.observe(el));

    // Parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      // Parallax effect for logo
      if (logoRef.current) {
        logoRef.current.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
      }
      
      // Subtle parallax for text
      if (textRef.current) {
        textRef.current.style.transform = `translate(${x * -10}px, ${y * -10}px)`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      animateElements.forEach((el) => observer.unobserve(el));
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 pb-8"
    >
      {/* Background with subtle animation - reduced opacity values to make the pool table more visible */}
      <div className="absolute inset-0 bg-deadpunch-dark">
        <div className="absolute inset-0 bg-gradient-radial from-deadpunch-dark-lighter to-deadpunch-dark opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-hero-pattern bg-cover bg-center opacity-60"></div>
        <div className="absolute inset-0 bg-noise-texture opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 z-10 flex flex-col items-center">
        {/* Logo - Made smaller by changing max-w-md to max-w-xs */}
        <div 
          ref={logoRef}
          className="logo-container animate-reveal animate-float w-full max-w-xs mb-12 md:mb-16"
        >
          <img
            src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png"
            alt="Deadpunch Logo"
            className="w-full h-auto"
          />
        </div>

        {/* Hero Text */}
        <div
          ref={textRef}
          className="text-center max-w-2xl animate-reveal delay-200"
        >
          <p className="text-deadpunch-red font-display uppercase tracking-wider text-sm mb-6">
            For Players Who Play to Win
          </p>

          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">
            COMING SOON
          </h1>

          <p className="text-deadpunch-gray-light text-lg mb-8">
            Sign up for early access when we launch.
          </p>

          <a href="#notify" className="btn-primary bg-deadpunch-red hover:bg-deadpunch-red-hover text-white">
            Notify Me
          </a>
        </div>
      </div>

      {/* Responsive gradient height - smaller on desktop, slightly larger on mobile */}
      <div className={`absolute bottom-0 left-0 right-0 ${isMobile ? 'h-8' : 'h-4'} bg-gradient-to-t from-deadpunch-dark to-transparent`}></div>
    </div>
  );
};

export default HeroSection;
