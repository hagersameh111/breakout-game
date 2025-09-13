import { ball, paddle, bricks } from "./objects.js";
import { keys } from "./input.js";
import { bricksCollision } from "./collision.js";
import { loadTopScore }  from "./state.js";

// Move ball with wall and paddle bounce  
export function moveBall(canvas) {
  if (ball.onPaddle) {
    // Keep ball on paddle before launch
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - ball.radius;
    return;
  }

  ball.x += ball.dx;
  ball.y += ball.dy;

  // Bounce off left and right walls
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
  }
  // Bounce off top wall
  if (ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }
  // Bounce off paddle
  if (
    ball.y + ball.radius >= paddle.y &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width
  ) {
    ball.dy *= -1;
    let hitPos = ball.x - (paddle.x + paddle.width / 2);
   
   }

  // Reset if falls below canvas
  if (ball.y - ball.radius > canvas.height) {
    ball.onPaddle = true;
    ball.dx = 3;
    ball.dy = -3;
  }
}

// Paddle movement based on input
export function movePaddle(canvas) {
  if (keys.left && paddle.x > 0) paddle.x -= paddle.speed;
  if (keys.right && paddle.x + paddle.width < canvas.width) paddle.x += paddle.speed;
}

// Launch ball on spacebar press
export function launchBall() {
  if (ball.onPaddle && keys.space) {
    ball.onPaddle = false;
  }
}

// Game loop
export function gameLoop(canvas, ctx, drawCanvas) {
  movePaddle(canvas);
  launchBall();
  moveBall(canvas);
  drawCanvas(ctx, canvas, paddle, ball, bricks);
  requestAnimationFrame(() => gameLoop(canvas, ctx, drawCanvas));
  
  loadTopScore();
  
  bricksCollision();
}
  