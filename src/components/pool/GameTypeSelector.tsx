
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type GameType = "9-ball" | "10-ball" | "8-ball";

interface GameTypeSelectorProps {
  gameType: GameType;
  onChange: (value: GameType) => void;
}

export const GameTypeSelector = ({ gameType, onChange }: GameTypeSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label>Game Type</Label>
      <RadioGroup 
        value={gameType} 
        onValueChange={(value) => onChange(value as GameType)}
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
  );
};
