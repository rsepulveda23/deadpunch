
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { GameTypeSelector, GameType } from './GameTypeSelector';
import { RackDisplay } from './RackDisplay';
import { generateRack, getGameRules } from './rackGeneratorUtils';

export const RackGenerator = () => {
  const [gameType, setGameType] = useState<GameType>("9-ball");
  const [rack, setRack] = useState<number[]>([]);
  
  useEffect(() => {
    generateRackLayout();
  }, [gameType]);

  const generateRackLayout = () => {
    const newRack = generateRack(gameType);
    setRack(newRack);
  };

  return (
    <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark hover:border-white/30 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl text-deadpunch-red">Rack Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <GameTypeSelector 
          gameType={gameType} 
          onChange={setGameType} 
        />

        <Button 
          onClick={generateRackLayout} 
          className="w-full bg-deadpunch-red hover:bg-deadpunch-red-hover group"
        >
          <RefreshCw size={18} className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
          Generate Rack
        </Button>

        <RackDisplay gameType={gameType} rack={rack} />

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
