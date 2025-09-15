import { createBricks } from "./objects.js"; 
import { sounds, playSound } from "./sound.js";

const topScoreEl = document.getElementById('topScore');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');

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
export function drawLives(ctx, canvas) {
  ctx.font = "25px Arial";       
  ctx.fillStyle = "red";      
  ctx.textAlign = "right";
  ctx.textBaseline = "top";

// Draw hearts for lives
  let hearts = "";
  for (let i = 0; i < state.lives; i++) {
    hearts += "❤️";
  }

  ctx.fillText(hearts, canvas.width - 10, 10);
}

function saveTopScore() {
    localStorage.setItem(config.localStorageKey, state.topScore);

}

function loadTopScore() {
    topScoreEl.textContent = localStorage.getItem(config.localStorageKey);
}

function resetState() {
    state.score = 0;
    state.lives = config.startingLives;
    state.topScore = localStorage.getItem(config.localStorageKey) || 0;
    updateState();
    createBricks(document.getElementById("myCanvas").getContext("2d"));
}

function updateState() {
    scoreEl.textContent = state.score;
    livesEl.textContent = state.lives;
    // topScoreEl.textContent = localStorage.getItem(config.localStorageKey);


    if (state.score > state.topScore) {
        state.topScore = state.score;
        saveTopScore();
        topScoreEl.textContent = state.topScore;
    }
}
function loseLife() {
    state.lives-=1;
    updateState();
    playSound(sounds.loseLife);

    if(state.lives <= 0) {
        playSound(sounds.gameOver);
        alert("Game Over");
        resetState();
    }
}

function winGame() {
    alert("🎉 You Won!");
    resetState();
}
export { config, state, updateState, loadTopScore, saveTopScore, loseLife , winGame}