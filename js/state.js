import { createBricks, ball, paddle } from "./objects.js";
import { sounds, playSound } from "./sound.js";
import { lvlI } from "../main.js";
import { gameState } from "./gameState.js";

const topScoreEl = document.getElementById('topScore');
const scoreEl = document.getElementById('score');
// Game Configuration
const config = {
  pointsPerBrick: 10,
  startingLives: 3,
  localStorageKey: 'breakout-game'
};
// Game State
const state = {
  score: 0,
  lives: config.startingLives,
  topScore: localStorage.getItem(config.localStorageKey)

}

// Preload heart image once
const heartImg = new Image();
heartImg.src = "https://img.icons8.com/fluency/24/pixel-heart.png";

//Draw remaining lives as heart icons in the HUD.
export function drawLives(ctx, canvas) {
  const heartSize = canvas.width * 0.03;   // scale with width (3%)
  const marginRight = canvas.width * 0.1; // margin from right edge
  const topOffset = canvas.height * 0.04;  // margin from top
  const padding = canvas.width * 0.002;    // scale spacing (0.3%)


  for (let i = 0; i < state.lives; i++) {
    const x =
      canvas.width -
      marginRight -
      (i + 1) * heartSize - i * padding; // place each heart to the left of the previous one
    const y = topOffset;
    ctx.drawImage(heartImg, x, y, heartSize, heartSize);
  }
}

// Score Handling
function saveTopScore() {
  localStorage.setItem(config.localStorageKey, state.topScore);
}

function loadTopScore() {
  topScoreEl.textContent = localStorage.getItem(config.localStorageKey);
}
// State Reset
function resetState(ctx) {
  state.score = 0;
  state.lives = config.startingLives;
  state.topScore = localStorage.getItem(config.localStorageKey) || 0;
  updateState();
  // Rebuild bricks for current level
  createBricks(ctx, lvlI.id);
  // Reset ball position to paddle
  ball.x = paddle.x + paddle.width / 2;
  ball.y = paddle.y - ball.radius;
  ball.dx = ball.speed;
  ball.dy = -ball.speed;
  ball.onPaddle = true;
}

function updateState() {
  scoreEl.textContent = state.score;

  if (state.score > state.topScore) {
    state.topScore = state.score;
    saveTopScore();
    topScoreEl.textContent = state.topScore;
  }
}
// Modal Handling (Game Over / Win)
function openModal(message, scoreLine = "") {
  document.getElementById("scoreLine").textContent = scoreLine;
  document.getElementById("modalMessage").textContent = message;
  document.getElementById("gameModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("gameModal").style.display = "none";
}
// Life & Game Over Handling
function loseLife(ctx) {
  state.lives -= 1;
  updateState();
  playSound(sounds.loseLife);

  if (state.lives <= 0) {
    const playerName = localStorage.getItem("playerName") || "Player";
    // show score from state object from calling state 
    openModal(`Game Over ${playerName} 💀 — Better luck next time!`, `Your score: ${state.score}`);

    playSound(sounds.gameOver);
    resetState(ctx);
    gameState.started = false;
  }
}
// Win Condition Handling
function winGame(ctx) {
  // show win modal with score and name from loclal storage 
  const playerName = localStorage.getItem("playerName") || "Player";
  // show score from state object from line 15 
  openModal(`Awesome, ${playerName}! 🎉 You Won!`, `Your score: ${state.score}`);

  resetState(ctx);
  gameState.started = false;
}

// Pause / Resume Controls
export let gamePaused = false;

export function pauseGame() {
  gamePaused = true;
}

export function resumeGame() {
  gamePaused = false;
}



export { config, state, updateState, loadTopScore, saveTopScore, loseLife, winGame }