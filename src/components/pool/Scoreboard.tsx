
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Player {
  name: string;
  score: number;
}

interface ScoreboardProps {
  initialPlayer1?: Player;
  initialPlayer2?: Player;
  initialRaceValue?: number;
}

export const Scoreboard = ({
  initialPlayer1 = { name: "Player 1", score: 0 },
  initialPlayer2 = { name: "Player 2", score: 0 },
  initialRaceValue = 9
}: ScoreboardProps) => {
  const [player1, setPlayer1] = useState<Player>(initialPlayer1);
  const [player2, setPlayer2] = useState<Player>(initialPlayer2);
  const [raceValue, setRaceValue] = useState(initialRaceValue);

  // Handle score changes
  const handleScoreChange = (player: "player1" | "player2", change: number) => {
    if (player === "player1") {
      setPlayer1(prev => ({ ...prev, score: Math.max(0, prev.score + change) }));
    } else {
      setPlayer2(prev => ({ ...prev, score: Math.max(0, prev.score + change) }));
    }
  };

  // Handle focus on input field to clear the value
  const handleInputFocus = (player: "player1" | "player2") => {
    if (player === "player1" && player1.name === "Player 1") {
      setPlayer1({ ...player1, name: "" });
    } else if (player === "player2" && player2.name === "Player 2") {
      setPlayer2({ ...player2, name: "" });
    }
  };

  return (
    <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark hover:border-white/30 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <span className="text-deadpunch-red mr-2">Scoreboard</span>
          <span className="text-sm bg-deadpunch-red/20 text-deadpunch-red px-2 py-1 rounded-full ml-auto">
            Race to {raceValue}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="player1Name">Player 1</Label>
            <Input
              id="player1Name"
              value={player1.name}
              onChange={(e) => setPlayer1({ ...player1, name: e.target.value })}
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
              onChange={(e) => setPlayer2({ ...player2, name: e.target.value })}
              onFocus={() => handleInputFocus("player2")}
              onClick={() => handleInputFocus("player2")}
              className="input-field"
              placeholder="Enter name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="raceValue">Race To</Label>
          <Input
            id="raceValue"
            type="number"
            min="1"
            value={raceValue}
            onChange={(e) => setRaceValue(parseInt(e.target.value) || 1)}
            className="input-field"
          />
        </div>

        <Separator className="bg-deadpunch-gray-dark" />

        <div className="grid grid-cols-2 gap-8">
          {/* Player 1 Score */}
          <div className={cn(
            "p-4 rounded-lg text-center relative overflow-hidden",
            "glass border-2 border-white/10 hover:border-white/30 transition-all duration-300",
            player1.score >= raceValue ? "bg-deadpunch-red/20 animate-pulse-glow" : ""
          )}>
            <h3 className="text-xl font-semibold mb-1 truncate">{player1.name || "Player 1"}</h3>
            <div className="text-4xl font-display font-bold mb-3 flex justify-center">
              {player1.score}
              {player1.score >= raceValue && (
                <span className="text-deadpunch-red ml-2">🏆</span>
              )}
            </div>
            <div className="flex justify-center space-x-2">
              <Button 
                size="icon" 
                variant="outline"
                onClick={() => handleScoreChange("player1", -1)}
                className="hover:border-white/50 hover:bg-deadpunch-dark/50"
              >
                <Minus size={18} />
              </Button>
              <Button 
                size="icon" 
                onClick={() => handleScoreChange("player1", 1)}
                className="bg-deadpunch-red hover:bg-deadpunch-red-hover"
              >
                <Plus size={18} />
              </Button>
            </div>
          </div>

          {/* Player 2 Score */}
          <div className={cn(
            "p-4 rounded-lg text-center relative overflow-hidden",
            "glass border-2 border-white/10 hover:border-white/30 transition-all duration-300",
            player2.score >= raceValue ? "bg-deadpunch-red/20 animate-pulse-glow" : ""
          )}>
            <h3 className="text-xl font-semibold mb-1 truncate">{player2.name || "Player 2"}</h3>
            <div className="text-4xl font-display font-bold mb-3 flex justify-center">
              {player2.score}
              {player2.score >= raceValue && (
                <span className="text-deadpunch-red ml-2">🏆</span>
              )}
            </div>
            <div className="flex justify-center space-x-2">
              <Button 
                size="icon" 
                variant="outline"
                onClick={() => handleScoreChange("player2", -1)}
                className="hover:border-white/50 hover:bg-deadpunch-dark/50"
              >
                <Minus size={18} />
              </Button>
              <Button 
                size="icon" 
                onClick={() => handleScoreChange("player2", 1)}
                className="bg-deadpunch-red hover:bg-deadpunch-red-hover"
              >
                <Plus size={18} />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <Button 
            onClick={() => {
              setPlayer1({ ...player1, score: 0 });
              setPlayer2({ ...player2, score: 0 });
            }}
            variant="outline"
            className="border-white/20 hover:border-white/70"
          >
            Reset Scores
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
