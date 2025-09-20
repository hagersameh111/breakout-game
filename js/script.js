import { ball, paddle, bricks, createBricks } from "./objects.js";
import { gameLoop } from "./motion.js";
import { drawLives } from "./state.js";
import { powerUps, spawnRandomPowerUp } from "./powerups.js";


export const canvas = document.getElementById("myCanvas");
export const ctx = canvas.getContext("2d");

// // Keep paddle responsive and at bottom of canvas
// function resizeCanvas(canvas, baseWidth = 800, baseHeight = 600) {
//   const scale = Math.min(
//     window.innerWidth * 0.8 / baseWidth,   // 80% of screen width
//     window.innerHeight * 0.8 / baseHeight  // 80% of screen height
//   );

//   canvas.width = baseWidth * scale;
//   canvas.height = baseHeight * scale;

//   // Scale paddle size relative to canvas
//   paddle.width = canvas.width * 0.15;   // 15% of canvas width
//   paddle.height = canvas.height * 0.03; // 3% of canvas height

//   // Keep paddle centered and at bottom
//   paddle.x = canvas.width / 2 - paddle.width / 2;
//   paddle.y = canvas.height - paddle.height - 10; 
// }

// // Call on load + resize
// resizeCanvas(canvas);
// window.addEventListener("resize", () => resizeCanvas(canvas));

          // canvas.width = 1000;
          // canvas.height = 600;

          // paddle.width = canvas.width * 0.13;   // 15% of canvas width
          // paddle.height = canvas.height * 0.02; // 3% of canvas heigh

          // paddle.x = canvas.width / 2 - paddle.width / 2;
          // paddle.y = canvas.height - paddle.height - 10; 

  const GAME_WIDTH = 1100;   // internal drawing resolution (keeps physics stable)
const GAME_HEIGHT = 700;

// Set internal resolution (used for all game math)
function setupCanvasInternalSize() {
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  // Optional: set a CSS display size so canvas is responsive visually.
  // This keeps the internal resolution fixed but scales the canvas to the screen.
  // Tweak the maxFraction or fixedMaxWidth to match your HUD width if needed.
  const maxFraction = 0.8;              // use up to 80% of viewport width
  const fixedMaxWidth = GAME_WIDTH;     // don't upscale beyond internal res
  const cssWidth = Math.min(window.innerWidth * maxFraction, fixedMaxWidth);
  canvas.style.width = cssWidth + "px";
  canvas.style.height = "auto"; // preserve aspect ratio
}

setupCanvasInternalSize();
window.addEventListener("resize", () => {
  setupCanvasInternalSize();
  // Recompute paddle size/pos if you want paddle to scale with canvas internal size:
  // (we keep internal resolution constant so paddle stays the same in game space)
});

// ---- Paddle sizing and initial position (in canvas/internal coordinates) ----
paddle.width = canvas.width * 0.13;
paddle.height = canvas.height * 0.02;
paddle.x = canvas.width * 0.5 - paddle.width / 2;
paddle.y = canvas.height - paddle.height - 10;

// Populate the shared bricks array
createBricks(ctx);

// --- Draw Ball ---
export function drawBall(ctx, ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.shadowColor = "rgba(235, 222, 41, 1)";
  ctx.fill();
  ctx.closePath();
}

// --- Draw Paddle ---
export function drawPaddle(ctx, paddle) {
  // Gradient from top → bottom
  const gradient = ctx.createLinearGradient(
    paddle.x, paddle.y,
    paddle.x, paddle.y + paddle.height
  );

  gradient.addColorStop(0, "#a25d70");  // Top color
  gradient.addColorStop(1, "#e7c722");  // Bottom color

  ctx.shadowColor = "rgba(199, 125, 233, 1)";
  ctx.shadowBlur = 6;

  ctx.fillStyle = gradient;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  // Reset shadow so other objects aren’t affected
  ctx.shadowBlur = 0;
}

// --- Draw Bricks ---
export function drawBricks(ctx, bricks) {
  bricks.forEach((brick) => {
    if (!brick.destroyed) {
      if (brick.image && brick.image.complete) {
        // draw pics on bricks
        ctx.drawImage(brick.image, brick.x, brick.y, brick.width, brick.height);

        // shadows
        ctx.shadowColor = "rgba(125, 202, 233, 1)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        // borders
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "black";
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);

      } else {
        // fallback: grey bricks
        ctx.fillStyle = brick.color || "gray";
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      }
    }
  });
}

// --- Draw the canvas ---
export function drawCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall(ctx, ball);
  drawPaddle(ctx, paddle);
  drawBricks(ctx, bricks);
  drawLives(ctx, canvas);

  // Draw all power-ups on top
  powerUps.forEach(pu => pu.draw(ctx));
}

// --- Start game loop ---
gameLoop(canvas, ctx, drawCanvas);
