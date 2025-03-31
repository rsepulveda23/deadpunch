
import { PoolBall } from './PoolBall';
import { cn } from "@/lib/utils";
import { GameType } from './GameTypeSelector';

interface RackDisplayProps {
  gameType: GameType;
  rack: number[];
}

export const RackDisplay = ({ gameType, rack }: RackDisplayProps) => {
  // Function to get the appropriate layout classes based on game type
  const getRackLayout = () => {
    if (gameType === "9-ball") {
      // Diamond formation for 9-ball
      return "grid gap-[2px] md:gap-[3px] max-w-[200px] md:max-w-[220px] grid-9-ball";
    } else if (gameType === "10-ball") {
      // Triangle formation for 10-ball (4 rows)
      return "grid gap-[2px] md:gap-[3px] max-w-[200px] md:max-w-[220px] grid-10-ball";
    } else {
      // Triangle formation for 8-ball (5 rows)
      return "grid gap-[2px] md:gap-[3px] max-w-[240px] md:max-w-[260px] grid-8-ball";
    }
  };

  return (
    <div className={cn(
      "min-h-[280px] flex items-center justify-center p-6 rounded-lg",
      "glass border-2 border-white/10 hover:border-white/30 transition-all duration-300",
      "bg-green-950/30" // Pool table green tint
    )}>
      {rack.length > 0 ? (
        <div className={cn(
          getRackLayout(),
          "animate-fade-in relative"
        )}>
          {rack.map((ball, index) => (
            <div key={index} className={`rack-position-${index + 1}`}>
              <PoolBall number={ball} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-deadpunch-gray-light">
            Click "Generate Rack" to create a randomized rack layout
          </p>
        </div>
      )}
    </div>
  );
};
