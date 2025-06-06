
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
  5: "bg-orange-600 text-black", // Orange
  6: "bg-green-700 text-white",  // Green
  7: "bg-red-900 text-white",    // Maroon/Burgundy
  8: "bg-black text-white",      // Black
  9: "bg-yellow-400 text-black", // Yellow (solid, not striped)
  10: "bg-blue-600 text-white",  // Blue (solid, not striped)
  11: "bg-red-600 text-white",   // Red (solid, not striped)
  12: "bg-purple-700 text-white", // Purple (solid, not striped)
  13: "bg-orange-600 text-black", // Orange (solid, not striped)
  14: "bg-green-700 text-white",  // Green (solid, not striped)
  15: "bg-red-900 text-white",    // Maroon/Burgundy (solid, not striped)
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
 * PoolBall Component
 * 
 * Renders a visual representation of a pool ball with the appropriate:
 * - Color based on standard pool ball colors
 * - Number displayed with white/black text for visibility
 * 
 * Size can be controlled via the sizeClass prop for different game types.
 */
export const PoolBall = ({ number, sizeClass = "w-10 h-10 md:w-11 md:h-11", className }: PoolBallProps) => {
  return (
    <div className={cn(
      sizeClass,
      "rounded-full flex items-center justify-center",
      "border-2 border-deadpunch-gray-dark shadow-lg",
      "relative overflow-hidden",
      ballColors[number],
      className
    )}>
      {/* Number display - simple white/black text on colored background */}
      <div className="z-10 relative flex items-center justify-center">
        <span className="font-bold text-lg md:text-xl drop-shadow-lg">
          {number}
        </span>
      </div>
    </div>
  );
};
