// === Imports ===
import { ball, paddle, bricks } from './objects.js';
import { config, state, updateState, winGame } from './state.js';
import { loseLife } from './state.js';
import { sounds, playSound } from "./sound.js";
import { powerUps, spawnRandomPowerUp } from "./powerups.js";

/**
 * Handle collision detection between ball and bricks.
 * - Detects collision and determines which side of the brick was hit.
 * - Bounces ball accordingly.
 * - Marks brick as destroyed and triggers break animation.
 * - Updates score, plays sound, and may spawn power-ups.
 * - Checks if all bricks are destroyed to trigger win condition.
 */
export function bricksCollision(ctx) {
  let brickHit = false;

  // Loop through all bricks
  bricks.forEach((row) => {
    row.forEach((brick) => {
      if (!brick.destroyed) {
        // Check if ball intersects with brick boundaries
        if (
          ball.x + ball.radius > brick.left &&
          ball.x - ball.radius < brick.right &&
          ball.y + ball.radius > brick.top &&
          ball.y - ball.radius < brick.bottom
        ) {
          // --- Determine collision side using overlap distances ---
          const overlapLeft   = ball.x + ball.radius - brick.left;
          const overlapRight  = brick.right - (ball.x - ball.radius);
          const overlapTop    = ball.y + ball.radius - brick.top;
          const overlapBottom = brick.bottom - (ball.y - ball.radius);

          const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

          // --- Adjust ball direction depending on side hit ---
          if (minOverlap === overlapLeft) {
            ball.dx = -Math.abs(ball.dx); // Left side
          } else if (minOverlap === overlapRight) {
            ball.dx = Math.abs(ball.dx); // Right side
          } else if (minOverlap === overlapTop) {
            ball.dy = -Math.abs(ball.dy); // Top side
          } else if (minOverlap === overlapBottom) {
            ball.dy = Math.abs(ball.dy); // Bottom side
          }

          // --- Mark brick as destroyed & trigger split animation ---
          brick.destroyed = true;
          brick.breaking = true;
          brick.split();

          // Update score
          state.score += config.pointsPerBrick;
          updateState();

          brickHit = true;
          playSound(sounds.brickHit);

          // --- 10% chance to spawn power-up, limited to 2 onscreen ---
          if (Math.random() < 0.1 && powerUps.length < 2) {
            spawnRandomPowerUp(brick.left + brick.width / 2, brick.top);
          }
        }
      }
    });
  });

  // --- Win condition: all bricks destroyed ---
  if (brickHit) {
    const allDestroyed = bricks.flat().every((b) => b.destroyed);
    if (allDestroyed) {
      setTimeout(() => winGame(ctx), 50); // small delay before showing win screen
    }
  }
}

/**
 * Handle collision between ball and walls (left, right, top).
 */
export function wallCollision(canvas) {
  // Left or right wall bounce
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
    playSound(sounds.brickHit);
  }

  // Top wall bounce (limited to y >= 100 so UI/header space is clear)
  if (ball.y - ball.radius < 100) {
    ball.y = 100 + ball.radius;
    ball.dy *= -1;
    playSound(sounds.brickHit);
  }
}

/**
 * Handle ball falling below the paddle (ground collision).
 * - Player loses a life.
 * - Ball resets on paddle for next serve.
 */
export function groundCollision(canvas, ctx) {
  if (ball.y - ball.radius > canvas.height) {
    loseLife(ctx);

    // Reset ball on paddle
    ball.onPaddle = true;
    ball.dx = 0;
    ball.dy = 0;
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - ball.radius;
  }
}

/**
 * Handle collision between ball and paddle.
 * - Ball always bounces upward.
 * - Bounce angle depends on hit position relative to paddle center.
 * - Preserves ball speed while adjusting direction.
 */
export function paddleCollision() {
  if (ball.onPaddle) return; // No collision when waiting to serve

  if (
    ball.y + ball.radius >= paddle.y &&           // Ball reaches paddle vertically
    ball.x >= paddle.x &&                         // Within paddle bounds horizontally
    ball.x <= paddle.x + paddle.width
  ) {
    // Always bounce upward
    ball.dy = -Math.abs(ball.dy);

    // Distance from paddle center
    const hitPos = ball.x - (paddle.x + paddle.width / 2);

    // Normalize hit position: -1 (left edge) to +1 (right edge)
    const normalized = hitPos / (paddle.width / 2);

    // Max bounce angle: 60° from vertical
    const maxBounceAngle = (60 * Math.PI) / 180;
    const angle = normalized * maxBounceAngle;

    // Keep speed constant
    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);

    // Update velocity with new angle
    ball.dx = speed * Math.sin(angle);
    ball.dy = -speed * Math.cos(angle);

    playSound(sounds.paddleHit);
  }
}