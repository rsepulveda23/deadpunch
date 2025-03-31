
import { GameType } from './GameTypeSelector';

export const generateRack = (gameType: GameType): number[] => {
  if (gameType === "9-ball") {
    // In 9-ball, the specific positions are:
    // 1 at the front (apex)
    // 9 in the middle
    // The rest (2-8) are placed randomly around these fixed positions
    
    const remainingBalls = [2, 3, 4, 5, 6, 7, 8];
    // Shuffle the remaining balls for randomization
    const shuffledBalls = remainingBalls.sort(() => Math.random() - 0.5);
    
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
    // 10 in the center
    // Remaining balls (2-9) placed randomly
    
    const availableBalls = [2, 3, 4, 5, 6, 7, 8, 9];
    // Shuffle the available balls for randomization
    const shuffledBalls = availableBalls.sort(() => Math.random() - 0.5);
    
    // Create the rack with fixed positions (1 at apex, 10 in center)
    const finalRack = [
      1,                  // Apex
      shuffledBalls[0],   // Second row - left
      shuffledBalls[1],   // Second row - right
      shuffledBalls[2],   // Third row - left
      10,                 // Third row - middle (ALWAYS ball 10)
      shuffledBalls[3],   // Third row - right
      shuffledBalls[4],   // Third row - right
      shuffledBalls[5],   // Fourth row - left
      shuffledBalls[6],   // Fourth row - middle-left
      shuffledBalls[7],   // Fourth row - middle-right/right
    ];
    
    return finalRack;
    
  } else if (gameType === "8-ball") {
    // In 8-ball:
    // Random ball at the apex (but traditionally a solid)
    // 8-ball in the center
    // A mix of solids (1-7) and stripes (9-15)
    // One solid and one stripe must be at the back corners
    
    const solids = [1, 2, 3, 4, 5, 6, 7];
    const stripes = [9, 10, 11, 12, 13, 14, 15];
    
    // Shuffle the solids and stripes arrays
    const shuffledSolids = [...solids].sort(() => Math.random() - 0.5);
    const shuffledStripes = [...stripes].sort(() => Math.random() - 0.5);
    
    // Take one solid for the apex (traditional, though sometimes players use any ball)
    const apexBall = shuffledSolids.pop()!;
    
    // One solid and one stripe must be at the back corners (positions 13 and 17)
    const cornerSolid = shuffledSolids.pop()!;
    const cornerStripe = shuffledStripes.pop()!;
    
    // Combine and shuffle the remaining balls
    const remainingBalls = [...shuffledSolids, ...shuffledStripes].sort(() => Math.random() - 0.5);
    
    // Create the full rack with the fixed positions (5 rows triangle)
    const finalRack = [
      apexBall,           // Front (apex)
      remainingBalls[0],  // Second row - left
      8,                  // Second row - middle (ALWAYS 8 ball in 2nd row middle for proper triangle)
      remainingBalls[1],  // Second row - right
      remainingBalls[2],  // Third row - left
      remainingBalls[3],  // Third row - middle
      remainingBalls[4],  // Third row - right
      remainingBalls[5],  // Fourth row - left
      remainingBalls[6],  // Fourth row - middle-left
      remainingBalls[7],  // Fourth row - middle-right
      remainingBalls[8],  // Fourth row - right
      remainingBalls[9],  // Fourth row - far right
      cornerSolid,        // Fifth row - left
      remainingBalls[10], // Fifth row - left-center
      remainingBalls[11], // Fifth row - middle
      remainingBalls[12], // Fifth row - right-center
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
    return "Ball 1 (yellow) at the apex, ball 10 (striped blue) in the center, others randomly placed in the triangle.";
  } else {
    return "Ball 8 (black) in the center of the second row, with a mix of solids and stripes. One solid and one stripe must be placed at the back corners.";
  }
};
