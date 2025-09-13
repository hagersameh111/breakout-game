import { ball, paddle, bricks } from "./objects.js";
import { gameLoop } from "./motion.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
//hena ahsn mn css 3lshan btakhod l actual height and width 
canvas.width = window.innerWidth*.75; 
canvas.height=window.innerHeight*.60;

export function drawCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  // Draw ball
  //garbo shelo l 0 hoto 2 masln shofo shakl l kora , hakhleha ana 5 b3d mnkhals lol
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();

  // Draw paddle
  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  // Draw bricks
  bricks.forEach((brick) => {
    if (!brick.destroyed) {
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
    }
  });
}

// calling fun start
gameLoop(canvas, ctx, drawCanvas);
