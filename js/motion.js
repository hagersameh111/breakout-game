import { ball, paddle, bricks } from "./objects.js";
import { keys } from "./input.js";
import { bricksCollision } from "./collision.js";
import { loadTopScore, loseLife } from "./state.js";


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
  // if (
  //   ball.y + ball.radius >= paddle.y &&
  //   ball.x >= paddle.x &&
  //   ball.x <= paddle.x + paddle.width
  // ) {
  //   ball.dy *= -1;
  //   let hitPos = ball.x - (paddle.x + paddle.width / 2);

  // }

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
}

  // Reset if falls below canvas
  if (ball.y - ball.radius > canvas.height) {
    ball.onPaddle = true;
    ball.dx = ball.speed;
    ball.dy = ball.speed;
    loseLife();
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
    // Launch straight up from the paddle center
    ball.dx = 0;
    ball.dy = -ball.speed;
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
