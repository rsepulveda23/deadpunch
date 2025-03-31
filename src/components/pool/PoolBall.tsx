
import { cn } from "@/lib/utils";

/**
 * Color mapping for standard pool balls
 * - Solid balls: 1-8
 * - Striped balls: 9-15 (match colors with their solid counterparts)
 * - 8 ball is black (special)
 */
const ballColors: Record<number, string> = {
  1: "bg-yellow-400 text-black", // Yellow
  2: "bg-blue-600 text-white",   // Blue
  3: "bg-red-600 text-white",    // Red
  4: "bg-purple-700 text-white", // Purple
  5: "bg-orange-600 text-white", // Orange
  6: "bg-green-700 text-white",  // Green
  7: "bg-red-900 text-white",    // Maroon/Burgundy
  8: "bg-black text-white",      // Black
  9: "bg-yellow-400 text-black", // Yellow with stripe (same as 1)
  10: "bg-blue-600 text-white",  // Blue with stripe (same as 2)
  11: "bg-red-600 text-white",   // Red with stripe (same as 3)
  12: "bg-purple-700 text-white", // Purple with stripe (same as 4)
  13: "bg-orange-600 text-white", // Orange with stripe (same as 5)
  14: "bg-green-700 text-white",  // Green with stripe (same as 6)
  15: "bg-red-900 text-white",    // Maroon/Burgundy with stripe (same as 7)
};

interface PoolBallProps {
  /** The number on the pool ball (1-15) */
  number: number;
  /** Optional class to control the ball size */
  sizeClass?: string;
  /** Optional class for custom styling */
  className?: string;
}

/**
 * Determines if a ball is striped based on its number
 * In standard pool, balls 9-15 are striped variants of 1-7
 */
const isStriped = (number: number) => number >= 9 && number <= 15;

/**
 * PoolBall Component
 * 
 * Renders a visual representation of a pool ball with the appropriate:
 * - Color based on standard pool ball colors
 * - Pattern (solid or striped) based on ball number
 * - Number displayed in a white circle for readability
 * 
 * Size can be controlled via the sizeClass prop for different game types.
 */
export const PoolBall = ({ number, sizeClass = "w-10 h-10 md:w-11 md:h-11", className }: PoolBallProps) => {
  const striped = isStriped(number);

  // Adjust the number circle size based on the overall ball size
  const getNumberCircleSize = () => {
    if (sizeClass.includes("w-12")) {
      return "w-7 h-7 md:w-8 md:h-8"; // Larger number circle for larger balls
    } else if (sizeClass.includes("w-11")) {
      return "w-6 h-6 md:w-7 md:h-7"; // Medium number circle
    }
    return "w-6 h-6 md:w-6 md:h-6"; // Default number circle size
  };

  return (
    <div className={cn(
      sizeClass,
      "rounded-full flex items-center justify-center",
      "border border-white/20 shadow-lg",
      "relative overflow-hidden",
      ballColors[number],
      className
    )}>
      {/* Stripe pattern for balls 9-15 */}
      {striped && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white w-full h-1/3 absolute"></div>
        </div>
      )}
      
      {/* Number display - consistent circular white background for all balls */}
      <div className="z-10 relative flex items-center justify-center">
        <div className={cn(
          getNumberCircleSize(),
          "bg-white rounded-full flex items-center justify-center"
        )}>
          <span className="font-bold text-sm md:text-base text-black">
            {number}
          </span>
        </div>
      </div>
    </div>
  );
};
