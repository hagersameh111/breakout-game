// levels.js
import { paddle, bricks, createBricks } from "./objects.js";

export const LEVELS = [
  { id: "L1", name: "Level 1 (Easy)", brickCount: 20, rows: 4, cols: 7,  brickW: 60, brickH: 20, pad: 6, top: 60, paddleW: 105 },
  { id: "L2", name: "Level 2 (Normal)", brickCount: 35, rows: 5, cols: 9,  brickW: 58, brickH: 20, pad: 6, top: 60, paddleW: 92 },
  { id: "L3", name: "Level 3 (Hard)", brickCount: 50, rows: 6, cols: 10, brickW: 56, brickH: 20, pad: 5, top: 50, paddleW: 80 }
];

let currentLevelIndex = 0;

export function getCurrentLevelName() {
  return LEVELS[currentLevelIndex].name;
}
export function getCurrentLevelNumber() {
  return currentLevelIndex + 1;
}

export function allBricksCleared() {
  return bricks.length > 0 && bricks.every(b => b.destroyed);
}

export function loadLevelByIndex(index, canvas, ctx) {
  currentLevelIndex = Math.max(0, Math.min(index, LEVELS.length - 1));
  const lvl = LEVELS[currentLevelIndex];

  // Generate shape-based layout for current level
  createBricks(ctx, lvl.id);

  // Place paddle
  paddle.width = lvl.paddleW;
  paddle.height = 12;
  paddle.x = (canvas.width - paddle.width)/2;
  paddle.y = canvas.height - 30;

  return lvl;
}

export function nextLevel(canvas, ctx) {
  if (currentLevelIndex + 1 < LEVELS.length) {
    currentLevelIndex += 1;
    const lvl = loadLevelByIndex(currentLevelIndex, canvas, ctx);
    alert(`${lvl.name} starting!`); // notify between levels
    return lvl;
  }
  return null; // finished last level
}

export function resetLevels(canvas, ctx) {
  currentLevelIndex = 0;
  return loadLevelByIndex(0, canvas, ctx);
}