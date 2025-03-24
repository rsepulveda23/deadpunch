
import { useEffect } from 'react';
import { Shield, Zap, Gauge, Trophy } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, delay }) => (
  <div className={`glass p-6 rounded-lg animate-reveal ${delay}`}>
    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-deadpunch-red/10 text-deadpunch-red mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-display font-semibold mb-2">{title}</h3>
    <p className="text-deadpunch-gray-light">{description}</p>
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
          <div className="inline-block px-4 py-1 mb-4 bg-deadpunch-red/10 border border-deadpunch-red/20 rounded-full backdrop-blur-sm">
            <p className="text-deadpunch-red font-display uppercase tracking-wider text-sm">
              The DEADPUNCH Advantage
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 animate-reveal">
            Unleash Your <span className="text-deadpunch-red">Next Level</span>
          </h2>
          <p className="text-deadpunch-gray-light text-lg animate-reveal delay-100">
            DEADPUNCH combines cutting-edge technology with uncompromising design to 
            deliver a sporting experience that pushes boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      </div>
    </section>
  );
};

export default Features;
