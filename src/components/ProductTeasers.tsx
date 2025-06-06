
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shirt, Book, Tags } from 'lucide-react';

const ProductTeasers = () => {
  const products = [
    {
      icon: <Shirt className="h-12 w-12 text-deadpunch-red group-hover:text-deadpunch-red transition-colors duration-300" />,
      title: "T-shirts & Hoodies",
      description: "Stylish apparel for pool enthusiasts both in the game and everyday wear."
    },
    {
      icon: (
        <div className="relative w-12 h-12 flex items-center justify-center">
          <img 
            src="/lovable-uploads/32d5857c-48eb-4cd6-95eb-8044d6d46782.png" 
            alt="Signature Hat"
            className="h-10 w-10 z-10 object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      ),
      title: "Signature Hats",
      description: "Limited edition headwear for both in and out of the pool hall."
    },
    {
      icon: <Book className="h-12 w-12 text-deadpunch-red group-hover:text-deadpunch-red transition-colors duration-300" />,
      title: "Training Journals",
      description: "Track your progress with our custom-designed training log books."
    },
    {
      icon: <Tags className="h-12 w-12 text-deadpunch-red group-hover:text-deadpunch-red transition-colors duration-300" />,
      title: "Stickers & Decals",
      description: "Personalize your journal, cue case, or gear with Deadpunch stickers."
    }
  ];

  return (
    <section id="products" className="py-16 bg-gradient-to-b from-deadpunch-dark to-deadpunch-dark-lighter relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 mb-4 bg-deadpunch-red/10 border border-deadpunch-red/20 rounded-full backdrop-blur-sm hover:border-deadpunch-red/40 transition-all duration-300">
            <p className="text-deadpunch-red font-display uppercase tracking-wider text-sm">
              Deadpunch Drops
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 animate-reveal text-deadpunch-gray-light">
            What's <span className="text-deadpunch-red">Coming</span>
          </h2>
          <p className="text-deadpunch-gray-light text-lg md:text-xl font-display font-medium mb-4 animate-reveal max-w-4xl mx-auto">
            The ultimate gear and mindset brand for competitive pool players
          </p>
          <p className="text-deadpunch-gray-light text-lg animate-reveal delay-100 max-w-2xl mx-auto">
            Preview our upcoming premium gear collection dropping soon.
          </p>
          
          <div className="w-16 h-px bg-deadpunch-red/30 mx-auto mt-8 hover:bg-deadpunch-red/50 transition-colors duration-300"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div 
              key={index} 
              className={`animate-reveal transform transition-all duration-500 delay-${index * 100}`}
            >
              <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark hover:border-deadpunch-red/40 hover:ring-2 hover:ring-deadpunch-red/20 transition-all duration-300 h-full group">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-deadpunch-red/10 mb-6 mt-2 ring-2 ring-deadpunch-red/10 group-hover:ring-deadpunch-red/40 group-hover:bg-deadpunch-red/20 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(225,60,60,0.3)]">
                    {product.icon}
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3 text-deadpunch-gray-light group-hover:text-deadpunch-gray-light group-hover:drop-shadow-[0_0_2px_rgba(225,60,60,0.5)] transition-all duration-300">{product.title}</h3>
                  <p className="text-deadpunch-gray-light group-hover:text-deadpunch-gray-light transition-colors duration-300">{product.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        <div className="w-full flex justify-center mt-16">
          <div className="relative w-40 h-0.5 group hover:w-52 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-deadpunch-red/30 to-transparent group-hover:via-deadpunch-red/70 transition-colors duration-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductTeasers;
