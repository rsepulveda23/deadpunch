
import { Helmet } from 'react-helmet';
import Navbar from "@/components/Navbar";
import { Scoreboard } from "@/components/pool/Scoreboard";
import { RackGenerator } from "@/components/pool/RackGenerator";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import TimeIndicator from "@/components/TimeIndicator";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

/**
 * PoolTools Page
 * 
 * A dedicated page containing useful tools for pool/billiards players:
 * 
 * Features:
 * - Scoreboard: For tracking games between two players with customizable race targets
 * - Rack Generator: Creates randomized, tournament-legal rack layouts for different pool games
 * 
 * The tools are responsive and designed to be used on both desktop and mobile devices.
 */
const PoolTools = () => {
  const { themeMode } = useTheme();
  
  return (
    <>
      <Helmet>
        <title>Pool Tools | DEADPUNCH</title>
      </Helmet>
      <Navbar />
      <TimeIndicator />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12 mt-4">
          <div className="flex justify-center mb-4">
            <Link to="/">
              <Button variant="outline" className="border-deadpunch-gray-dark text-white hover:border-deadpunch-red hover:text-deadpunch-red">
                <Home size={18} className="mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className={cn(
            "inline-block px-4 py-1 mb-4 backdrop-blur-sm hover:border-white/20 transition-all duration-300 rounded-full",
            themeMode === 'day' ? "bg-deadpunch-red/10 border border-deadpunch-red/20" : "bg-deadpunch-red/10 border border-deadpunch-red/20"
          )}>
            <p className={cn(
              "font-display uppercase tracking-wider text-sm",
              themeMode === 'day' ? "text-deadpunch-red" : "text-deadpunch-red"
            )}>
              Training Tools
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Pool Game <span className="text-deadpunch-red">Tools</span>
          </h1>
          <p className={cn(
            "max-w-2xl mx-auto",
            themeMode === 'day' ? "text-gray-600" : "text-deadpunch-gray-light"
          )}>
            Enhance your pool game with our interactive score tracking system and tournament-legal rack generator. 
            Perfect for practice sessions, friendly matches, and competitive play in 8-ball, 9-ball, and 10-ball formats.
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
