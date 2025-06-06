
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

export const PlayerScore = ({ player, raceValue, onScoreChange }: PlayerScoreProps) => {
  const hasWon = player.score >= raceValue;
  
  return (
    <div className={cn(
      "p-4 rounded-lg text-center relative overflow-hidden",
      "border-2 border-deadpunch-gray-dark hover:border-deadpunch-red/30 transition-all duration-300 bg-deadpunch-dark-lighter",
      hasWon ? "bg-deadpunch-red/20 animate-pulse-glow border-deadpunch-red" : ""
    )}>
      <h3 className="text-xl font-semibold mb-1 truncate text-white">{player.name}</h3>
      <div className="text-4xl font-display font-bold mb-3 flex justify-center text-white">
        {player.score}
        {hasWon && (
          <span className="ml-2 text-deadpunch-red">🏆</span>
        )}
      </div>
      <div className="flex justify-center space-x-2">
        <Button 
          size="icon" 
          variant="outline"
          onClick={() => onScoreChange(-1)}
          className="border-deadpunch-gray-dark text-white hover:border-deadpunch-red hover:text-white hover:bg-deadpunch-dark bg-deadpunch-dark-lighter"
        >
          <Minus size={18} />
        </Button>
        <Button 
          size="icon" 
          onClick={() => onScoreChange(1)}
          className={cn(
            "bg-deadpunch-red hover:bg-deadpunch-red-hover text-white",
            hasWon && "opacity-50 cursor-not-allowed"
          )}
          disabled={hasWon}
          title={hasWon ? "Player has won. Adjust race value to continue." : "Increment score"}
        >
          <Plus size={18} />
        </Button>
      </div>
    </div>
  );
};
