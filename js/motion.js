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
// module-level guards so we don't repeat expensive work every frame
let _topScoreLoaded = false;
let _bgStarted = false;

export function gameLoop(canvas, ctx, drawCanvas) {
  // If the game hasn't started yet, keep looping but don't update physics
  if (!gameState.started) {
    requestAnimationFrame(() => gameLoop(canvas, ctx, drawCanvas));
    return;
  }

  // Draw current frame when paused, but skip updates
  if (gamePaused) {
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

  // One-time setup work (do NOT do these every frame)
  if (!_topScoreLoaded) {
    _topScoreLoaded = true;
    try { loadTopScore(); } catch {}
  }
  if (sounds?.bgMusic && !_bgStarted && sounds.bgMusic.paused) {
    // start background music once (mobile NOTE: must be triggered after first user gesture)
    sounds.bgMusic.play().then(() => { _bgStarted = true; }).catch(() => {});
  }

  // --- INPUT → PADDLE ---
  movePaddle(canvas); // make sure this respects mouse.x (from pointer/mouse/touch)

  // --- INPUT → LAUNCH (consume once) ---
  // Allow auto-launch if your logic requires it
  if (!ballLaunched && typeof launchBall === "function") {
    const launchRequested = keys.space === true || mouse.clicked === true;

    // If you also want auto-launch when not requested:
    // if (!ballLaunched && !launchRequested) launchBall(); // optional

    if (launchRequested) {
      launchBall(true);      // explicit launch
      // consume inputs so it doesn't relaunch every frame
      keys.space = false;
      mouse.clicked = false;
    }
  }

  // --- POWER-UPS (falling) ---
  // iterate backwards if you may splice
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const pu = powerUps[i];
    pu.update();
    if (pu.y > canvas.height) powerUps.splice(i, 1);
  }

  // --- COLLISIONS ---
  paddleCollision();             // ball vs paddle
  paddleCollisionWithPowerUps(); // paddle vs power-ups

  // --- PHYSICS & WORLD ---
  moveBall();
  wallCollision(canvas);
  groundCollision(canvas, ctx);
  bricksCollision(ctx);

  // --- RENDER ---
  drawCanvas(ctx, canvas, paddle, ball, bricks);

  // --- NEXT FRAME ---
  requestAnimationFrame(() => gameLoop(canvas, ctx, drawCanvas));
}