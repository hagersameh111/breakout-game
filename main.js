import { loadLevelByIndex } from "./js/levels.js";
import { canvas, ctx, drawCanvas } from "./js/script.js";
import { gameLoop, launchBall } from "./js/motion.js";
import { gameState } from "./js/gameState.js";
import { sounds } from "./js/sound.js";

document.getElementById('startBtn').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value || "Player";
    const levelIndex = parseInt(document.getElementById('levelSelect').value);

    localStorage.setItem('playerName', playerName);
    localStorage.setItem('selectedLevel', levelIndex);

    document.getElementById('welcomeScreen').style.display = "none";

    loadLevelByIndex(levelIndex-1, canvas, ctx);

    gameState.started = true;  // safe now
    launchBall();
    sounds.bgMusic.play();
    gameLoop(canvas, ctx, drawCanvas);
});
