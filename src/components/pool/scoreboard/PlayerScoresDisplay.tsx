
import { PlayerScore } from '../player/PlayerScore';

interface Player {
  name: string;
  score: number;
}

interface PlayerScoresDisplayProps {
  player1: Player;
  player2: Player;
  raceValue: number;
  onScoreChange: (player: "player1" | "player2", change: number) => void;
}

/**
 * PlayerScoresDisplay Component
 * 
 * Displays the scores for both players side by side,
 * with controls to increment or decrement each player's score.
 */
export const PlayerScoresDisplay = ({ 
  player1, 
  player2, 
  raceValue, 
  onScoreChange 
}: PlayerScoresDisplayProps) => {
  return (
    <div className="grid grid-cols-2 gap-8">
      <PlayerScore 
        player={player1} 
        raceValue={raceValue} 
        onScoreChange={(change) => onScoreChange("player1", change)} 
      />
      <PlayerScore 
        player={player2} 
        raceValue={raceValue} 
        onScoreChange={(change) => onScoreChange("player2", change)} 
      />
    </div>
  );
};
