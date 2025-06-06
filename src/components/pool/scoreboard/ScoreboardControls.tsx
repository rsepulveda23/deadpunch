
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RaceToSelector } from '../race/RaceToSelector';

interface ScoreboardControlsProps {
  raceValue: number;
  onRaceValueChange: (value: number) => void;
  onResetScores: () => void;
  onResetAll: () => void;
}

export const ScoreboardControls = ({ 
  raceValue, 
  onRaceValueChange, 
  onResetScores, 
  onResetAll 
}: ScoreboardControlsProps) => {
  return (
    <>
      <div className="mt-6">
        <Separator className="bg-deadpunch-gray-dark mb-4" />
        <RaceToSelector value={raceValue} onChange={onRaceValueChange} />
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <Button 
          onClick={onResetScores}
          variant="outline"
          className="border-deadpunch-gray-dark text-white hover:border-deadpunch-red hover:text-white hover:bg-deadpunch-dark bg-deadpunch-dark-lighter"
        >
          Reset Scores
        </Button>
        <Button 
          onClick={onResetAll}
          variant="outline"
          className="border-deadpunch-red text-deadpunch-red hover:border-deadpunch-red hover:bg-deadpunch-red hover:text-white bg-deadpunch-dark-lighter"
        >
          Reset All
        </Button>
      </div>
    </>
  );
};
