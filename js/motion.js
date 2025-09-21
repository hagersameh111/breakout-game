import { gameState } from "./gameState.js";
import { ball, paddle, bricks } from "./objects.js";
import { keys, mouse } from "./input.js";
import { loadTopScore, gamePaused} from "./state.js";
import { wallCollision, groundCollision, paddleCollision, bricksCollision } from "./collision.js";
import { powerUps, paddleCollisionWithPowerUps } from "./powerups.js";
import { sounds } from "./sound.js";

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
  if (!gameState.started ) { // stop until game starts
  requestAnimationFrame(() => gameLoop(canvas, ctx, drawCanvas));
  return;
}
 if (gamePaused) {
    // If paused, just redraw the current state without updating  
    drawCanvas(ctx, canvas);

    ctx.save();
    ctx.font = `${Math.floor(canvas.width * 0.06)}px Arial`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.textAlign = "center";
    ctx.fillText("⏸ PAUSED", canvas.width / 2, canvas.height / 2);
    ctx.restore();

    requestAnimationFrame(() => gameLoop(canvas, ctx, drawCanvas));
    return;
  }

  
  movePaddle(canvas);
  
  if (!ballLaunched) launchBall();     
  if (keys.space || mouse.clicked) launchBall(true);
  
  // Update power-ups (falling)
  powerUps.forEach((pu, index) => {
    pu.update();
    if (pu.y > canvas.height) powerUps.splice(index, 1);
  });
  
  // Check collisions with paddle
  paddleCollision();              // existing ball collision
  paddleCollisionWithPowerUps();  // power-ups collision
  
  moveBall();
  wallCollision(canvas);
  groundCollision(canvas, ctx);
  bricksCollision(ctx);
  
  drawCanvas(ctx, canvas, paddle, ball, bricks);

  requestAnimationFrame(() => gameLoop(canvas, ctx, drawCanvas));
  loadTopScore();
  sounds.bgMusic.play();
}