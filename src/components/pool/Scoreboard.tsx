
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';
import { useScoreboardStorage } from './hooks/useScoreboardStorage';
import { ScoreboardHeader } from './scoreboard/ScoreboardHeader';
import { PlayerNameInputs } from './scoreboard/PlayerNameInputs';
import { PlayerScoresDisplay } from './scoreboard/PlayerScoresDisplay';
import { ScoreboardControls } from './scoreboard/ScoreboardControls';

interface Player {
  name: string;
  score: number;
}

interface ScoreboardProps {
  initialPlayer1?: Player;
  initialPlayer2?: Player;
  initialRaceValue?: number;
}

/**
 * Scoreboard Component
 * 
 * A tool for keeping track of scores in pool games.
 * Features player name inputs, score tracking, and "race to" target adjustment.
 * Scores are persisted in localStorage to survive page refreshes and browser sessions.
 */
export const Scoreboard = ({
  initialPlayer1 = { name: "Player 1", score: 0 },
  initialPlayer2 = { name: "Player 2", score: 0 },
  initialRaceValue = 9
}: ScoreboardProps) => {
  // Use custom hook to manage scoreboard state with persistence
  const { 
    player1, 
    player2, 
    raceValue, 
    updatePlayer1, 
    updatePlayer2,
    updateRaceValue,
    resetScores,
    resetAll
  } = useScoreboardStorage(initialPlayer1, initialPlayer2, initialRaceValue);

  /**
   * Handles score changes for a specific player
   * @param player The player identifier ("player1" or "player2")
   * @param change The amount to change the score by
   */
  const handleScoreChange = (player: "player1" | "player2", change: number) => {
    if (player === "player1") {
      updatePlayer1({ ...player1, score: Math.max(0, player1.score + change) });
    } else {
      updatePlayer2({ ...player2, score: Math.max(0, player2.score + change) });
    }
  };

  /**
   * Handles focus on player name input fields
   * Clears the default placeholder text when focused
   * @param player The player identifier
   */
  const handleInputFocus = (player: "player1" | "player2") => {
    if (player === "player1" && player1.name === "Player 1") {
      updatePlayer1({ ...player1, name: "" });
    } else if (player === "player2" && player2.name === "Player 2") {
      updatePlayer2({ ...player2, name: "" });
    }
  };

  /**
   * Handles name change for a specific player
   * @param player The player identifier ("player1" or "player2")
   * @param name The new name
   */
  const handleNameChange = (player: "player1" | "player2", name: string) => {
    if (player === "player1") {
      updatePlayer1({ ...player1, name });
    } else {
      updatePlayer2({ ...player2, name });
    }
  };

  /**
   * Resets both players' scores to zero and shows notification
   */
  const handleResetScores = () => {
    resetScores();
    toast.success('Scores reset to zero');
  };

  /**
   * Completely reset all scoreboard data including names and race value
   */
  const handleResetAll = () => {
    resetAll();
    toast.success('Scoreboard completely reset');
  };

  return (
    <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark hover:border-white/30 transition-all duration-300">
      <ScoreboardHeader />
      <CardContent className="space-y-6">
        {/* Player name inputs */}
        <PlayerNameInputs 
          player1={player1}
          player2={player2}
          onNameChange={handleNameChange}
          onInputFocus={handleInputFocus}
        />

        {/* Player score displays */}
        <PlayerScoresDisplay 
          player1={player1}
          player2={player2}
          raceValue={raceValue}
          onScoreChange={handleScoreChange}
        />

        {/* Race To section and reset buttons */}
        <ScoreboardControls 
          raceValue={raceValue}
          onRaceValueChange={updateRaceValue}
          onResetScores={handleResetScores}
          onResetAll={handleResetAll}
        />
      </CardContent>
    </Card>
  );
};
