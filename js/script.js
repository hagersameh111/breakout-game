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



// --- Brick Themes ---
function generateBricks(ctx, bricks) {
  bricks.length = 0;
  const brickWidth = 60;
  const brickHeight = 25;
  const padding = 5;

  // Pick a random theme
  const themes = ["pyramid", "wall", "diamond"];
  const theme = themes[Math.floor(Math.random() * themes.length)];

  if (theme === "pyramid") {
    let rows = 6;
    let startX = ctx.canvas.width / 2 - (brickWidth / 2);
    let y = 50;

    for (let r = 0; r < rows; r++) {
      let rowBricks = r + 1; // increasing per row
      let x = ctx.canvas.width / 2 - (rowBricks * (brickWidth + padding)) / 2;
      for (let c = 0; c < rowBricks; c++) {
        bricks.push({
          x: x,
          y: y,
          width: brickWidth,
          height: brickHeight,
          color: `hsl(${(r * 40) % 360}, 70%, 50%)`, // different color per row
          destroyed: false,
        });
        x += brickWidth + padding;
      }
      y += brickHeight + padding;
    }
  }

  else if (theme === "wall") {
    let rows = 5;
    let cols = Math.floor(ctx.canvas.width / (brickWidth + padding));
    let y = 50;

    for (let r = 0; r < rows; r++) {
      let x = 20;
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: x,
          y: y,
          width: brickWidth,
          height: brickHeight,
          color: r % 2 === 0 ? "red" : "blue",
          destroyed: false,
        });
        x += brickWidth + padding;
      }
      y += brickHeight + padding;
    }
  }

  else if (theme === "diamond") {
    let rows = 7;
    let y = 50;
    let mid = Math.floor(rows / 2);

    for (let r = 0; r < rows; r++) {
      let count = r <= mid ? r + 1 : rows - r;
      let x = ctx.canvas.width / 2 - (count * (brickWidth + padding)) / 2;
      for (let c = 0; c < count; c++) {
        bricks.push({
          x: x,
          y: y,
          width: brickWidth,
          height: brickHeight,
          color: `hsl(${(c * 50) % 360}, 70%, 50%)`,
          destroyed: false,
        });
        x += brickWidth + padding;
      }
      y += brickHeight + padding;
    }
  }
}//
let initialized = false;
// --- Draw Bricks ---
export function drawBricks(ctx, bricks) {
  if (!initialized) {
    generateBricks(ctx, bricks);
    initialized = true;
  }

  // Draw bricks with gradient + shadow
  bricks.forEach((brick) => {
    if (!brick.destroyed) {
      const gradient = ctx.createLinearGradient(
        brick.x,
        brick.y,
        brick.x,
        brick.y + brick.height
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

      ctx.shadowColor = "transparent"; // reset
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
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
