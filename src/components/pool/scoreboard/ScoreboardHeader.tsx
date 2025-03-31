
import { CardHeader, CardTitle } from "@/components/ui/card";

/**
 * ScoreboardHeader Component
 * 
 * Displays the title of the scoreboard with styling consistent with the application theme.
 */
export const ScoreboardHeader = () => {
  return (
    <CardHeader>
      <CardTitle className="text-2xl flex items-center">
        <span className="text-deadpunch-red mr-2">Scoreboard</span>
        <span className="text-sm bg-deadpunch-red/20 text-deadpunch-red px-2 py-1 rounded-full ml-auto">
          Pool
        </span>
      </CardTitle>
    </CardHeader>
  );
};
