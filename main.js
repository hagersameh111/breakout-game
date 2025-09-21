import { loadLevelByIndex } from "./js/levels.js";
import { canvas, ctx, drawCanvas } from "./js/script.js";
import { gameLoop, launchBall } from "./js/motion.js";
import { gameState } from "./js/gameState.js";
import { pauseGame, resumeGame, gamePaused } from "./js/state.js";


const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");

export let lvlI;
document.getElementById('startBtn').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value || "Player";
    const levelIndex = parseInt(document.getElementById('levelSelect').value);

    localStorage.setItem('playerName', playerName);
    localStorage.setItem('selectedLevel', levelIndex);

    document.getElementById('welcomeScreen').style.display = "none";

    lvlI = loadLevelByIndex(levelIndex-1, canvas, ctx);
     gameState.started = true;  
       resumeGame(); 
        pauseBtn.style.display = "inline-block";
  resumeBtn.style.display = "none";

    launchBall();
    gameLoop(canvas, ctx, drawCanvas);

});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (gamePaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  }
});

