
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Player {
  name: string;
  score: number;
}

interface PlayerNameInputsProps {
  player1: Player;
  player2: Player;
  onNameChange: (player: "player1" | "player2", name: string) => void;
  onInputFocus: (player: "player1" | "player2") => void;
}

export const PlayerNameInputs = ({ 
  player1, 
  player2, 
  onNameChange, 
  onInputFocus 
}: PlayerNameInputsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="player1Name" className="text-white font-medium">Player 1</Label>
        <Input
          id="player1Name"
          value={player1.name}
          onChange={(e) => onNameChange("player1", e.target.value)}
          onFocus={() => onInputFocus("player1")}
          onClick={() => onInputFocus("player1")}
          className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white focus:border-deadpunch-red focus:ring-deadpunch-red placeholder:text-deadpunch-gray-light/60"
          placeholder="Enter name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="player2Name" className="text-white font-medium">Player 2</Label>
        <Input
          id="player2Name"
          value={player2.name}
          onChange={(e) => onNameChange("player2", e.target.value)}
          onFocus={() => onInputFocus("player2")}
          onClick={() => onInputFocus("player2")}
          className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white focus:border-deadpunch-red focus:ring-deadpunch-red placeholder:text-deadpunch-gray-light/60"
          placeholder="Enter name"
        />
      </div>
    </div>
  );
};
