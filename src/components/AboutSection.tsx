
import React from 'react';

const AboutSection = () => {
  return (
    <section id="about" className="relative py-20 md:py-28 bg-black">
      <div className="absolute inset-0 bg-gradient-radial from-deadpunch-red/5 to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1 mb-4 bg-deadpunch-red/10 border border-deadpunch-red/20 rounded-full backdrop-blur-sm">
            <p className="text-deadpunch-red font-display uppercase tracking-wider text-sm">
              The Brand
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 animate-reveal text-white">
            DEADPUNCH: <span className="text-deadpunch-red">THE STATE OF PERFECT PLAY</span>
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto bg-gray-900 border border-deadpunch-red/20 backdrop-blur-sm p-8 md:p-12 rounded-xl mb-20 animate-reveal">
          <h3 className="text-3xl font-display font-bold mb-8 text-center tracking-wide text-white">ABOUT DEADPUNCH</h3>
          
          <p className="text-xl text-gray-400 mb-6 text-center leading-relaxed">
            <span className="font-semibold">Deadpunch isn't just a brand—it's the zone.</span>
          </p>
          
          <p className="text-lg text-gray-400 mb-4 text-center leading-relaxed">
            It's the moment when everything slows down, every angle is clear, and every shot drops without hesitation. That's Deadpunch.
          </p>

          <p className="text-lg text-gray-400 mb-4 text-center leading-relaxed">
            Flow. Total focus. Confidence built through practice.
          </p>
          
          <p className="text-2xl text-deadpunch-red font-display text-center font-semibold mb-8 leading-relaxed">
            It's the moment when everything clicks and nothing misses.
          </p>
          
          <div className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-deadpunch-red/30 to-transparent mb-8"></div>
        </div>
        
        <div className="max-w-2xl mx-auto text-center animate-reveal delay-100">
          <p className="text-xl text-gray-400 leading-relaxed">
            Gear for serious players. No excuses. No hype.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
