
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Target } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-deadpunch-dark flex flex-col theme-night relative overflow-hidden">
      <div className="noise-overlay" />
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-spot pointer-events-none" />

      {/* Top meta */}
      <div className="relative z-10 px-4 md:px-10 py-6 flex items-center justify-between text-mono text-[11px] tracking-[0.25em] text-deadpunch-gray-light">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-deadpunch-red flex items-center justify-center group-hover:rotate-12 transition-transform">
            <span className="font-display font-bold text-deadpunch-dark text-lg leading-none">D</span>
          </div>
          <span className="font-display font-bold tracking-tighter text-deadpunch-bone text-lg">DEADPUNCH</span>
        </Link>
        <div className="hidden md:flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ticker-flash" />
          ERROR · 404
        </div>
      </div>

      {/* Center */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4">
        <div className="text-center max-w-2xl">
          <div className="mb-6 flex justify-center">
            <span className="section-label">CODE · 404 / OFF THE TABLE</span>
          </div>
          <div className="font-display font-bold text-deadpunch-bone tracking-[-0.05em] leading-none text-[28vw] md:text-[18vw]">
            4<span className="text-deadpunch-red">0</span>4
          </div>
          <h1 className="text-display text-3xl md:text-5xl text-deadpunch-bone mt-4 mb-3">
            Scratch.
          </h1>
          <p className="text-deadpunch-gray-light text-base md:text-lg max-w-md mx-auto mb-10 leading-relaxed">
            This shot didn't drop. The page you're looking for isn't here — or never was.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/" className="btn-primary">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <Link to="/tournaments" className="btn-ghost">
              <Target size={14} />
              Tournaments
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom mono strip */}
      <div className="relative z-10 border-t border-deadpunch-gray-dark py-4 px-4 md:px-10 text-mono text-[10px] tracking-[0.25em] text-deadpunch-gray-light/60 flex flex-col md:flex-row md:justify-between gap-2">
        <span>PATH · {location.pathname}</span>
        <span className="text-deadpunch-red">FOR PLAYERS WHO PLAY TO WIN</span>
      </div>
    </div>
  );
};

export default NotFound;
