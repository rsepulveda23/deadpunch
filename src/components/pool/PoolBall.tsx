
import { cn } from "@/lib/utils";

// Ball colors based on standard pool ball colors
const ballColors: Record<number, string> = {
  1: "bg-yellow-400 text-black", // Yellow
  2: "bg-blue-600 text-white", // Blue
  3: "bg-red-600 text-white", // Red
  4: "bg-purple-700 text-white", // Purple
  5: "bg-orange-600 text-white", // Orange
  6: "bg-green-700 text-white", // Green
  7: "bg-red-900 text-white", // Maroon/Burgundy
  8: "bg-black text-white", // Black
  9: "bg-yellow-400 text-black", // Yellow with stripe
  10: "bg-blue-600 text-white", // Blue with stripe
  11: "bg-red-600 text-white", // Red with stripe
  12: "bg-purple-700 text-white", // Purple with stripe
  13: "bg-orange-600 text-white", // Orange with stripe
  14: "bg-green-700 text-white", // Green with stripe
  15: "bg-red-900 text-white", // Maroon/Burgundy with stripe
};

interface PoolBallProps {
  number: number;
}

// Determine if a ball is striped
const isStriped = (number: number) => number >= 9 && number <= 15;

export const PoolBall = ({ number }: PoolBallProps) => {
  const striped = isStriped(number);

  return (
    <div className={cn(
      "w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center font-bold",
      "border border-white/10 shadow-lg",
      "relative overflow-hidden",
      ballColors[number]
    )}>
      {striped && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white w-full h-1/3 absolute"></div>
        </div>
      )}
      <span className={cn(
        "z-10 text-sm md:text-base font-bold",
        striped ? "" : "w-6 h-6 md:w-7 md:h-7 bg-white rounded-full flex items-center justify-center"
      )}>
        {number}
      </span>
    </div>
  );
};
