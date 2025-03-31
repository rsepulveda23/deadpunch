
import { GameType } from './GameTypeSelector';

// Helper function to shuffle array using Fisher-Yates algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const generateRack = (gameType: GameType): number[] => {
  if (gameType === "9-ball") {
    // In 9-ball, the specific positions are:
    // 1 at the front (apex)
    // 9 in the middle
    // The rest (2-8) are placed randomly around these fixed positions
    
    const remainingBalls = [2, 3, 4, 5, 6, 7, 8];
    // Shuffle the remaining balls for randomization
    const shuffledBalls = shuffleArray(remainingBalls);
    
    // Create the rack with the fixed positions (1 at apex, 9 in middle)
    const finalRack = [
      1,  // Top of the diamond - first ball (always 1)
      shuffledBalls[0],  // Second row - left
      shuffledBalls[1],  // Second row - right
      shuffledBalls[2],  // Third row - left
      9,  // Third row - middle (ALWAYS ball 9)
      shuffledBalls[3],  // Third row - right
      shuffledBalls[4],  // Fourth row - left
      shuffledBalls[5],  // Fourth row - right
      shuffledBalls[6]   // Fifth row - bottom
    ];
    
    return finalRack;
    
  } else if (gameType === "10-ball") {
    // In 10-ball:
    // 1 at the front (apex)
    // 10 in the center (middle of third row)
    // Remaining balls (2-9) placed randomly
    
    const availableBalls = [2, 3, 4, 5, 6, 7, 8, 9];
    // Shuffle the available balls for randomization
    const shuffledBalls = shuffleArray(availableBalls);
    
    // Create the rack with fixed positions (1 at apex, 10 in center of third row)
    const finalRack = [
      1,                  // First row (apex)
      shuffledBalls[0],   // Second row - left
      shuffledBalls[1],   // Second row - right
      shuffledBalls[2],   // Third row - left
      10,                 // Third row - middle (ALWAYS ball 10)
      shuffledBalls[3],   // Third row - right
      shuffledBalls[4],   // Fourth row - left
      shuffledBalls[5],   // Fourth row - middle-left
      shuffledBalls[6],   // Fourth row - middle-right
      shuffledBalls[7],   // Fourth row - right
    ];
    
    return finalRack;
    
  } else if (gameType === "8-ball") {
    // In 8-ball:
    // Ball 1 (yellow) must be at the apex according to standard rules
    // 8-ball must be in the center of the third row
    // A mix of solids (1-7) and stripes (9-15)
    // One solid and one stripe must be at the back corners
    
    // For solids, we exclude 1 (apex) and 8 (center)
    const solids = [2, 3, 4, 5, 6, 7];
    const stripes = [9, 10, 11, 12, 13, 14, 15];
    
    // Shuffle the solids and stripes arrays
    const shuffledSolids = shuffleArray(solids);
    const shuffledStripes = shuffleArray(stripes);
    
    // One solid and one stripe must be at the back corners (positions 11 and 15)
    const cornerSolid = shuffledSolids.shift()!;
    const cornerStripe = shuffledStripes.shift()!;
    
    // Combine and shuffle the remaining balls
    const remainingBalls = shuffleArray([...shuffledSolids, ...shuffledStripes]);
    
    // Create the full rack with the fixed positions (5 rows triangle)
    const finalRack = [
      1,                  // First row (apex) - ALWAYS ball 1 (yellow)
      remainingBalls[0],  // Second row - left
      remainingBalls[1],  // Second row - right
      remainingBalls[2],  // Third row - left
      8,                  // Third row - middle (ALWAYS 8 ball)
      remainingBalls[3],  // Third row - right
      remainingBalls[4],  // Fourth row - left
      remainingBalls[5],  // Fourth row - middle-left
      remainingBalls[6],  // Fourth row - middle-right
      remainingBalls[7],  // Fourth row - right
      cornerSolid,        // Fifth row - left
      remainingBalls[8],  // Fifth row - left-center
      remainingBalls[9],  // Fifth row - middle
      remainingBalls[10], // Fifth row - right-center
      cornerStripe,       // Fifth row - right
    ];
    
    return finalRack;
  }
  
  return [];
};

export const getGameRules = (gameType: GameType): string => {
  if (gameType === "9-ball") {
    return "Ball 1 (yellow) at the apex, ball 9 (striped yellow) in the center, others randomly placed in a diamond formation.";
  } else if (gameType === "10-ball") {
    return "Ball 1 (yellow) at the apex, ball 10 (striped blue) in the center of the third row with a proper triangle formation: 1 ball in first row, 2 in second, 3 in third, and 4 in the fourth row.";
  } else {
    return "A proper triangle with 5 rows: Ball 1 (yellow) always at the apex, the 8-ball (black) in the center of the third row, with a mix of solids and stripes. One solid and one stripe must be placed at the back corners.";
  }
};
