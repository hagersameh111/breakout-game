import { ball, paddle, bricks } from './objects.js';
import { config, state, updateState , winGame} from './state.js'
import { loseLife } from './state.js';
import { sounds, playSound } from "./sound.js";
import { powerUps, spawnRandomPowerUp } from "./powerups.js";


export function bricksCollision() {
  let brickHit = false;

  bricks.forEach((brick) => {
    if (!brick.destroyed) {
      if (
        ball.x + ball.radius > brick.left &&
        ball.x - ball.radius < brick.right &&
        ball.y + ball.radius > brick.top &&
        ball.y - ball.radius < brick.bottom
      ) {
        // Compute overlap on each side
        const overlapLeft = ball.x + ball.radius - brick.left;
        const overlapRight = brick.right - (ball.x - ball.radius);
        const overlapTop = ball.y + ball.radius - brick.top;
        const overlapBottom = brick.bottom - (ball.y - ball.radius);

        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        // Bounce based on smallest overlap
        if (minOverlap === overlapLeft) {
          ball.dx = -Math.abs(ball.dx); // hit left side
        } else if (minOverlap === overlapRight) {
          ball.dx = Math.abs(ball.dx); // hit right side
        } else if (minOverlap === overlapTop) {
          ball.dy = -Math.abs(ball.dy); // hit top side
        } else if (minOverlap === overlapBottom) {
          ball.dy = Math.abs(ball.dy); // hit bottom side
        }

        brick.destroyed = true;
        state.score += config.pointsPerBrick;
        updateState();
        brickHit = true;
                playSound(sounds.brickHit);
        // --- Spawn power-up randomly if less than 2 on screen ---
        if (Math.random() < 0.1 && powerUps.length < 2) {
          spawnRandomPowerUp(brick.left + brick.width / 2, brick.top);
        }
        
      }
    }
  });

  if (brickHit) {
    const allDestroyed = bricks.every((b) => b.destroyed);
    if (allDestroyed) {
      setTimeout(() => winGame(), 50);
    }
  }
}



export function wallCollision(canvas){
  // Bounce off left and right walls
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
    playSound(sounds.brickHit);
  }
  // Bounce off top wall
  if (ball.y - ball.radius < 100) {
    ball.y = 100 + ball.radius;
    ball.dy *= -1;
    playSound(sounds.brickHit);
  }
}

export function groundCollision(canvas) {
  // Check if ball falls below canvas
  if (ball.y - ball.radius > canvas.height) {
    // Subtract a life
    loseLife();
    // Reset ball on paddle
    ball.onPaddle = true;
    ball.dx = 0;
    ball.dy = 0;
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - ball.radius;
  }
}

export function paddleCollision(){
  if(ball.onPaddle) return;
  
  // Bounce off paddle
  if (
    ball.y + ball.radius >= paddle.y &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width
  ) {
    // Always bounce upward
    ball.dy = -Math.abs(ball.dy);
    
    // Figure out how far from center the hit was
    let hitPos = ball.x - (paddle.x + paddle.width / 2);
    
    // Normalize hit position: -1 (left edge) to +1 (right edge)
    let normalized = hitPos / (paddle.width / 2);
    
    // Max bounce angle (in radians) from vertical: 60°
    let maxBounceAngle = (60 * Math.PI) / 180;
    
    // Angle relative to vertical
    let angle = normalized * maxBounceAngle;
    
    // Speed stays constant
    let speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    
    // Update dx, dy using trig
    ball.dx = speed * Math.sin(angle);
    ball.dy = -speed * Math.cos(angle);
    playSound(sounds.paddleHit);
  }
}

