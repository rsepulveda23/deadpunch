
import React from 'react';

interface ComingSoonHeaderProps {
  category: string;
  subcategory: string;
}

export const ComingSoonHeader = ({ category, subcategory }: ComingSoonHeaderProps) => {
  return (
    <div className="mb-10 md:mb-12">
      <div className="mb-6">
        <span className="section-label">DEADPUNCH / DROP</span>
      </div>

      <h1 className="text-display text-deadpunch-bone leading-[0.95] text-5xl md:text-7xl lg:text-8xl tracking-tighter">
        {category}
      </h1>
      <h2 className="text-display text-deadpunch-red leading-[0.95] text-5xl md:text-7xl lg:text-8xl tracking-tighter mt-1">
        {subcategory}.
      </h2>

      <div className="h-px w-full max-w-md bg-gradient-to-r from-deadpunch-red via-deadpunch-red/40 to-transparent my-8" />

      <p className="text-deadpunch-bone text-lg md:text-xl max-w-xl leading-relaxed">
        We're building the best{' '}
        <span className="text-deadpunch-red">{subcategory.toLowerCase()}</span> in
        the game. Get on the list and we'll let you know the second it drops.
      </p>

      <div className="mt-10 grid grid-cols-3 gap-px bg-deadpunch-gray-dark border border-deadpunch-gray-dark max-w-2xl">
        {[
          { k: 'STATUS', v: 'BUILDING' },
          { k: 'ETA', v: 'SOON' },
          { k: 'EARLY ACCESS', v: 'OPEN' },
        ].map((s) => (
          <div key={s.k} className="bg-deadpunch-dark px-4 py-5">
            <div className="text-mono text-[10px] tracking-[0.2em] text-deadpunch-gray-light">{s.k}</div>
            <div className="mt-2 font-display text-xl md:text-2xl text-deadpunch-bone">{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
