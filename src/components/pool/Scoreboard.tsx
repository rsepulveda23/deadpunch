
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlayerScore } from './player/PlayerScore';
import { RaceToSelector } from './race/RaceToSelector';
import { toast } from 'sonner';
import { useScoreboardStorage } from './hooks/useScoreboardStorage';

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
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <span className="text-deadpunch-red mr-2">Scoreboard</span>
          <span className="text-sm bg-deadpunch-red/20 text-deadpunch-red px-2 py-1 rounded-full ml-auto">
            Pool
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Player name inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="player1Name">Player 1</Label>
            <Input
              id="player1Name"
              value={player1.name}
              onChange={(e) => handleNameChange("player1", e.target.value)}
              onFocus={() => handleInputFocus("player1")}
              onClick={() => handleInputFocus("player1")}
              className="input-field"
              placeholder="Enter name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="player2Name">Player 2</Label>
            <Input
              id="player2Name"
              value={player2.name}
              onChange={(e) => handleNameChange("player2", e.target.value)}
              onFocus={() => handleInputFocus("player2")}
              onClick={() => handleInputFocus("player2")}
              className="input-field"
              placeholder="Enter name"
            />
          </div>
        </div>

        {/* Player score displays */}
        <div className="grid grid-cols-2 gap-8">
          <PlayerScore 
            player={player1} 
            raceValue={raceValue} 
            onScoreChange={(change) => handleScoreChange("player1", change)} 
          />
          <PlayerScore 
            player={player2} 
            raceValue={raceValue} 
            onScoreChange={(change) => handleScoreChange("player2", change)} 
          />
        </div>

        {/* Race To section */}
        <div className="mt-6">
          <Separator className="bg-deadpunch-gray-dark mb-4" />
          <RaceToSelector value={raceValue} onChange={updateRaceValue} />
        </div>

        {/* Reset buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <Button 
            onClick={handleResetScores}
            variant="outline"
            className="border-white/20 hover:border-white/70"
          >
            Reset Scores
          </Button>
          <Button 
            onClick={handleResetAll}
            variant="outline"
            className="border-deadpunch-red/20 hover:border-deadpunch-red/70 text-deadpunch-red"
          >
            Reset All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
