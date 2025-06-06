
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

interface RaceToSelectorProps {
  value: number;
  onChange: (newValue: number) => void;
}

export const RaceToSelector = ({ value, onChange }: RaceToSelectorProps) => {
  return (
    <div className="text-center">
      <Label htmlFor="raceValue" className="text-lg font-semibold block mb-2 text-white">Race To</Label>
      
      <div className="flex items-center justify-center">
        <div className="flex-1 flex justify-end">
          <Button 
            size="icon" 
            variant="outline"
            onClick={() => onChange(Math.max(1, value - 1))}
            className="border-deadpunch-gray-dark text-white hover:border-deadpunch-red hover:text-white hover:bg-deadpunch-dark bg-deadpunch-dark-lighter"
          >
            <Minus size={16} />
          </Button>
        </div>
        
        <div className="mx-3 text-4xl font-display font-bold text-deadpunch-red drop-shadow-[0_0_8px_rgba(225,60,60,0.7)]">
          {value}
        </div>
        
        <div className="flex-1 flex justify-start">
          <Button 
            size="icon"
            onClick={() => onChange(value + 1)}
            className="bg-deadpunch-red hover:bg-deadpunch-red-hover text-white"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
