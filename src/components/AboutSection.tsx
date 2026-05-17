
import React from 'react';

const AboutSection = () => {
  return (
    <section id="about" className="relative py-24 md:py-36 bg-deadpunch-dark overflow-hidden">
      {/* Felt-gradient backdrop */}
      <div className="absolute inset-0 bg-felt-gradient opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-deadpunch-red/40 to-transparent" />

      <div className="container mx-auto px-4 md:px-10 relative">
        {/* Two-col header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 mb-16 md:mb-24">
          <div className="md:col-span-5 animate-reveal">
            <div className="section-label mb-6">CHAPTER · 01 / THE BRAND</div>
            <h2 className="text-display text-5xl md:text-7xl leading-[0.95] text-deadpunch-bone">
              The state of <br />
              <span className="text-deadpunch-red">perfect play.</span>
            </h2>
          </div>

          <div className="md:col-span-7 md:pt-4 animate-reveal delay-200">
            <div className="border-l-2 border-deadpunch-red pl-6 md:pl-8 mb-8">
              <p className="text-mono text-[11px] tracking-[0.2em] text-deadpunch-gray-light mb-3">
                MANIFESTO
              </p>
              <p className="text-2xl md:text-3xl text-deadpunch-bone leading-[1.25] font-light">
                Deadpunch isn't a brand. <span className="text-deadpunch-bone/60">It's the zone.</span>
              </p>
            </div>

            <p className="text-base md:text-lg text-deadpunch-gray-light leading-relaxed mb-5 max-w-xl">
              The moment everything slows down. Every angle is clear. Every shot drops
              without hesitation.
            </p>
            <p className="text-base md:text-lg text-deadpunch-gray-light leading-relaxed mb-5 max-w-xl">
              Flow. Total focus. Confidence built through reps, not hype.
            </p>
            <p className="text-base md:text-lg text-deadpunch-bone leading-relaxed max-w-xl">
              That's <span className="text-deadpunch-red font-medium">deadpunch</span> —
              the moment everything clicks and nothing misses.
            </p>
          </div>
        </div>

        {/* Three principle blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-deadpunch-gray-dark border border-deadpunch-gray-dark animate-reveal delay-300">
          {[
            {
              n: '01',
              k: 'GEAR',
              t: 'Built for the table.',
              c: 'Apparel and accessories that hold up in tournament heat. No gimmicks.',
            },
            {
              n: '02',
              k: 'TRAINING',
              t: 'Reps over rhetoric.',
              c: 'Journals and tools that turn practice into progress you can measure.',
            },
            {
              n: '03',
              k: 'COMMUNITY',
              t: 'A home for the serious.',
              c: 'A tournament platform built by players, for players. No filler.',
            },
          ].map((b) => (
            <div key={b.n} className="bg-deadpunch-dark p-8 md:p-10 group transition-colors duration-300 hover:bg-deadpunch-dark-lighter">
              <div className="flex items-start justify-between mb-8">
                <span className="text-mono text-[11px] tracking-[0.2em] text-deadpunch-red">{b.k}</span>
                <span className="text-display text-2xl text-deadpunch-bone/30 group-hover:text-deadpunch-red transition-colors">{b.n}</span>
              </div>
              <h3 className="text-display text-2xl md:text-3xl text-deadpunch-bone mb-4 leading-tight">{b.t}</h3>
              <p className="text-deadpunch-gray-light leading-relaxed">{b.c}</p>
              <div className="mt-8 h-px w-12 bg-deadpunch-red group-hover:w-24 transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Outro */}
        <div className="mt-20 md:mt-28 text-center animate-reveal">
          <p className="text-stencil text-5xl md:text-7xl tracking-wider text-deadpunch-bone/80">
            GEAR FOR SERIOUS PLAYERS.
          </p>
          <p className="mt-3 text-stencil text-5xl md:text-7xl tracking-wider text-deadpunch-red">
            NO EXCUSES. NO HYPE.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
