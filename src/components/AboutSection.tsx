
import React from 'react';
import { Target, Compass, Flame } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="relative py-20 md:py-28 bg-gradient-to-b from-deadpunch-dark-lighter to-deadpunch-dark">
      <div className="absolute inset-0 bg-gradient-radial from-deadpunch-red/5 to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1 mb-4 bg-deadpunch-red/10 border border-deadpunch-red/20 rounded-full backdrop-blur-sm">
            <p className="text-deadpunch-red font-display uppercase tracking-wider text-sm">
              Our Identity
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 animate-reveal text-deadpunch-gray-light">
            DEADPUNCH: <span className="text-deadpunch-red">THE STATE OF PERFECT PLAY</span>
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto bg-deadpunch-dark-lighter/50 border border-deadpunch-red/20 backdrop-blur-sm p-8 md:p-12 rounded-xl mb-20 animate-reveal">
          <h3 className="text-3xl font-display font-bold mb-8 text-center tracking-wide text-deadpunch-gray-light">ABOUT DEADPUNCH</h3>
          
          <p className="text-xl text-deadpunch-gray-light mb-6 text-center leading-relaxed">
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-deadpunch-dark-lighter/50 border border-deadpunch-red/20 backdrop-blur-sm p-8 rounded-xl relative animate-reveal delay-100 transform transition-all duration-300 hover:-translate-y-2">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-deadpunch-red rounded-full flex items-center justify-center shadow-lg shadow-deadpunch-red/30">
              <Target className="text-deadpunch-gray-light" size={24} />
            </div>
            <h3 className="text-xl font-display font-bold mb-4 text-center pt-6 text-deadpunch-gray-light">OUR VISION</h3>
            <p className="text-deadpunch-gray-light text-center">
              To ignite the next generation of elite billiards athletes—fearless competitors who dominate pressure, master precision, and relentlessly pursue victory.
            </p>
          </div>
          
          <div className="bg-deadpunch-dark-lighter/50 border border-deadpunch-red/20 backdrop-blur-sm p-8 rounded-xl relative animate-reveal delay-200 transform transition-all duration-300 hover:-translate-y-2">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-deadpunch-red rounded-full flex items-center justify-center shadow-lg shadow-deadpunch-red/30">
              <Compass className="text-deadpunch-gray-light" size={24} />
            </div>
            <h3 className="text-xl font-display font-bold mb-4 text-center pt-6 text-deadpunch-gray-light">OUR MISSION</h3>
            <p className="text-deadpunch-gray-light text-center">
              Empowering billiards athletes through elite gear, mindset mastery, and a relentless pursuit of excellence—equipping every player to deliver their best shot under pressure.
            </p>
          </div>
          
          <div className="bg-deadpunch-dark-lighter/50 border border-deadpunch-red/20 backdrop-blur-sm p-8 rounded-xl relative animate-reveal delay-300 transform transition-all duration-300 hover:-translate-y-2">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-deadpunch-red rounded-full flex items-center justify-center shadow-lg shadow-deadpunch-red/30">
              <Flame className="text-deadpunch-gray-light" size={24} />
            </div>
            <h3 className="text-xl font-display font-bold mb-4 text-center pt-6 text-deadpunch-gray-light">OUR ENERGY</h3>
            <p className="text-deadpunch-gray-light text-center">
              We live for the intensity, the adrenaline rush when everything's on the line—the fearless confidence of taking the winning shot. This is the spirit we embody, the standard we uphold, and the energy that fuels our every move.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
