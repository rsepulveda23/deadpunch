
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

/**
 * Available pool game types
 */
export type GameType = "9-ball" | "10-ball" | "8-ball";

interface GameTypeSelectorProps {
  /** Currently selected game type */
  gameType: GameType;
  /** Handler for when a different game type is selected */
  onChange: (value: GameType) => void;
}

/**
 * GameTypeSelector Component
 * 
 * A radio button group for selecting between different pool game types
 * (9-ball, 10-ball, or 8-ball).
 */
export const GameTypeSelector = ({ gameType, onChange }: GameTypeSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-white">Game Type</Label>
      <RadioGroup 
        value={gameType} 
        onValueChange={(value) => onChange(value as GameType)}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem 
            value="9-ball" 
            id="r1" 
            className="border-deadpunch-gray-dark text-deadpunch-red"
          />
          <Label htmlFor="r1" className="text-white">9-Ball</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem 
            value="10-ball" 
            id="r2" 
            className="border-deadpunch-gray-dark text-deadpunch-red"
          />
          <Label htmlFor="r2" className="text-white">10-Ball</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem 
            value="8-ball" 
            id="r3" 
            className="border-deadpunch-gray-dark text-deadpunch-red"
          />
          <Label htmlFor="r3" className="text-white">8-Ball</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
