
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface RaceToSelectorProps {
  value: number;
  onChange: (newValue: number) => void;
}

/**
 * RaceToSelector Component
 * 
 * Allows users to adjust the "Race To" value, which is the target score
 * needed to win the game.
 */
export const RaceToSelector = ({ value, onChange }: RaceToSelectorProps) => {
  const { themeMode } = useTheme();
  
  return (
    <div className="text-center">
      <Label htmlFor="raceValue" className="text-lg font-semibold block mb-2">Race To</Label>
      
      <div className="flex items-center justify-center">
        <div className="flex-1 flex justify-end">
          <Button 
            size="icon" 
            variant="outline"
            onClick={() => onChange(Math.max(1, value - 1))}
            className={cn(
              "hover:border-white/50",
              themeMode === 'day' ? "hover:bg-slate-200/50" : "hover:bg-deadpunch-dark/50"
            )}
          >
            <Minus size={16} />
          </Button>
        </div>
        
        <div className={cn(
          "mx-3 text-4xl font-display font-bold",
          themeMode === 'day' 
            ? "text-blue-600 drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]" 
            : "text-[#39FF14] drop-shadow-[0_0_8px_rgba(57,255,20,0.7)]" 
        )}>
          {value}
        </div>
        
        <div className="flex-1 flex justify-start">
          <Button 
            size="icon"
            onClick={() => onChange(value + 1)}
            className={cn(
              themeMode === 'day' ? "bg-blue-500 hover:bg-blue-600" : "bg-deadpunch-red hover:bg-deadpunch-red-hover"
            )}
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
