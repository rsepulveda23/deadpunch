
import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('reveal');
        });
      },
      { threshold: 0.1 }
    );
    const els = document.querySelectorAll('.animate-reveal');
    els.forEach((el) => observer.observe(el));

    const handleMove = (e: MouseEvent) => {
      if (!spotlightRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      spotlightRef.current.style.background = `radial-gradient(circle 600px at ${x}% ${y}%, rgba(215,254,60,0.10), transparent 60%)`;
    };
    window.addEventListener('mousemove', handleMove);

    return () => {
      els.forEach((el) => observer.unobserve(el));
      window.removeEventListener('mousemove', handleMove);
    };
  }, []);

  const tickerItems = [
    'PERFORMANCE GEAR',
    'COMPETITIVE POOL',
    'TRAINING JOURNALS',
    'LIVE TOURNAMENTS',
    'APPAREL DROPS',
    'PLAY TO WIN',
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-12 bg-deadpunch-dark"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-50 animate-grid-pan pointer-events-none" />
      <div className="absolute inset-0 bg-radial-spot pointer-events-none" />
      <div ref={spotlightRef} className="absolute inset-0 pointer-events-none transition-[background] duration-300" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-deadpunch-dark pointer-events-none" />

      {/* Top-left status block */}
      <div className="absolute top-24 left-6 md:left-10 z-10 animate-reveal">
        <div className="flex items-center gap-2 text-mono text-[11px] tracking-[0.2em] text-deadpunch-gray-light">
          <span className="w-1.5 h-1.5 rounded-full bg-deadpunch-red animate-ticker-flash" />
          SYSTEM · OPERATIONAL
        </div>
        <div className="mt-2 text-mono text-[11px] tracking-[0.2em] text-deadpunch-gray-light/60">
          N 42°06′ · W 072°35′
        </div>
      </div>

      {/* Top-right meta */}
      <div className="absolute top-24 right-6 md:right-10 z-10 animate-reveal text-right">
        <div className="text-mono text-[11px] tracking-[0.2em] text-deadpunch-gray-light/60">
          DEADPUNCH / 01
        </div>
        <div className="mt-2 text-mono text-[11px] tracking-[0.2em] text-deadpunch-red">
          STATUS · COMING SOON
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-10 z-10">
        {/* Eyebrow */}
        <div className="animate-reveal">
          <span className="section-label">FOR PLAYERS WHO PLAY TO WIN</span>
        </div>

        {/* Massive split display */}
        <div className="mt-8 md:mt-10 animate-reveal delay-100">
          <h1 className="split-display block">
            <span className="block">DEAD</span>
            <span className="block">
              <span className="accent">PUNCH</span>
              <span className="inline-block w-3 h-3 md:w-5 md:h-5 ml-3 md:ml-5 align-baseline bg-deadpunch-red animate-ticker-flash" />
            </span>
          </h1>
        </div>

        {/* Subhead row */}
        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 animate-reveal delay-200">
          <div className="md:col-span-7">
            <p className="text-deadpunch-bone/85 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
              Performance gear and a competitive home for serious pool players.
              Apparel, training journals, and a tournament platform — built around the
              state of perfect play.
            </p>
          </div>
          <div className="md:col-span-5 md:flex md:justify-end">
            <div className="flex flex-wrap items-center gap-3">
              <a href="#notify" className="btn-primary">
                Get Early Access
                <ArrowRight size={16} />
              </a>
              <a href="#about" className="btn-ghost">
                The Brand
              </a>
            </div>
          </div>
        </div>

        {/* Stat row */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-deadpunch-gray-dark border border-deadpunch-gray-dark animate-reveal delay-300">
          {[
            { k: 'DROPS', v: '04', sub: 'CATEGORIES' },
            { k: 'PLATFORM', v: 'V1', sub: 'TOURNAMENTS' },
            { k: 'EARLY ACCESS', v: 'OPEN', sub: 'NOTIFY LIST' },
            { k: 'EST.', v: '24', sub: 'NORTHEAST US' },
          ].map((s) => (
            <div key={s.k} className="bg-deadpunch-dark px-5 py-6 md:py-8 flex flex-col justify-between min-h-[120px]">
              <div className="text-mono text-[10px] tracking-[0.2em] text-deadpunch-gray-light">{s.k}</div>
              <div className="mt-4">
                <div className="font-display text-3xl md:text-5xl text-deadpunch-bone leading-none tracking-tight">{s.v}</div>
                <div className="mt-2 text-mono text-[10px] tracking-[0.2em] text-deadpunch-gray-light/60">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee ticker */}
      <div className="relative z-10 mt-16 md:mt-24 border-y border-deadpunch-gray-dark py-4 overflow-hidden bg-deadpunch-dark-lighter/40">
        <div className="marquee-track">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((t, i) => (
            <span key={i} className="text-stencil text-3xl md:text-4xl tracking-wider flex items-center gap-12 text-deadpunch-bone/90">
              {t}
              <span className="text-deadpunch-red">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
