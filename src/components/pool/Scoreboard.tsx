
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlayerScore } from './player/PlayerScore';
import { RaceToSelector } from './race/RaceToSelector';
import { toast } from 'sonner';

interface Player {
  name: string;
  score: number;
}

interface ScoreboardProps {
  initialPlayer1?: Player;
  initialPlayer2?: Player;
  initialRaceValue?: number;
}

interface ScoreboardState {
  player1: Player;
  player2: Player;
  raceValue: number;
  lastUpdated: string;
}

const STORAGE_KEY = 'deadpunch-pool-scoreboard';

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
  // Initialize state from localStorage or defaults
  const [player1, setPlayer1] = useState<Player>(initialPlayer1);
  const [player2, setPlayer2] = useState<Player>(initialPlayer2);
  const [raceValue, setRaceValue] = useState(initialRaceValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state from localStorage on component mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState) as ScoreboardState;
        setPlayer1(parsedState.player1);
        setPlayer2(parsedState.player2);
        setRaceValue(parsedState.raceValue);
        
        // Show toast notification about restored state
        const lastUpdated = new Date(parsedState.lastUpdated);
        const timeAgo = getTimeAgo(lastUpdated);
        toast.info(`Scoreboard restored from ${timeAgo}`);
      }
    } catch (error) {
      console.error("Error loading scoreboard data:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return; // Skip initial render to prevent overwriting with defaults

    const stateToSave: ScoreboardState = {
      player1,
      player2,
      raceValue,
      lastUpdated: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving scoreboard data:", error);
    }
  }, [player1, player2, raceValue, isLoaded]);

  /**
   * Handles score changes for a specific player
   * @param player The player identifier ("player1" or "player2")
   * @param change The amount to change the score by
   */
  const handleScoreChange = (player: "player1" | "player2", change: number) => {
    if (player === "player1") {
      setPlayer1(prev => ({ ...prev, score: Math.max(0, prev.score + change) }));
    } else {
      setPlayer2(prev => ({ ...prev, score: Math.max(0, prev.score + change) }));
    }
  };

  /**
   * Handles focus on player name input fields
   * Clears the default placeholder text when focused
   * @param player The player identifier
   */
  const handleInputFocus = (player: "player1" | "player2") => {
    if (player === "player1" && player1.name === "Player 1") {
      setPlayer1({ ...player1, name: "" });
    } else if (player === "player2" && player2.name === "Player 2") {
      setPlayer2({ ...player2, name: "" });
    }
  };

  /**
   * Handles name change for a specific player
   * @param player The player identifier ("player1" or "player2")
   * @param name The new name
   */
  const handleNameChange = (player: "player1" | "player2", name: string) => {
    if (player === "player1") {
      setPlayer1({ ...player1, name });
    } else {
      setPlayer2({ ...player2, name });
    }
  };

  /**
   * Resets both players' scores to zero and shows notification
   */
  const resetScores = () => {
    setPlayer1({ ...player1, score: 0 });
    setPlayer2({ ...player2, score: 0 });
    toast.success('Scores reset to zero');
  };

  /**
   * Completely reset all scoreboard data including names and race value
   */
  const resetAll = () => {
    setPlayer1(initialPlayer1);
    setPlayer2(initialPlayer2);
    setRaceValue(initialRaceValue);
    toast.success('Scoreboard completely reset');
  };

  /**
   * Helper function to format the time ago for toast notifications
   */
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    return 'just now';
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
          <RaceToSelector value={raceValue} onChange={setRaceValue} />
        </div>

        {/* Reset buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <Button 
            onClick={resetScores}
            variant="outline"
            className="border-white/20 hover:border-white/70"
          >
            Reset Scores
          </Button>
          <Button 
            onClick={resetAll}
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
