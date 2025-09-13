import { ball, paddle, bricks } from "./objects.js";
import { gameLoop } from "./motion.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Use actual viewport size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
  bricks.forEach((brick) => {
    if (!brick.destroyed) {
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
    }
  });
}

// --- Draw Canvas (wrapper) ---
export function drawCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall(ctx, ball);
  drawPaddle(ctx, paddle);
  drawBricks(ctx, bricks);
}

// --- Start game loop ---
gameLoop(canvas, ctx, drawCanvas);
