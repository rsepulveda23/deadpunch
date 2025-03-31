
import { GameType } from './GameTypeSelector';

/**
 * Generates a randomized rack of pool balls based on game type
 * 
 * @param gameType - The type of pool game (8-ball, 9-ball, or 10-ball)
 * @returns An array of ball numbers in their rack positions
 */
export const generateRack = (gameType: GameType): number[] => {
  let balls: number[] = [];
  let availableBalls: number[] = [];

  // Define available balls and rack size based on game type
  if (gameType === "9-ball") {
    availableBalls = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  } else if (gameType === "10-ball") {
    availableBalls = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  } else { // 8-ball
    // For 8-ball, we use all 15 balls
    availableBalls = Array.from({ length: 15 }, (_, i) => i + 1);
  }

  // Handle special ball requirements for different game types
  if (gameType === "9-ball") {
    // In 9-ball, the 1 ball must be at the apex (front) and 9 ball in the center
    const oneIndex = availableBalls.indexOf(1);
    availableBalls.splice(oneIndex, 1);
    
    const nineIndex = availableBalls.indexOf(9);
    availableBalls.splice(nineIndex, 1);
    
    balls.push(1); // 1 ball at the apex
    
    // Randomize remaining balls
    shuffleArray(availableBalls);
    
    // Insert 9 ball in the center (position 4 in a 9-ball rack)
    const centerPosition = 4;
    balls = [
      ...balls,
      ...availableBalls.slice(0, centerPosition),
      9,
      ...availableBalls.slice(centerPosition)
    ];
  } else if (gameType === "10-ball") {
    // In 10-ball, the 1 ball must be at the apex (front) and 10 ball in the center
    const oneIndex = availableBalls.indexOf(1);
    availableBalls.splice(oneIndex, 1);
    
    const tenIndex = availableBalls.indexOf(10);
    availableBalls.splice(tenIndex, 1);
    
    balls.push(1); // 1 ball at the apex
    
    // Randomize remaining balls
    shuffleArray(availableBalls);
    
    // Insert 10 ball in the center (position 4 in a 10-ball rack)
    const centerPosition = 4;
    balls = [
      ...balls,
      ...availableBalls.slice(0, centerPosition),
      10,
      ...availableBalls.slice(centerPosition)
    ];
  } else { // 8-ball
    // In 8-ball, the 8 ball must be in the center
    const eightIndex = availableBalls.indexOf(8);
    availableBalls.splice(eightIndex, 1);
    
    // Randomize remaining balls
    shuffleArray(availableBalls);
    
    // Create outer rack with random balls
    const outerRack = availableBalls;
    
    // Insert 8 ball in the center (position 4 in the 3rd row)
    const firstRowCount = 1;
    const secondRowCount = 2;
    const thirdRowCount = 3;
    const centerPosition = firstRowCount + secondRowCount + Math.floor(thirdRowCount / 2);
    
    balls = [
      ...outerRack.slice(0, centerPosition),
      8,
      ...outerRack.slice(centerPosition)
    ];
  }

  return balls;
};

/**
 * Gets rule information for a specific pool game type
 * 
 * @param gameType - The type of pool game (8-ball, 9-ball, or 10-ball) 
 * @returns A string containing the rules description
 */
export const getGameRules = (gameType: GameType): string => {
  if (gameType === "9-ball") {
    return "Target the lowest numbered ball first. Pocketing the 9-ball at any legal time wins the game. Diamond formation with 1-ball at the apex.";
  } else if (gameType === "10-ball") {
    return "Call pocket and call safety rules. The 10-ball must be pocketed in the called pocket. Triangle formation with 1-ball at the apex.";
  } else { // 8-ball
    return "Rack consists of 7 solid, 7 striped, and the 8-ball. The 8-ball must be pocketed in the called pocket after clearing your group.";
  }
};

/**
 * Fisher-Yates shuffle algorithm for randomizing arrays in-place
 * 
 * @param array - The array to be shuffled
 */
const shuffleArray = (array: number[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
