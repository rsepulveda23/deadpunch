
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProductTeasers from '@/components/ProductTeasers';
import EmailForm from '@/components/EmailForm';
import TikTokIcon from '@/components/icons/TikTokIcon';
import { Mail, Phone, Target, ArrowUpRight } from 'lucide-react';

const Index = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );

    document.querySelectorAll('.animate-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-deadpunch-dark text-deadpunch-bone theme-night">
      <div className="noise-overlay" />

      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProductTeasers />
      <EmailForm />

      {/* FOOTER — sports magazine masthead */}
      <footer className="relative bg-deadpunch-dark border-t border-deadpunch-gray-dark">
        {/* Giant brand wordmark */}
        <div className="container mx-auto px-4 md:px-10 pt-16 pb-10 md:pt-24 md:pb-14">
          <div className="font-display font-bold text-deadpunch-bone tracking-[-0.05em] leading-none text-[18vw] md:text-[14vw] select-none">
            DEAD<span className="text-deadpunch-red">PUNCH</span>
          </div>
        </div>

        {/* Footer grid */}
        <div className="container mx-auto px-4 md:px-10 pb-12 grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-10">
          {/* Mission */}
          <div className="col-span-2 md:col-span-4">
            <p className="text-mono text-[11px] tracking-[0.25em] text-deadpunch-red mb-4">MISSION</p>
            <p className="text-deadpunch-bone leading-relaxed text-sm md:text-base">
              Performance gear and a competitive home for serious pool players.
              No filler. No hype. Just the work.
            </p>
          </div>

          {/* Explore */}
          <div className="md:col-span-2">
            <p className="text-mono text-[11px] tracking-[0.25em] text-deadpunch-red mb-4">EXPLORE</p>
            <ul className="space-y-2.5">
              <li><Link to="/tournaments" className="text-sm text-deadpunch-bone hover:text-deadpunch-red transition-colors flex items-center gap-1.5 group">Tournaments <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><Link to="/pool-tools" className="text-sm text-deadpunch-bone hover:text-deadpunch-red transition-colors flex items-center gap-1.5 group">Pool Tools <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><a href="#products" className="text-sm text-deadpunch-bone hover:text-deadpunch-red transition-colors flex items-center gap-1.5 group">Drops <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
              <li><a href="#about" className="text-sm text-deadpunch-bone hover:text-deadpunch-red transition-colors flex items-center gap-1.5 group">The Brand <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
            </ul>
          </div>

          {/* Shop */}
          <div className="md:col-span-2">
            <p className="text-mono text-[11px] tracking-[0.25em] text-deadpunch-red mb-4">SHOP</p>
            <ul className="space-y-2.5">
              <li><Link to="/men/t-shirts" className="text-sm text-deadpunch-bone hover:text-deadpunch-red transition-colors">Men</Link></li>
              <li><Link to="/women/t-shirts" className="text-sm text-deadpunch-bone hover:text-deadpunch-red transition-colors">Women</Link></li>
              <li><Link to="/new-arrivals/t-shirts" className="text-sm text-deadpunch-bone hover:text-deadpunch-red transition-colors">New Arrivals</Link></li>
              <li><Link to="/training-tools/journals" className="text-sm text-deadpunch-bone hover:text-deadpunch-red transition-colors">Training Tools</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-4">
            <p className="text-mono text-[11px] tracking-[0.25em] text-deadpunch-red mb-4">CONTACT</p>
            <ul className="space-y-3">
              <li>
                <a href="mailto:contact@deadpunch.com" className="group flex items-center gap-3 text-sm text-deadpunch-bone hover:text-deadpunch-red transition-colors">
                  <Mail size={14} className="text-deadpunch-gray-light group-hover:text-deadpunch-red transition-colors" />
                  contact@deadpunch.com
                </a>
              </li>
              <li>
                <a href="tel:+14134759156" className="group flex items-center gap-3 text-sm text-deadpunch-bone hover:text-deadpunch-red transition-colors">
                  <Phone size={14} className="text-deadpunch-gray-light group-hover:text-deadpunch-red transition-colors" />
                  413 · 475 · 9156
                </a>
              </li>
              <li>
                <Link to="/pool-tools" className="group flex items-center gap-3 text-sm text-deadpunch-bone hover:text-deadpunch-red transition-colors">
                  <Target size={14} className="text-deadpunch-gray-light group-hover:text-deadpunch-red transition-colors" />
                  Pool Tools
                </Link>
              </li>
              <li>
                <a href="https://www.tiktok.com/@deadpunch.com" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-sm text-deadpunch-bone hover:text-deadpunch-red transition-colors">
                  <TikTokIcon size={16} />
                  @deadpunch.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-deadpunch-gray-dark">
          <div className="container mx-auto px-4 md:px-10 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-mono text-[10px] tracking-[0.25em] text-deadpunch-gray-light">
            <div>© {new Date().getFullYear()} · DEADPUNCH™ · ALL RIGHTS RESERVED</div>
            <div className="flex items-center gap-4">
              <span>BUILT IN THE NORTHEAST</span>
              <span className="text-deadpunch-gray-light/40">·</span>
              <span className="text-deadpunch-red">FOR PLAYERS WHO PLAY TO WIN</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
