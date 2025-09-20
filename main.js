import { loadLevelByIndex } from "./js/levels.js";
import { canvas, ctx, drawCanvas } from "./js/script.js";
import { gameLoop, launchBall } from "./js/motion.js";
import { gameState } from "./js/gameState.js";

export let lvlI;
document.getElementById('startBtn').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value || "Player";
    const levelIndex = parseInt(document.getElementById('levelSelect').value);

    localStorage.setItem('playerName', playerName);
    localStorage.setItem('selectedLevel', levelIndex);

    document.getElementById('welcomeScreen').style.display = "none";

    lvlI = loadLevelByIndex(levelIndex-1, canvas, ctx);

    gameState.started = true;  // safe now
    launchBall();
    gameLoop(canvas, ctx, drawCanvas);
});
