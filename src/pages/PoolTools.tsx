
import { useState, useEffect } from 'react';
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
  const [rackImage, setRackImage] = useState<string | null>(null);

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
      // 9-ball: ball 1 at the front, ball 9 in center
      const rackArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      
      // First, remove 1 and 9 from the available balls
      const availableBalls = [2, 3, 4, 5, 6, 7, 8];
      
      // Shuffle available balls
      const shuffledBalls = availableBalls.sort(() => Math.random() - 0.5);
      
      // Place 1 at the top (first position)
      // Place shuffled balls in positions 2-8
      // Insert 9 in the center (position 5)
      const finalRack = [
        1,                    // Top of the diamond - first ball
        shuffledBalls[0],     // Second row - left
        shuffledBalls[1],     // Second row - right
        shuffledBalls[2],     // Third row - left
        9,                    // Third row - middle (ALWAYS ball 9)
        shuffledBalls[3],     // Third row - right
        shuffledBalls[4],     // Fourth row - left
        shuffledBalls[5],     // Fourth row - right
        shuffledBalls[6]      // Fifth row - bottom
      ];
      
      setRack(finalRack);
      
    } else if (gameType === "10-ball") {
      // 10-ball: ball 1 at the front, ball 10 in center
      
      // First, remove 1 and 10 from the available balls
      const availableBalls = [2, 3, 4, 5, 6, 7, 8, 9];
      
      // Shuffle available balls
      const shuffledBalls = availableBalls.sort(() => Math.random() - 0.5);
      
      // Place balls in a 10-ball rack pattern (4 rows triangle)
      // 1 at the top, 10 in the center
      const finalRack = [
        1,                    // Top of the diamond - first ball
        shuffledBalls[0],     // Second row - left
        shuffledBalls[1],     // Second row - right
        shuffledBalls[2],     // Third row - left
        10,                   // Third row - middle (ALWAYS ball 10)
        shuffledBalls[3],     // Third row - right
        shuffledBalls[4],     // Fourth row - left
        shuffledBalls[5],     // Fourth row - middle-left
        shuffledBalls[6],     // Fourth row - middle-right
        shuffledBalls[7]      // Fourth row - right
      ];
      
      setRack(finalRack);
      
    } else if (gameType === "8-ball") {
      // 8-ball: 1-7 solids & 9-15 stripes mixed, 8 in center
      
      // Create arrays for solids and stripes
      const solids = [1, 2, 3, 4, 5, 6, 7];
      const stripes = [9, 10, 11, 12, 13, 14, 15];
      
      // Shuffle solid and stripe arrays
      const shuffledSolids = [...solids].sort(() => Math.random() - 0.5);
      const shuffledStripes = [...stripes].sort(() => Math.random() - 0.5);
      
      // Ensure we have one solid and one stripe at the back corners
      const firstCorner = Math.random() > 0.5 ? shuffledSolids.pop()! : shuffledStripes.pop()!;
      const secondCorner = firstCorner <= 8 ? shuffledStripes.pop()! : shuffledSolids.pop()!;
      
      // Combine remaining balls, excluding 8 ball and corner balls
      const remainingBalls = [...shuffledSolids, ...shuffledStripes].sort(() => Math.random() - 0.5);
      
      // Create the rack with proper 8-ball rules
      // 15-ball triangle with 8-ball in the center
      // First solid on one back corner, first stripe on other back corner
      const finalRack = [
        1,                     // Front (apex) - can be any ball, but typically 1
        remainingBalls[0],     // Second row - left
        remainingBalls[1],     // Second row - right
        remainingBalls[2],     // Third row - left
        8,                     // Third row - middle (ALWAYS 8 ball)
        remainingBalls[3],     // Third row - right
        remainingBalls[4],     // Fourth row - left
        remainingBalls[5],     // Fourth row - middle-left
        remainingBalls[6],     // Fourth row - middle-right
        remainingBalls[7],     // Fourth row - right
        remainingBalls[8],     // Fifth row - left
        remainingBalls[9],     // Fifth row - middle-left
        remainingBalls[10],    // Fifth row - middle
        remainingBalls[11],    // Fifth row - middle-right
        firstCorner,           // Fifth row - right corner (solid or stripe)
      ];
      
      setRack(finalRack);
    }
  };

  // Get the rack layout based on game type
  const getRackLayout = () => {
    if (gameType === "9-ball") {
      return `
        grid-cols-5 gap-0.5 max-w-[240px]
        [&>*:nth-child(1)]:col-start-3 [&>*:nth-child(1)]:col-end-4 [&>*:nth-child(1)]:row-start-1
        [&>*:nth-child(2)]:col-start-2 [&>*:nth-child(2)]:col-end-3 [&>*:nth-child(2)]:row-start-2 
        [&>*:nth-child(3)]:col-start-4 [&>*:nth-child(3)]:col-end-5 [&>*:nth-child(3)]:row-start-2
        [&>*:nth-child(4)]:col-start-1 [&>*:nth-child(4)]:col-end-2 [&>*:nth-child(4)]:row-start-3
        [&>*:nth-child(5)]:col-start-3 [&>*:nth-child(5)]:col-end-4 [&>*:nth-child(5)]:row-start-3
        [&>*:nth-child(6)]:col-start-5 [&>*:nth-child(6)]:col-end-6 [&>*:nth-child(6)]:row-start-3
        [&>*:nth-child(7)]:col-start-2 [&>*:nth-child(7)]:col-end-3 [&>*:nth-child(7)]:row-start-4
        [&>*:nth-child(8)]:col-start-4 [&>*:nth-child(8)]:col-end-5 [&>*:nth-child(8)]:row-start-4
        [&>*:nth-child(9)]:col-start-3 [&>*:nth-child(9)]:col-end-4 [&>*:nth-child(9)]:row-start-5
      `;
    } else if (gameType === "10-ball") {
      return `
        grid-cols-5 gap-0.5 max-w-[240px]
        [&>*:nth-child(1)]:col-start-3 [&>*:nth-child(1)]:col-end-4 [&>*:nth-child(1)]:row-start-1
        [&>*:nth-child(2)]:col-start-2 [&>*:nth-child(2)]:col-end-3 [&>*:nth-child(2)]:row-start-2
        [&>*:nth-child(3)]:col-start-4 [&>*:nth-child(3)]:col-end-5 [&>*:nth-child(3)]:row-start-2
        [&>*:nth-child(4)]:col-start-1 [&>*:nth-child(4)]:col-end-2 [&>*:nth-child(4)]:row-start-3
        [&>*:nth-child(5)]:col-start-3 [&>*:nth-child(5)]:col-end-4 [&>*:nth-child(5)]:row-start-3
        [&>*:nth-child(6)]:col-start-5 [&>*:nth-child(6)]:col-end-6 [&>*:nth-child(6)]:row-start-3
        [&>*:nth-child(7)]:col-start-1 [&>*:nth-child(7)]:col-end-2 [&>*:nth-child(7)]:row-start-4
        [&>*:nth-child(8)]:col-start-2 [&>*:nth-child(8)]:col-end-3 [&>*:nth-child(8)]:row-start-4
        [&>*:nth-child(9)]:col-start-4 [&>*:nth-child(9)]:col-end-5 [&>*:nth-child(9)]:row-start-4
        [&>*:nth-child(10)]:col-start-5 [&>*:nth-child(10)]:col-end-6 [&>*:nth-child(10)]:row-start-4
      `;
    } else {
      return `
        grid-cols-5 gap-0.5 max-w-[240px]
        [&>*:nth-child(1)]:col-start-3 [&>*:nth-child(1)]:col-end-4 [&>*:nth-child(1)]:row-start-1
        [&>*:nth-child(2)]:col-start-2 [&>*:nth-child(2)]:col-end-3 [&>*:nth-child(2)]:row-start-2
        [&>*:nth-child(3)]:col-start-4 [&>*:nth-child(3)]:col-end-5 [&>*:nth-child(3)]:row-start-2
        [&>*:nth-child(4)]:col-start-1 [&>*:nth-child(4)]:col-end-2 [&>*:nth-child(4)]:row-start-3
        [&>*:nth-child(5)]:col-start-3 [&>*:nth-child(5)]:col-end-4 [&>*:nth-child(5)]:row-start-3
        [&>*:nth-child(6)]:col-start-5 [&>*:nth-child(6)]:col-end-6 [&>*:nth-child(6)]:row-start-3
        [&>*:nth-child(7)]:col-start-1 [&>*:nth-child(7)]:col-end-2 [&>*:nth-child(7)]:row-start-4
        [&>*:nth-child(8)]:col-start-2 [&>*:nth-child(8)]:col-end-3 [&>*:nth-child(8)]:row-start-4
        [&>*:nth-child(9)]:col-start-3 [&>*:nth-child(9)]:col-end-4 [&>*:nth-child(9)]:row-start-4
        [&>*:nth-child(10)]:col-start-4 [&>*:nth-child(10)]:col-end-5 [&>*:nth-child(10)]:row-start-4
        [&>*:nth-child(11)]:col-start-5 [&>*:nth-child(11)]:col-end-6 [&>*:nth-child(11)]:row-start-4
        [&>*:nth-child(12)]:col-start-1 [&>*:nth-child(12)]:col-end-2 [&>*:nth-child(12)]:row-start-5
        [&>*:nth-child(13)]:col-start-2 [&>*:nth-child(13)]:col-end-3 [&>*:nth-child(13)]:row-start-5
        [&>*:nth-child(14)]:col-start-3 [&>*:nth-child(14)]:col-end-4 [&>*:nth-child(14)]:row-start-5
        [&>*:nth-child(15)]:col-start-4 [&>*:nth-child(15)]:col-end-5 [&>*:nth-child(15)]:row-start-5
        [&>*:nth-child(15)]:col-start-5 [&>*:nth-child(15)]:col-end-6 [&>*:nth-child(15)]:row-start-5
      `;
    }
  };

  // Set rack image based on game type
  useEffect(() => {
    setRack([]);
  }, [gameType]);

  // Determine if a ball is striped
  const isStriped = (number: number) => number >= 9 && number <= 15;

  // UI for rendering a pool ball
  const PoolBall = ({ number }: { number: number }) => {
    const striped = isStriped(number);

    return (
      <div className={cn(
        "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-all",
        "border border-white/10 shadow-lg",
        "relative overflow-hidden",
        ballColors[number]
      )}>
        {striped && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white w-full h-1/3 absolute"></div>
          </div>
        )}
        <div className={cn(
          "z-10 flex items-center justify-center",
          striped ? "w-full h-full" : "w-6 h-6 md:w-7 md:h-7 bg-white rounded-full"
        )}>
          {number}
        </div>
      </div>
    );
  };

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
                "min-h-[280px] flex items-center justify-center p-6 rounded-lg",
                "glass border-2 border-white/10 hover:border-white/30 transition-all duration-300",
                "bg-green-950/30" // Pool table green tint
              )}>
                {rack.length > 0 ? (
                  <div className={cn(
                    "grid relative", 
                    getRackLayout(),
                    "animate-fade-in"
                  )}>
                    {rack.map((ball, index) => (
                      <PoolBall key={index} number={ball} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-deadpunch-gray-light">
                      Click "Generate Rack" to create a randomized rack layout
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-deadpunch-red/10 border border-deadpunch-red/30 rounded-lg p-3 text-sm text-deadpunch-gray-light">
                <p>
                  <strong className="text-white">Game Rules:</strong><br />
                  {gameType === "9-ball" && "Ball 1 (yellow) at the apex, ball 9 (striped yellow) in the center, others randomly placed in a diamond formation."}
                  {gameType === "10-ball" && "Ball 1 (yellow) at the apex, ball 10 (striped blue) in the center, others randomly placed in the triangle."}
                  {gameType === "8-ball" && "Ball 8 (black) in the center, with a mix of solids and stripes. One solid and one stripe must be placed at the back corners."}
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
