
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
    const availableBalls = [2, 3, 4, 5, 6, 7, 8, 9];
    
    // Shuffle the available balls for randomization
    const shuffledBalls = availableBalls.sort(() => Math.random() - 0.5);
    
    const finalRack = [
      1,                    // Top of the diamond - first ball
      shuffledBalls[0],     // Second row - left
      shuffledBalls[1],     // Second row - right
      shuffledBalls[2],     // Third row - left
      10,                   // Third row - middle (ALWAYS ball 10)
      shuffledBalls[3],     // Third row - right
      shuffledBalls[4],     // Fourth row - left
      shuffledBalls[5],     // Fourth row - middle-left
      shuffledBalls[6],     // Fourth row - middle-right
      shuffledBalls[7]      // Fourth row - right
    ];
    
    return finalRack;
    
  } else if (gameType === "8-ball") {
    const solids = [1, 2, 3, 4, 5, 6, 7];
    const stripes = [9, 10, 11, 12, 13, 14, 15];
    
    // Shuffle the solids and stripes arrays
    const shuffledSolids = [...solids].sort(() => Math.random() - 0.5);
    const shuffledStripes = [...stripes].sort(() => Math.random() - 0.5);
    
    // First corner should be either a solid or stripe (random)
    const firstCorner = Math.random() > 0.5 ? shuffledSolids.pop()! : shuffledStripes.pop()!;
    // Second corner should be the opposite type of the first corner
    const secondCorner = firstCorner <= 8 ? shuffledStripes.pop()! : shuffledSolids.pop()!;
    
    // Combine and shuffle the remaining balls
    const remainingBalls = [...shuffledSolids, ...shuffledStripes].sort(() => Math.random() - 0.5);
    
    const finalRack = [
      remainingBalls[0],     // Front (apex) - can be any ball except 8
      remainingBalls[1],     // Second row - left
      remainingBalls[2],     // Second row - right
      remainingBalls[3],     // Third row - left
      8,                     // Third row - middle (ALWAYS 8 ball)
      remainingBalls[4],     // Third row - right
      remainingBalls[5],     // Fourth row - left
      remainingBalls[6],     // Fourth row - middle-left
      remainingBalls[7],     // Fourth row - middle-right
      remainingBalls[8],     // Fourth row - right
      remainingBalls[9],     // Fifth row - left
      remainingBalls[10],    // Fifth row - middle-left
      firstCorner,           // Fifth row - middle
      secondCorner,          // Fifth row - middle-right
      remainingBalls[11],    // Fifth row - right
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
    return "Ball 8 (black) in the center, with a mix of solids and stripes. One solid and one stripe must be placed at the back corners.";
  }
};
