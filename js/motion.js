import { ball, paddle, bricks } from "./objects.js";
import { keys } from "./input.js";
import { loadTopScore } from "./state.js";
import { wallCollision, groundCollision, paddleCollision, bricksCollision } from "./collision.js";


// Move ball with wall and paddle bounce  
export function moveBall(canvas) {
  if (ball.onPaddle) {
    ballOnPaddle()
    return;
  }
  ball.x += ball.dx;
  ball.y += ball.dy;
}

// Keep ball on paddle before launch
export function ballOnPaddle() {
  ball.x = paddle.x + paddle.width / 2;
  ball.y = paddle.y - ball.radius;
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
    // Launch straight up from the paddle center
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - ball.radius;
    ball.dx = 0;
    ball.dy = -ball.speed;
  }
}

// Game loop
export function gameLoop(canvas, ctx, drawCanvas) {
  movePaddle(canvas);
  launchBall();
  moveBall(canvas);

  wallCollision(canvas);
  groundCollision(canvas);
  bricksCollision();
  paddleCollision();

  drawCanvas(ctx, canvas, paddle, ball, bricks);
  requestAnimationFrame(() => gameLoop(canvas, ctx, drawCanvas));

  loadTopScore();
}
