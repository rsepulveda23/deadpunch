import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shirt, ShoppingBag, Book } from 'lucide-react';

const ProductTeasers = () => {
  const products = [
    {
      icon: <Shirt className="h-12 w-12 text-deadpunch-red" />,
      title: "T-shirts & Hoodies",
      description: "Stylish apparel for pool enthusiasts both in the game and everyday wear."
    },
    {
      icon: <ShoppingBag className="h-12 w-12 text-deadpunch-red" />,
      title: "Signature Hats",
      description: "Limited edition headwear for both in and out of the pool hall."
    },
    {
      icon: <Book className="h-12 w-12 text-deadpunch-red" />,
      title: "Training Journals",
      description: "Track your progress with our custom-designed training log books."
    }
  ];

  return (
    <section id="products" className="py-16 bg-gradient-to-b from-deadpunch-dark to-deadpunch-dark-lighter">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 mb-4 bg-deadpunch-red/10 border border-deadpunch-red/20 rounded-full backdrop-blur-sm">
            <p className="text-deadpunch-red font-display uppercase tracking-wider text-sm">
              Deadpunch Drops
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 animate-reveal">
            What's <span className="text-deadpunch-red">Coming</span>
          </h2>
          <p className="text-deadpunch-gray-light text-lg animate-reveal delay-100 max-w-2xl mx-auto">
            Get a sneak peek at our first collection of premium gear and accessories coming soon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div 
              key={index} 
              className={`animate-reveal transform transition-all duration-500 delay-${index * 100}`}
            >
              <Card className="bg-deadpunch-dark-lighter border-deadpunch-dark-lightest hover:border-deadpunch-red/30 transition-all duration-300 h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-deadpunch-red/10 mb-6 mt-2">
                    {product.icon}
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3 text-white">{product.title}</h3>
                  <p className="text-deadpunch-gray-light">{product.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductTeasers;
