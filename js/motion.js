import { gameState } from "./gameState.js";
import { ball, paddle, bricks } from "./objects.js";
import { keys, mouse } from "./input.js";
import { loadTopScore } from "./state.js";
import { wallCollision, groundCollision, paddleCollision, bricksCollision } from "./collision.js";

let ballLaunched = false;

// Move ball with wall and paddle bounce  
export function moveBall(canvas) {
  if (ball.onPaddle) {
    ballOnPaddle();
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
  // --- Keyboard ---
  if (keys.left && paddle.x > 0) {
    paddle.x -= paddle.speed;
  }
  if (keys.right && paddle.x + paddle.width < canvas.width) {
    paddle.x += paddle.speed;
  }

  // --- Mouse ---
  if (mouse.inside && mouse.x !== null) {
    let newX = mouse.x - paddle.width / 2;
    if (newX < 0) newX = 0;
    if (newX + paddle.width > canvas.width) newX = canvas.width - paddle.width;

    paddle.x = newX;
  }
}


export function launchBall() {
  if (!ballLaunched && ball.onPaddle) {
    ball.onPaddle = false;
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - ball.radius;
    ball.dx = 0;
    ball.dy = -ball.speed;
    ballLaunched = true;
  }
}

export function gameLoop(canvas, ctx, drawCanvas) {
  if (!gameState.started) return; // stop until game starts

  movePaddle(canvas);
  launchBall();
  moveBall(canvas);

  wallCollision(canvas);
  groundCollision(canvas);
  bricksCollision();
  paddleCollision();

  drawCanvas(ctx, canvas, paddle, ball, bricks);

  requestAnimationFrame(() => gameLoop(canvas, ctx, drawCanvas));
}
