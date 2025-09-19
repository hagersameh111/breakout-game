import { ball, paddle, bricks, createBricks } from "./objects.js";
import { gameLoop } from "./motion.js";
import { drawLives } from "./state.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//canvas size responsive to window size
canvas.width = window.innerWidth * 0.55;
canvas.height = window.innerHeight * 0.58;

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
  // Create gradient from top (paddle.y) to bottom (paddle.y + paddle.height)
  const gradient = ctx.createLinearGradient(
    paddle.x, paddle.y,               // start (top)
    paddle.x, paddle.y + paddle.height // end (bottom)
  );

  gradient.addColorStop(0, "#a25d70");  // Top color
  gradient.addColorStop(1, "#e7c722");  // Bottom color
 ctx.shadowColor = "rgba(199, 125, 233, 1)";
  ctx.fillStyle = gradient;
  
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
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
        ctx.lineWidth = .5;
        ctx.strokeStyle = "black";
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);

        // stop shadows
       
      } else {
        // if faild to load pics then it shows as grey bricks
        ctx.fillStyle = brick.color || "gray";
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      }
    }
  });
}


//paddle start position
paddle.x = canvas.width / 2 - paddle.width / 2;
paddle.y = canvas.height - paddle.height - 100; 
// --- Draw the canvas ---
export function drawCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall(ctx, ball);
  drawPaddle(ctx, paddle);
  drawBricks(ctx, bricks);
  drawLives(ctx, canvas)
}

// --- Start game loop ---
gameLoop(canvas, ctx, drawCanvas);
