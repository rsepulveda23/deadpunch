
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

interface Player {
  name: string;
  score: number;
}

interface PlayerScoreProps {
  player: Player;
  raceValue: number;
  onScoreChange: (change: number) => void;
}

/**
 * PlayerScore Component
 * 
 * Displays a player's name and score, with controls to increment or decrement
 * the score. Shows a trophy icon when the player reaches the race target.
 */
export const PlayerScore = ({ player, raceValue, onScoreChange }: PlayerScoreProps) => {
  const hasWon = player.score >= raceValue;
  
  return (
    <div className={cn(
      "p-4 rounded-lg text-center relative overflow-hidden",
      "glass border-2 border-white/10 hover:border-white/30 transition-all duration-300",
      hasWon ? "bg-deadpunch-red/20 animate-pulse-glow" : ""
    )}>
      <h3 className="text-xl font-semibold mb-1 truncate">{player.name}</h3>
      <div className="text-4xl font-display font-bold mb-3 flex justify-center">
        {player.score}
        {hasWon && (
          <span className="text-deadpunch-red ml-2">🏆</span>
        )}
      </div>
      <div className="flex justify-center space-x-2">
        <Button 
          size="icon" 
          variant="outline"
          onClick={() => onScoreChange(-1)}
          className="hover:border-white/50 hover:bg-deadpunch-dark/50"
        >
          <Minus size={18} />
        </Button>
        <Button 
          size="icon" 
          onClick={() => onScoreChange(1)}
          className="bg-deadpunch-red hover:bg-deadpunch-red-hover"
        >
          <Plus size={18} />
        </Button>
      </div>
    </div>
  );
};
