
import { useState, useEffect } from 'react';

interface Player {
  name: string;
  score: number;
}

interface ScoreboardState {
  player1: Player;
  player2: Player;
  raceValue: number;
  lastUpdated: string;
}

const STORAGE_KEY = 'deadpunch-pool-scoreboard';

/**
 * Custom hook for managing scoreboard state with localStorage persistence
 * 
 * Handles loading, saving, and updating player information and race value.
 * Provides state and methods for completely managing a pool scoreboard.
 */
export const useScoreboardStorage = (
  initialPlayer1: Player = { name: "Player 1", score: 0 },
  initialPlayer2: Player = { name: "Player 2", score: 0 },
  initialRaceValue: number = 9
) => {
  // Initialize state
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
   * Get a human-readable string for time elapsed since the last update
   * @param dateString - ISO string date to calculate time from
   */
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
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

  /**
   * Reset only the scores while keeping player names and race value
   */
  const resetScores = () => {
    setPlayer1({ ...player1, score: 0 });
    setPlayer2({ ...player2, score: 0 });
  };

  /**
   * Reset everything to initial values
   */
  const resetAll = () => {
    setPlayer1(initialPlayer1);
    setPlayer2(initialPlayer2);
    setRaceValue(initialRaceValue);
  };

  return {
    player1,
    player2,
    raceValue,
    updatePlayer1: setPlayer1,
    updatePlayer2: setPlayer2,
    updateRaceValue: setRaceValue,
    resetScores,
    resetAll,
    getTimeAgo,
    isLoaded
  };
};
