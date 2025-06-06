
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
      <Label className="text-white font-medium">Game Type</Label>
      <RadioGroup 
        value={gameType} 
        onValueChange={(value) => onChange(value as GameType)}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem 
            value="9-ball" 
            id="r1" 
            className="border-deadpunch-gray-dark text-deadpunch-red data-[state=checked]:bg-deadpunch-red data-[state=checked]:border-deadpunch-red"
          />
          <Label htmlFor="r1" className="text-white">9-Ball</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem 
            value="10-ball" 
            id="r2" 
            className="border-deadpunch-gray-dark text-deadpunch-red data-[state=checked]:bg-deadpunch-red data-[state=checked]:border-deadpunch-red"
          />
          <Label htmlFor="r2" className="text-white">10-Ball</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem 
            value="8-ball" 
            id="r3" 
            className="border-deadpunch-gray-dark text-deadpunch-red data-[state=checked]:bg-deadpunch-red data-[state=checked]:border-deadpunch-red"
          />
          <Label htmlFor="r3" className="text-white">8-Ball</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
