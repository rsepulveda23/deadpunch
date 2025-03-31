
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
      return `
        grid-cols-5 gap-1 md:gap-2 max-w-[180px] 
        [&>*:nth-child(1)]:col-start-3 [&>*:nth-child(1)]:col-end-4 [&>*:nth-child(1)]:row-start-1
        [&>*:nth-child(2)]:col-start-2 [&>*:nth-child(2)]:col-end-3 [&>*:nth-child(2)]:row-start-2 
        [&>*:nth-child(3)]:col-start-4 [&>*:nth-child(3)]:col-end-5 [&>*:nth-child(3)]:row-start-2
        [&>*:nth-child(4)]:col-start-1 [&>*:nth-child(4)]:col-end-2 [&>*:nth-child(4)]:row-start-3
        [&>*:nth-child(5)]:col-start-3 [&>*:nth-child(5)]:col-end-4 [&>*:nth-child(5)]:row-start-3
        [&>*:nth-child(6)]:col-start-5 [&>*:nth-child(6)]:col-end-6 [&>*:nth-child(6)]:row-start-3
        [&>*:nth-child(7)]:col-start-2 [&>*:nth-child(7)]:col-end-3 [&>*:nth-child(7)]:row-start-4
        [&>*:nth-child(8)]:col-start-4 [&>*:nth-child(8)]:col-end-5 [&>*:nth-child(8)]:row-start-4
        [&>*:nth-child(9)]:col-start-3 [&>*:nth-child(9)]:col-end-4 [&>*:nth-child(9)]:row-start-5
      `;
    } else if (gameType === "10-ball") {
      // Updated triangle formation for 10-ball (4 rows)
      // First row: 1 ball
      // Second row: 2 balls
      // Third row: 3 balls (with 10 ball in the middle)
      // Fourth row: 4 balls
      return `
        grid-cols-7 gap-1 md:gap-2 max-w-[250px]
        [&>*:nth-child(1)]:col-start-4 [&>*:nth-child(1)]:col-end-5 [&>*:nth-child(1)]:row-start-1
        [&>*:nth-child(2)]:col-start-3 [&>*:nth-child(2)]:col-end-4 [&>*:nth-child(2)]:row-start-2
        [&>*:nth-child(3)]:col-start-5 [&>*:nth-child(3)]:col-end-6 [&>*:nth-child(3)]:row-start-2
        [&>*:nth-child(4)]:col-start-2 [&>*:nth-child(4)]:col-end-3 [&>*:nth-child(4)]:row-start-3
        [&>*:nth-child(5)]:col-start-4 [&>*:nth-child(5)]:col-end-5 [&>*:nth-child(5)]:row-start-3
        [&>*:nth-child(6)]:col-start-6 [&>*:nth-child(6)]:col-end-7 [&>*:nth-child(6)]:row-start-3
        [&>*:nth-child(7)]:col-start-1 [&>*:nth-child(7)]:col-end-2 [&>*:nth-child(7)]:row-start-4
        [&>*:nth-child(8)]:col-start-3 [&>*:nth-child(8)]:col-end-4 [&>*:nth-child(8)]:row-start-4
        [&>*:nth-child(9)]:col-start-5 [&>*:nth-child(9)]:col-end-6 [&>*:nth-child(9)]:row-start-4
        [&>*:nth-child(10)]:col-start-7 [&>*:nth-child(10)]:col-end-8 [&>*:nth-child(10)]:row-start-4
      `;
    } else {
      // Triangle formation for 8-ball (5 rows)
      // Using the same positioning convention as 10-ball with an extra row
      return `
        grid-cols-9 gap-1 md:gap-2 max-w-[280px]
        [&>*:nth-child(1)]:col-start-5 [&>*:nth-child(1)]:col-end-6 [&>*:nth-child(1)]:row-start-1
        [&>*:nth-child(2)]:col-start-4 [&>*:nth-child(2)]:col-end-5 [&>*:nth-child(2)]:row-start-2
        [&>*:nth-child(3)]:col-start-6 [&>*:nth-child(3)]:col-end-7 [&>*:nth-child(3)]:row-start-2
        [&>*:nth-child(4)]:col-start-3 [&>*:nth-child(4)]:col-end-4 [&>*:nth-child(4)]:row-start-3
        [&>*:nth-child(5)]:col-start-5 [&>*:nth-child(5)]:col-end-6 [&>*:nth-child(5)]:row-start-3
        [&>*:nth-child(6)]:col-start-7 [&>*:nth-child(6)]:col-end-8 [&>*:nth-child(6)]:row-start-3
        [&>*:nth-child(7)]:col-start-2 [&>*:nth-child(7)]:col-end-3 [&>*:nth-child(7)]:row-start-4
        [&>*:nth-child(8)]:col-start-4 [&>*:nth-child(8)]:col-end-5 [&>*:nth-child(8)]:row-start-4
        [&>*:nth-child(9)]:col-start-6 [&>*:nth-child(9)]:col-end-7 [&>*:nth-child(9)]:row-start-4
        [&>*:nth-child(10)]:col-start-8 [&>*:nth-child(10)]:col-end-9 [&>*:nth-child(10)]:row-start-4
        [&>*:nth-child(11)]:col-start-1 [&>*:nth-child(11)]:col-end-2 [&>*:nth-child(11)]:row-start-5
        [&>*:nth-child(12)]:col-start-3 [&>*:nth-child(12)]:col-end-4 [&>*:nth-child(12)]:row-start-5
        [&>*:nth-child(13)]:col-start-5 [&>*:nth-child(13)]:col-end-6 [&>*:nth-child(13)]:row-start-5
        [&>*:nth-child(14)]:col-start-7 [&>*:nth-child(14)]:col-end-8 [&>*:nth-child(14)]:row-start-5
        [&>*:nth-child(15)]:col-start-9 [&>*:nth-child(15)]:col-end-10 [&>*:nth-child(15)]:row-start-5
      `;
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
          "grid relative", 
          getRackLayout(),
          "animate-fade-in"
        )}>
          {rack.map((ball, index) => (
            <PoolBall key={index} number={ball} />
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
