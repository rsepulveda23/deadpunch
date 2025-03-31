
import { GameType } from './GameTypeSelector';

export const generateRack = (gameType: GameType): number[] => {
  if (gameType === "9-ball") {
    // In 9-ball, the specific positions are:
    // 1 at the front (apex)
    // 9 in the middle
    // The rest (2-8) are placed in specific positions according to the rules
    
    const finalRack = [
      1,  // Top of the diamond - first ball (always 1)
      2,  // Second row - left (blue)
      3,  // Second row - right (red)
      4,  // Third row - left (purple)
      9,  // Third row - middle (ALWAYS ball 9)
      5,  // Third row - right (orange)
      6,  // Fourth row - left (green)
      7,  // Fourth row - right (maroon)
      8   // Fifth row - bottom (black)
    ];
    
    return finalRack;
    
  } else if (gameType === "10-ball") {
    const availableBalls = [2, 3, 4, 5, 6, 7, 8, 9];
    
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
    
    const shuffledSolids = [...solids].sort(() => Math.random() - 0.5);
    const shuffledStripes = [...stripes].sort(() => Math.random() - 0.5);
    
    const firstCorner = Math.random() > 0.5 ? shuffledSolids.pop()! : shuffledStripes.pop()!;
    const secondCorner = firstCorner <= 8 ? shuffledStripes.pop()! : shuffledSolids.pop()!;
    
    const remainingBalls = [...shuffledSolids, ...shuffledStripes].sort(() => Math.random() - 0.5);
    
    const finalRack = [
      remainingBalls[0],     // Front (apex) - can be any ball, but typically 1
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
      remainingBalls[11],    // Fifth row - middle
      remainingBalls[12],    // Fifth row - middle-right
      firstCorner,           // Fifth row - right corner (solid or stripe)
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
