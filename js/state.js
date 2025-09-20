import { createBricks , ball , paddle} from "./objects.js"; 
import { sounds, playSound } from "./sound.js";
import { lvlI } from "../main.js";
import { gameState } from "./gameState.js";

const topScoreEl = document.getElementById('topScore');
const scoreEl = document.getElementById('score');

const config = {
    pointsPerBrick: 10,
    startingLives: 3,
    localStorageKey: 'breakout-game'
};

const state = {
    score: 0,
    lives: config.startingLives,
    topScore: localStorage.getItem(config.localStorageKey)

}

// Draw remaining lives as hearts
// Preload heart image once
const heartImg = new Image();
heartImg.src = "https://img.icons8.com/fluency/24/pixel-heart.png";

// Draw remaining lives as hearts
export function drawLives(ctx, canvas) {
  const heartSize = canvas.width * 0.04;   // scale with width (3%)
  const padding = canvas.width * 0.005;    // scale spacing (0.5%)
  const topOffset = canvas.height * 0.04;  //  from top

  for (let i = 0; i < state.lives; i++) {
    const x = canvas.width - (i + 1) * (heartSize + padding) - 20;
    const y = topOffset;
    ctx.drawImage(heartImg, x, y, heartSize, heartSize);
  }
}


function saveTopScore() {
    localStorage.setItem(config.localStorageKey, state.topScore);
}

function loadTopScore() {
    topScoreEl.textContent = localStorage.getItem(config.localStorageKey);
}

function resetState(ctx) {
    state.score = 0;
    state.lives = config.startingLives;
    state.topScore = localStorage.getItem(config.localStorageKey) || 0;
    updateState();
    
    createBricks(ctx,lvlI.id);

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

function openModal(message) {
  document.getElementById("modalMessage").textContent = message;
  document.getElementById("gameModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("gameModal").style.display = "none";
}

function loseLife(ctx) {
  state.lives -= 1;
  updateState();
  playSound(sounds.loseLife);

  if (state.lives <= 0) {
    openModal(" Game Over 💀 ");
    playSound(sounds.gameOver);
    resetState(ctx);
    gameState.started = false;
  }
}

function winGame(ctx) {
    openModal("You Won! 🎉 ");
    resetState(ctx);
    gameState.started = false;
}

export { config, state, updateState, loadTopScore, saveTopScore, loseLife , winGame}