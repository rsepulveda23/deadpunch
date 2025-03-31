
import { Helmet } from 'react-helmet';
import Navbar from "@/components/Navbar";
import { Scoreboard } from "@/components/pool/Scoreboard";
import { RackGenerator } from "@/components/pool/RackGenerator";

/**
 * PoolTools Page
 * 
 * A page containing various tools for pool/billiards players:
 * - Scoreboard: Keep track of scores in pool games
 * - Rack Generator: Create randomized rack layouts for different pool games
 */
const PoolTools = () => {
  return (
    <>
      <Helmet>
        <title>Pool Tools | DEADPUNCH</title>
      </Helmet>
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12 mt-4">
          <div className="inline-block px-4 py-1 mb-4 bg-deadpunch-red/10 border border-deadpunch-red/20 rounded-full backdrop-blur-sm hover:border-white/20 transition-all duration-300">
            <p className="text-deadpunch-red font-display uppercase tracking-wider text-sm">
              Training Tools
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Pool Game <span className="text-deadpunch-red">Tools</span>
          </h1>
          <p className="text-deadpunch-gray-light max-w-2xl mx-auto">
            Keep track of your scores and generate perfect racks for 9-ball, 10-ball, or 8-ball games.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scoreboard Section */}
          <Scoreboard />

          {/* Rack Generator Section */}
          <RackGenerator />
        </div>
      </div>
    </>
  );
};

export default PoolTools;
