
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

const PoolTools = () => {
  // Scoreboard state
  const [player1, setPlayer1] = useState({ name: "Player 1", score: 0 });
  const [player2, setPlayer2] = useState({ name: "Player 2", score: 0 });
  const [raceValue, setRaceValue] = useState(9);
  
  // Rack generator state
  const [gameType, setGameType] = useState("9-ball");
  const [rack, setRack] = useState<number[]>([]);

  // Ball colors based on standard pool ball colors
  const ballColors: Record<number, string> = {
    1: "bg-yellow-400 text-black", // Yellow
    2: "bg-blue-600 text-white", // Blue
    3: "bg-red-600 text-white", // Red
    4: "bg-purple-700 text-white", // Purple
    5: "bg-orange-600 text-white", // Orange
    6: "bg-green-700 text-white", // Green
    7: "bg-red-900 text-white", // Maroon
    8: "bg-black text-white", // Black
    9: "bg-yellow-500 text-black", // Striped Yellow
    10: "bg-blue-500 text-white", // Striped Blue
    11: "bg-red-500 text-white", // Striped Red
    12: "bg-purple-500 text-white", // Striped Purple
    13: "bg-orange-500 text-white", // Striped Orange
    14: "bg-green-500 text-white", // Striped Green
    15: "bg-red-800 text-white", // Striped Maroon
  };

  // Handle score changes
  const handleScoreChange = (player: "player1" | "player2", change: number) => {
    if (player === "player1") {
      setPlayer1(prev => ({ ...prev, score: Math.max(0, prev.score + change) }));
    } else {
      setPlayer2(prev => ({ ...prev, score: Math.max(0, prev.score + change) }));
    }
  };

  // Generate rack based on game type
  const generateRack = () => {
    if (gameType === "9-ball") {
      // 9-ball: 1 at front, 9 in center, 2-8 shuffled
      const middle = [2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5);
      middle.splice(3, 0, 9); // Insert 9 in center
      setRack([1, ...middle]);
    } else if (gameType === "10-ball") {
      // 10-ball: 1 at front, 10 in center, 2-9 shuffled
      const middle = [2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
      middle.splice(4, 0, 10); // Insert 10 in center
      setRack([1, ...middle]);
    } else {
      // 8-ball: 8 in center, other balls shuffled
      const allBalls = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15].sort(() => Math.random() - 0.5);
      const firstHalf = allBalls.slice(0, 7);
      const secondHalf = allBalls.slice(7);
      setRack([...firstHalf, 8, ...secondHalf]);
    }
  };

  // UI for rendering a pool ball
  const PoolBall = ({ number }: { number: number }) => (
    <div className={cn(
      "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300",
      "border-2 border-white/20 shadow-lg hover:scale-110 hover:border-white/70",
      ballColors[number]
    )}>
      {number}
    </div>
  );

  // Determine rack layout based on game type
  let rackLayout = "grid-cols-5";
  if (gameType === "9-ball") {
    rackLayout = "grid-cols-3 justify-items-center";
  } else if (gameType === "10-ball") {
    rackLayout = "grid-cols-4 justify-items-center";
  }

  return (
    <>
      <Helmet>
        <title>Pool Tools | DEADPUNCH</title>
      </Helmet>
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12 mt-4">
          <div className="inline-block px-4 py-1 mb-4 bg-deadpunch-red/10 border border-deadpunch-red/20 rounded-full backdrop-blur-sm hover:border-white/20 transition-all duration-300">
            <p className="text-deadpunch-red font-display uppercase tracking-wider text-sm">
              Training Tools
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Pool Game <span className="text-deadpunch-red">Tools</span>
          </h1>
          <p className="text-deadpunch-gray-light max-w-2xl mx-auto">
            Keep track of your scores and generate perfect racks for 9-ball, 10-ball, or 8-ball games.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scoreboard Section */}
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
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="player2Name">Player 2</Label>
                  <Input
                    id="player2Name"
                    value={player2.name}
                    onChange={(e) => setPlayer2({ ...player2, name: e.target.value })}
                    className="input-field"
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
                  <h3 className="text-xl font-semibold mb-1 truncate">{player1.name}</h3>
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
                  <h3 className="text-xl font-semibold mb-1 truncate">{player2.name}</h3>
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

          {/* Rack Generator Section */}
          <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark hover:border-white/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-deadpunch-red">Rack Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Game Type</Label>
                <RadioGroup 
                  value={gameType} 
                  onValueChange={setGameType}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="9-ball" 
                      id="r1" 
                      className="border-white/50 text-deadpunch-red"
                    />
                    <Label htmlFor="r1">9-Ball</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="10-ball" 
                      id="r2" 
                      className="border-white/50 text-deadpunch-red"
                    />
                    <Label htmlFor="r2">10-Ball</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="8-ball" 
                      id="r3" 
                      className="border-white/50 text-deadpunch-red"
                    />
                    <Label htmlFor="r3">8-Ball</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button 
                onClick={generateRack} 
                className="w-full bg-deadpunch-red hover:bg-deadpunch-red-hover group"
              >
                <RefreshCw size={18} className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Generate Rack
              </Button>

              <div className={cn(
                "min-h-[200px] flex items-center justify-center p-6 rounded-lg",
                "glass border-2 border-white/10 hover:border-white/30 transition-all duration-300"
              )}>
                {rack.length > 0 ? (
                  <div className={cn(
                    "grid gap-3", 
                    rackLayout,
                    "animate-fade-in"
                  )}>
                    {rack.map((ball, index) => (
                      <PoolBall key={index} number={ball} />
                    ))}
                  </div>
                ) : (
                  <p className="text-deadpunch-gray-light text-center">
                    Click "Generate Rack" to create a randomized rack layout
                  </p>
                )}
              </div>

              <div className="bg-deadpunch-red/10 border border-deadpunch-red/30 rounded-lg p-3 text-sm text-deadpunch-gray-light">
                <p>
                  <strong className="text-white">Game Rules:</strong><br />
                  {gameType === "9-ball" && "Ball 1 at the front, ball 9 in the center, others randomly placed."}
                  {gameType === "10-ball" && "Ball 1 at the front, ball 10 in the center, others randomly placed."}
                  {gameType === "8-ball" && "Ball 8 in the center, other balls randomly arranged in the triangle."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PoolTools;
