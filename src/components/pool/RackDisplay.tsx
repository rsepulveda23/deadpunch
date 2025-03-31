
import { PoolBall } from './PoolBall';
import { cn } from "@/lib/utils";
import { GameType } from './GameTypeSelector';

interface RackDisplayProps {
  gameType: GameType;
  rack: number[];
}

export const RackDisplay = ({ gameType, rack }: RackDisplayProps) => {
  const getRackLayout = () => {
    if (gameType === "9-ball") {
      return `
        grid-cols-5 gap-2 max-w-[180px] 
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
      return `
        grid-cols-5 gap-[-8px] max-w-[80px]
        [&>*:nth-child(1)]:col-start-3 [&>*:nth-child(1)]:col-end-4 [&>*:nth-child(1)]:row-start-1
        [&>*:nth-child(2)]:col-start-2 [&>*:nth-child(2)]:col-end-3 [&>*:nth-child(2)]:row-start-2
        [&>*:nth-child(3)]:col-start-4 [&>*:nth-child(3)]:col-end-5 [&>*:nth-child(3)]:row-start-2
        [&>*:nth-child(4)]:col-start-1 [&>*:nth-child(4)]:col-end-2 [&>*:nth-child(4)]:row-start-3
        [&>*:nth-child(5)]:col-start-3 [&>*:nth-child(5)]:col-end-4 [&>*:nth-child(5)]:row-start-3
        [&>*:nth-child(6)]:col-start-5 [&>*:nth-child(6)]:col-end-6 [&>*:nth-child(6)]:row-start-3
        [&>*:nth-child(7)]:col-start-1 [&>*:nth-child(7)]:col-end-2 [&>*:nth-child(7)]:row-start-4
        [&>*:nth-child(8)]:col-start-2 [&>*:nth-child(8)]:col-end-3 [&>*:nth-child(8)]:row-start-4
        [&>*:nth-child(9)]:col-start-4 [&>*:nth-child(9)]:col-end-5 [&>*:nth-child(9)]:row-start-4
        [&>*:nth-child(10)]:col-start-5 [&>*:nth-child(10)]:col-end-6 [&>*:nth-child(10)]:row-start-4
      `;
    } else {
      return `
        grid-cols-5 gap-[-8px] max-w-[80px]
        [&>*:nth-child(1)]:col-start-3 [&>*:nth-child(1)]:col-end-4 [&>*:nth-child(1)]:row-start-1
        [&>*:nth-child(2)]:col-start-2 [&>*:nth-child(2)]:col-end-3 [&>*:nth-child(2)]:row-start-2
        [&>*:nth-child(3)]:col-start-4 [&>*:nth-child(3)]:col-end-5 [&>*:nth-child(3)]:row-start-2
        [&>*:nth-child(4)]:col-start-1 [&>*:nth-child(4)]:col-end-2 [&>*:nth-child(4)]:row-start-3
        [&>*:nth-child(5)]:col-start-3 [&>*:nth-child(5)]:col-end-4 [&>*:nth-child(5)]:row-start-3
        [&>*:nth-child(6)]:col-start-5 [&>*:nth-child(6)]:col-end-6 [&>*:nth-child(6)]:row-start-3
        [&>*:nth-child(7)]:col-start-1 [&>*:nth-child(7)]:col-end-2 [&>*:nth-child(7)]:row-start-4
        [&>*:nth-child(8)]:col-start-2 [&>*:nth-child(8)]:col-end-3 [&>*:nth-child(8)]:row-start-4
        [&>*:nth-child(9)]:col-start-3 [&>*:nth-child(9)]:col-end-4 [&>*:nth-child(9)]:row-start-4
        [&>*:nth-child(10)]:col-start-4 [&>*:nth-child(10)]:col-end-5 [&>*:nth-child(10)]:row-start-4
        [&>*:nth-child(11)]:col-start-5 [&>*:nth-child(11)]:col-end-6 [&>*:nth-child(11)]:row-start-4
        [&>*:nth-child(12)]:col-start-1 [&>*:nth-child(12)]:col-end-2 [&>*:nth-child(12)]:row-start-5
        [&>*:nth-child(13)]:col-start-2 [&>*:nth-child(13)]:col-end-3 [&>*:nth-child(13)]:row-start-5
        [&>*:nth-child(14)]:col-start-3 [&>*:nth-child(14)]:col-end-4 [&>*:nth-child(14)]:row-start-5
        [&>*:nth-child(14)]:col-start-4 [&>*:nth-child(14)]:col-end-5 [&>*:nth-child(14)]:row-start-5
        [&>*:nth-child(15)]:col-start-5 [&>*:nth-child(15)]:col-end-6 [&>*:nth-child(15)]:row-start-5
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
