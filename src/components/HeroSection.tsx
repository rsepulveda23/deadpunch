
import { useEffect, useRef } from 'react';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
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
      {/* Background with subtle animation */}
      <div className="absolute inset-0 bg-deadpunch-dark">
        <div className="absolute inset-0 bg-gradient-radial from-deadpunch-dark-lighter to-deadpunch-dark opacity-40"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-hero-pattern bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-noise-texture opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 z-10 flex flex-col items-center">
        {/* Logo */}
        <div 
          ref={logoRef}
          className="logo-container animate-reveal animate-float w-full max-w-md mb-12 md:mb-16"
        >
          <img
            src="/public/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png"
            alt="DEADPUNCH Logo"
            className="w-full h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          />
        </div>

        {/* Hero Text */}
        <div 
          ref={textRef}
          className="text-center max-w-4xl animate-reveal delay-200"
        >
          <div className="inline-block px-4 py-1 mb-4 bg-deadpunch-red/10 border border-deadpunch-red/20 rounded-full backdrop-blur-sm">
            <p className="text-deadpunch-red font-display uppercase tracking-wider text-sm">
              The Future of Sports
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
            <span className="block mb-2">COMING SOON</span>
            <span className="block text-deadpunch-red text-3xl md:text-4xl lg:text-5xl">Get ready. The game is about to change.</span>
          </h1>
          <p className="text-deadpunch-gray-light text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Be the first to know. Sign up to receive exclusive updates on early access when DEADPUNCH launches.
          </p>
          <div className="flex justify-center items-center">
            <a href="#notify" className="btn-primary animate-reveal delay-300">
              Notify Me
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-deadpunch-dark to-transparent"></div>
      
      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
