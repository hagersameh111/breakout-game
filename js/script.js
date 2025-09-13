import { ball, paddle, bricks } from "./objects.js";
import { gameLoop } from "./motion.js";


const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Use actual viewport size
canvas.width = window.innerWidth*.7;
canvas.height = window.innerHeight*.6;

// --- Draw Ball ---
export function drawBall(ctx, ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

// --- Draw Paddle ---
export function drawPaddle(ctx, paddle) {
  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// --- Draw Bricks ---
export function drawBricks(ctx, bricks) {
  bricks.forEach(({ x, y, width, height, color, destroyed }) => {
    if (!destroyed) {
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    }
  });
}

// --- Draw Canvas ---
export function drawCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall(ctx, ball);
  drawPaddle(ctx, paddle);
  drawBricks(ctx, bricks);
}

// --- Start game loop ---
gameLoop(canvas, ctx, drawCanvas);
