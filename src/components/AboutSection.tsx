
import React from 'react';
import { Target, Compass, Flame } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="relative py-20 md:py-28 bg-gradient-to-b from-deadpunch-dark-lighter to-deadpunch-dark">
      <div className="absolute inset-0 bg-gradient-radial from-deadpunch-red/5 to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1 mb-4 bg-deadpunch-red/10 border border-deadpunch-red/20 rounded-full backdrop-blur-sm">
            <p className="text-deadpunch-red font-display uppercase tracking-wider text-sm">
              Our Identity
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 animate-reveal">
            DEADPUNCH: <span className="text-deadpunch-red">THE STATE OF PERFECT PLAY</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="glass p-8 rounded-xl relative animate-reveal delay-100">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-deadpunch-red rounded-full flex items-center justify-center red-glow">
              <Target className="text-white" size={20} />
            </div>
            <h3 className="text-xl font-display font-bold mb-4 text-center pt-4">OUR VISION</h3>
            <p className="text-deadpunch-gray-light">
              To elevate the sport of billiards by inspiring a new generation of focused, fearless competitors—players who thrive under pressure and play with purpose.
            </p>
          </div>
          
          <div className="glass p-8 rounded-xl relative animate-reveal delay-200">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-deadpunch-red rounded-full flex items-center justify-center red-glow">
              <Compass className="text-white" size={20} />
            </div>
            <h3 className="text-xl font-display font-bold mb-4 text-center pt-4">OUR MISSION</h3>
            <p className="text-deadpunch-gray-light">
              To empower players through elite performance gear, mindset-driven content, and a brand devoted to the pursuit of perfection in every shot.
            </p>
          </div>
          
          <div className="glass p-8 rounded-xl relative animate-reveal delay-300">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-deadpunch-red rounded-full flex items-center justify-center red-glow">
              <Flame className="text-white" size={20} />
            </div>
            <h3 className="text-xl font-display font-bold mb-4 text-center pt-4">OUR ENERGY</h3>
            <p className="text-deadpunch-gray-light">
              That's the energy we live for, play for, and bleed for—and the standard we stand for.
            </p>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto glass p-8 md:p-12 rounded-xl relative animate-reveal delay-400">
          <h3 className="text-2xl font-display font-bold mb-6 text-center">ABOUT DEADPUNCH</h3>
          <p className="text-deadpunch-gray-light mb-4 text-center">
            <span className="text-white font-medium">DEADPUNCH is more than a brand—it's a state of being.</span>
          </p>
          <p className="text-deadpunch-gray-light mb-4">
            In the world of billiards, when a player is locked in, seeing every angle, executing without hesitation, and sinking shot after shot like time has slowed down—that's DEADPUNCH.
          </p>
          <p className="text-deadpunch-gray-light mb-4">
            It's flow. It's the zone. It's pure confidence forged through preparation.
          </p>
          <p className="text-deadpunch-gray-light text-center font-display text-lg mt-6">
            <span className="text-deadpunch-red font-semibold">It's the moment when everything clicks and nothing misses.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
