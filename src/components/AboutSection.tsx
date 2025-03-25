
import React from 'react';
import { Target, Compass, Flame } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="relative py-20 md:py-28 bg-gradient-to-b from-deadpunch-dark-lighter to-deadpunch-dark">
      <div className="absolute inset-0 bg-gradient-radial from-deadpunch-red/5 to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1 mb-4 bg-deadpunch-red/10 border border-deadpunch-red/20 rounded-full backdrop-blur-sm">
            <p className="text-deadpunch-red font-display uppercase tracking-wider text-sm">
              Our Identity
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 animate-reveal">
            DEADPUNCH: <span className="text-deadpunch-red">THE STATE OF PERFECT PLAY</span>
          </h2>
        </div>
        
        {/* Main Content Box */}
        <div className="max-w-4xl mx-auto glass p-8 md:p-12 rounded-xl mb-20 animate-reveal">
          <h3 className="text-3xl font-display font-bold mb-8 text-center tracking-wide">ABOUT DEADPUNCH</h3>
          
          <p className="text-xl text-white mb-6 text-center leading-relaxed">
            <span className="font-semibold">Deadpunch isn't just a brand—it's the zone.</span>
          </p>
          
          <p className="text-lg text-deadpunch-gray-light mb-4 leading-relaxed">
            It's the moment when everything slows down, every angle is clear, and every shot drops without hesitation. That's Deadpunch.
          </p>
          
          <p className="text-lg text-deadpunch-gray-light mb-4 leading-relaxed">
            It's flow. It's total focus. It's confidence forged through relentless preparation.
          </p>
          
          <p className="text-2xl text-deadpunch-red font-display text-center font-semibold mb-8 leading-relaxed">
            It's the moment when everything clicks and nothing misses.
          </p>
          
          <div className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-deadpunch-red/30 to-transparent mb-8"></div>
        </div>
        
        {/* Three Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="glass p-8 rounded-xl relative animate-reveal delay-100 transform transition-all duration-300 hover:-translate-y-2">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-deadpunch-red rounded-full flex items-center justify-center red-glow">
              <Target className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-display font-bold mb-4 text-center pt-6">OUR VISION</h3>
            <p className="text-deadpunch-gray-light text-center">
              To elevate the sport of billiards by inspiring a new generation of focused, fearless competitors—players who thrive under pressure and play with purpose.
            </p>
          </div>
          
          <div className="glass p-8 rounded-xl relative animate-reveal delay-200 transform transition-all duration-300 hover:-translate-y-2">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-deadpunch-red rounded-full flex items-center justify-center red-glow">
              <Compass className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-display font-bold mb-4 text-center pt-6">OUR MISSION</h3>
            <p className="text-deadpunch-gray-light text-center">
              To empower players through elite performance gear, mindset-driven content, and a brand devoted to the pursuit of perfection in every shot.
            </p>
          </div>
          
          <div className="glass p-8 rounded-xl relative animate-reveal delay-300 transform transition-all duration-300 hover:-translate-y-2">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-deadpunch-red rounded-full flex items-center justify-center red-glow">
              <Flame className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-display font-bold mb-4 text-center pt-6">OUR ENERGY</h3>
            <p className="text-deadpunch-gray-light text-center">
              That's the energy we live for, play for, and bleed for—and the standard we stand for.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
