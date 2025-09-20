import { ball, paddle, bricks, createBricks } from "./objects.js";
import { gameLoop } from "./motion.js";
import { drawLives } from "./state.js";
import { powerUps, spawnRandomPowerUp } from "./powerups.js";


export const canvas = document.getElementById("myCanvas");
export const ctx = canvas.getContext("2d");


const GAME_WIDTH = 1100;   // internal drawing resolution (keeps physics stable)
const GAME_HEIGHT = 700;

// Set internal resolution (used for all game math)
function setupCanvasInternalSize() {
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
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
  gradient.addColorStop(1, "#e7c722");

  // 🔥 Pulsating glow (sin wave)
  const time = Date.now() * 0.005; // speed of pulsing
  const pulse = (Math.sin(time) + 1) / 2; // 0 → 1
  const glowStrength = 10 + pulse * 40;   // min 10, max 50

  ctx.shadowColor = "#008b8b"; // neon pink glow
  ctx.shadowBlur = glowStrength;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillStyle = gradient;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  // White outline for visibility
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);

  // Reset shadow
  ctx.shadowBlur = 0;
}


export function drawBricks(ctx, bricks) {
  bricks.forEach((row) => {
    row.forEach((brick) => {
    if (brick.breaking && brick.halves.length > 0) {
      brick.halves.forEach((half) => {
        half.dx += half.dxSpeed;
        half.dy += half.dySpeed;
        half.dySpeed += 0.4; // gravity boost

        if (brick.image && brick.image.complete) {
          ctx.drawImage(
            brick.image,
            half.sx, half.sy, half.sw, half.sh,
            half.dx, half.dy, half.dw, half.dh
          );
        }
      });
    }
    else if (!brick.destroyed) {
      // normal brick drawing
      if (brick.image && brick.image.complete) {
        ctx.drawImage(brick.image, brick.x, brick.y, brick.width, brick.height);
      } else {
        ctx.fillStyle = brick.color || "gray";
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      }
    }
  });
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
