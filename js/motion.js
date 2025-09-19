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


export function launchBall(manual = false) {
  // Only launch if the ball is on the paddle
  if (ball.onPaddle) {
    ball.onPaddle = false;
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - ball.radius;
    ball.dx = 0;
    ball.dy = -ball.speed;
    
    // Mark as launched only if it's an automatic launch
    if (!manual) ballLaunched = true;
  }
}

export function gameLoop(canvas, ctx, drawCanvas) {
  if (!gameState.started) return; // Stop until game starts

  // --- Paddle movement ---
  movePaddle(canvas);

  // --- Ball launch ---
  // Auto-launch at start (only once)
  if (!ballLaunched) launchBall();     

  // Manual launch if player presses space or clicks
  if (keys.space || mouse.clicked) launchBall(true);

  // --- Move the ball ---
  moveBall();

  // --- Collisions ---
  wallCollision(canvas);
  groundCollision(canvas);
  bricksCollision();
  paddleCollision();

  // --- Draw everything ---
  drawCanvas(ctx, canvas, paddle, ball, bricks);

  // Loop
  requestAnimationFrame(() => gameLoop(canvas, ctx, drawCanvas));

  // Load top score
  loadTopScore();
}

