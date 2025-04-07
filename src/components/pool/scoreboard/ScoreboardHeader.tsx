
import { CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * ScoreboardHeader Component
 * 
 * Displays the title of the scoreboard with styling consistent with the application theme.
 */
export const ScoreboardHeader = () => {
  return (
    <CardHeader>
      <CardTitle className="text-2xl flex items-center">
        <span className="text-deadpunch-red">Scoreboard</span>
        <span className="text-sm px-2 py-1 rounded-full ml-auto bg-deadpunch-red/20 text-deadpunch-red">
          Pool
        </span>
      </CardTitle>
    </CardHeader>
  );
};
