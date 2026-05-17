
import React from 'react';
import { ArrowUpRight, Shirt, Book, Tags, Crown } from 'lucide-react';

const ProductTeasers = () => {
  const products = [
    {
      n: '01',
      icon: Shirt,
      kicker: 'APPAREL',
      title: 'T-Shirts & Hoodies',
      description: 'Heavyweight cotton and fleece built for the table and the street.',
      meta: 'DROP · 01',
      span: 'md:col-span-7',
      tall: true,
    },
    {
      n: '02',
      icon: Crown,
      kicker: 'HEADWEAR',
      title: 'Signature Hats',
      description: 'Limited runs. Clean silhouettes. Built to last.',
      meta: 'DROP · 02',
      span: 'md:col-span-5',
    },
    {
      n: '03',
      icon: Book,
      kicker: 'TRAINING',
      title: 'Training Journals',
      description: 'Log every session. Track every drill. See the work compound.',
      meta: 'TOOLKIT · 01',
      span: 'md:col-span-5',
    },
    {
      n: '04',
      icon: Tags,
      kicker: 'EXTRAS',
      title: 'Stickers & Decals',
      description: 'Rep the mark on your case, your journal, anywhere.',
      meta: 'DROP · 03',
      span: 'md:col-span-7',
    },
  ];

  return (
    <section id="products" className="py-24 md:py-36 bg-deadpunch-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-10 relative">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 md:mb-20">
          <div className="md:col-span-8">
            <div className="section-label mb-6">CHAPTER · 02 / THE DROPS</div>
            <h2 className="text-display text-5xl md:text-7xl leading-[0.95] text-deadpunch-bone">
              What's <span className="text-deadpunch-red">coming.</span>
            </h2>
          </div>
          <div className="md:col-span-4 flex md:justify-end md:items-end">
            <p className="text-deadpunch-gray-light text-base md:text-lg max-w-xs leading-relaxed">
              Four product lines launching. Each built for serious play, not aesthetics.
            </p>
          </div>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {products.map((p, i) => {
            const Icon = p.icon;
            return (
              <a
                href="#notify"
                key={p.n}
                className={`group relative card-sport ${p.span} ${p.tall ? 'md:row-span-1' : ''} animate-reveal`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[320px] p-8 md:p-10 flex flex-col justify-between overflow-hidden">
                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 flex items-center justify-center border border-deadpunch-gray-dark group-hover:border-deadpunch-red group-hover:bg-deadpunch-red/10 transition-all duration-300">
                        <Icon className="w-5 h-5 text-deadpunch-bone group-hover:text-deadpunch-red transition-colors" />
                      </div>
                      <span className="text-mono text-[11px] tracking-[0.2em] text-deadpunch-red">{p.kicker}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-mono text-[10px] tracking-[0.2em] text-deadpunch-gray-light/60">{p.meta}</span>
                      <span className="text-display text-2xl text-deadpunch-bone/30 group-hover:text-deadpunch-red transition-colors">{p.n}</span>
                    </div>
                  </div>

                  {/* Bottom */}
                  <div>
                    <h3 className="text-display text-3xl md:text-4xl text-deadpunch-bone mb-3 leading-tight group-hover:text-deadpunch-red transition-colors duration-300">
                      {p.title}
                    </h3>
                    <p className="text-deadpunch-gray-light text-sm md:text-base max-w-md leading-relaxed">
                      {p.description}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-mono text-[11px] tracking-[0.2em] text-deadpunch-bone group-hover:text-deadpunch-red transition-colors">
                      NOTIFY ME
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>

                  {/* Decorative line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-deadpunch-red/0 to-transparent group-hover:via-deadpunch-red/60 transition-all duration-500" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductTeasers;
