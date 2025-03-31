
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { GameTypeSelector, GameType } from './GameTypeSelector';
import { RackDisplay } from './RackDisplay';
import { generateRack, getGameRules } from './rackGeneratorUtils';

/**
 * RackGenerator Component
 * 
 * A tool for generating randomized rack layouts for different pool games.
 * Allows users to select game type (8-ball, 9-ball, 10-ball) and generate
 * valid rack configurations that follow tournament rack rules.
 */
export const RackGenerator = () => {
  // State for the current game type and rack configuration
  const [gameType, setGameType] = useState<GameType>("9-ball");
  const [rack, setRack] = useState<number[]>([]);
  const [key, setKey] = useState(0); // Key to force re-render of the rack display
  
  // Generate a new rack layout when the game type changes
  useEffect(() => {
    generateRackLayout();
  }, [gameType]);

  /**
   * Generates a new randomized rack layout based on the selected game type
   * This ensures different balls are placed in different positions each time
   * while respecting the rules for each game type.
   */
  const generateRackLayout = () => {
    const newRack = generateRack(gameType);
    setRack(newRack);
    setKey(prevKey => prevKey + 1); // Increment key to force re-render
  };

  return (
    <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark hover:border-white/30 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl text-deadpunch-red">Rack Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Game type selection */}
        <GameTypeSelector 
          gameType={gameType} 
          onChange={setGameType} 
        />

        {/* Generate button */}
        <Button 
          onClick={generateRackLayout} 
          className="w-full bg-deadpunch-red hover:bg-deadpunch-red-hover group"
        >
          <RefreshCw size={18} className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
          Generate Rack
        </Button>

        {/* Rack visualization */}
        <RackDisplay key={key} gameType={gameType} rack={rack} />

        {/* Game rules information */}
        <div className="bg-deadpunch-red/10 border border-deadpunch-red/30 rounded-lg p-3 text-sm text-deadpunch-gray-light">
          <p>
            <strong className="text-white">Game Rules:</strong><br />
            {getGameRules(gameType)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
