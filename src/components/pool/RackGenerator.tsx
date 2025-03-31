import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { PoolBall } from './PoolBall';

type GameType = "9-ball" | "10-ball" | "8-ball";

export const RackGenerator = () => {
  const [gameType, setGameType] = useState<GameType>("9-ball");
  const [rack, setRack] = useState<number[]>([]);
  
  // Reset rack when game type changes
  useEffect(() => {
    setRack([]);
  }, [gameType]);

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
        remainingBalls[0],     // Front (apex) - can be any ball, but typically 1
        remainingBalls[1],     // Second row - left
        remainingBalls[2],     // Second row - right
        remainingBalls[3],     // Third row - left
        8,                     // Third row - middle (ALWAYS 8 ball)
        remainingBalls[4],     // Third row - right
        remainingBalls[5],     // Fourth row - left
        remainingBalls[6],     // Fourth row - middle-left
        remainingBalls[7],     // Fourth row - middle-right
        remainingBalls[8],     // Fourth row - right
        remainingBalls[9],     // Fifth row - left
        remainingBalls[10],    // Fifth row - middle-left
        remainingBalls[11],    // Fifth row - middle
        remainingBalls[12],    // Fifth row - middle-right
        firstCorner,           // Fifth row - right corner (solid or stripe)
      ];
      
      setRack(finalRack);
    }
  };

  // Get the rack layout based on game type
  const getRackLayout = () => {
    if (gameType === "9-ball") {
      return `
        grid-cols-5 gap-[-15px] max-w-[120px] 
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
        grid-cols-5 gap-[-15px] max-w-[120px]
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
        grid-cols-5 gap-[-15px] max-w-[120px]
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

  return (
    <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark hover:border-white/30 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl text-deadpunch-red">Rack Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Game Type</Label>
          <RadioGroup 
            value={gameType} 
            onValueChange={(value) => setGameType(value as GameType)}
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
  );
};
