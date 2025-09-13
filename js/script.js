import { ball, paddle, createBricks, bricks as bricksExport } from "./objects.js";
import { gameLoop } from "./motion.js";


const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.7;
canvas.height = window.innerHeight * 0.9;

// generate bricks now that canvas exists
export const bricks = createBricks(ctx);

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

// --- Draw Bricks with gradient ---
export function drawBricks(ctx, bricks) {
  bricks.forEach((brick) => {
    if (!brick.destroyed) {
      const gradient = ctx.createLinearGradient(
        brick.x, brick.y,
        brick.x, brick.y + brick.height
      );
      gradient.addColorStop(0, "white");
      gradient.addColorStop(0.3, brick.color);
      gradient.addColorStop(1, "black");

      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;

      ctx.fillStyle = gradient;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

      ctx.shadowColor = "transparent";
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
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
