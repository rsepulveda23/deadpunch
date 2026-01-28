
import { useEffect } from 'react';
import { Shield, Zap, Gauge, Trophy } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, delay }) => (
  <div className={`glass p-6 rounded-lg animate-reveal ${delay} border-l-2 border-deadpunch-red/10 hover:border-deadpunch-red/50 hover:ring-2 hover:ring-deadpunch-red/20 transition-all duration-300 group`}>
    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-deadpunch-red/10 text-deadpunch-red mb-4 border border-deadpunch-red/10 group-hover:border-deadpunch-red/30 group-hover:shadow-[0_0_10px_rgba(0,212,170,0.2)] transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-display font-semibold mb-2 text-white group-hover:text-white transition-colors duration-300">{title}</h3>
    <p className="text-white group-hover:text-white transition-colors duration-300">{description}</p>
  </div>
);

const Features = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('reveal');
            }, 200);
          }
        });
      },
      { threshold: 0.1 }
    );

    const animateElements = document.querySelectorAll('.animate-reveal');
    animateElements.forEach((el) => observer.observe(el));

    return () => {
      animateElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="features" className="relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1 mb-4 bg-deadpunch-red/10 border border-deadpunch-red/20 rounded-full backdrop-blur-sm hover:border-deadpunch-red/40 transition-all duration-300">
            <p className="text-deadpunch-red font-display uppercase tracking-wider text-sm">
              The DEADPUNCH Advantage
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 animate-reveal text-white">
            Unleash Your <span className="text-deadpunch-red">Next Level</span>
          </h2>
          <p className="text-white text-lg animate-reveal delay-100">
            DEADPUNCH combines cutting-edge technology with uncompromising design to 
            deliver a sporting experience that pushes boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-12 bg-gradient-to-b from-deadpunch-red/0 via-deadpunch-red/40 to-deadpunch-red/0"></div>
          
          <FeatureCard
            title="Elite Performance"
            description="Engineered for athletes who demand nothing but the absolute best from their gear and themselves."
            icon={<Gauge size={24} />}
            delay="delay-100"
          />
          <FeatureCard
            title="Revolutionary Tech"
            description="Incorporating next-gen materials and design principles that set new standards in the industry."
            icon={<Zap size={24} />}
            delay="delay-200"
          />
          <FeatureCard
            title="Unmatched Durability"
            description="Built to endure the most intense training sessions and competitive environments."
            icon={<Shield size={24} />}
            delay="delay-300"
          />
          <FeatureCard
            title="Championship Mindset"
            description="Developed with input from champions who understand what it takes to reach the top."
            icon={<Trophy size={24} />}
            delay="delay-400"
          />
          
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-px h-12 bg-gradient-to-b from-deadpunch-red/0 via-deadpunch-red/40 to-deadpunch-red/0"></div>
        </div>
      </div>
    </section>
  );
};

export default Features;
