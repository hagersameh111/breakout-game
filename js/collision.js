import { ball, paddle, bricks } from './objects.js';
import { config, state, updateState , winGame} from './state.js'
import { loseLife } from './state.js';

export function bricksCollision() {
    // console.log(ball.x);
    // console.log(ball.y);
    // console.log(bricks.y);
    let brickHit = false;
    bricks.forEach((brick) => {
        if (!brick.destroyed) {
            if (ball.x + ball.radius > brick.left && ball.x - ball.radius < brick.right && ball.y + ball.radius > brick.top && ball.y - ball.radius < brick.bottom) {
                brick.destroyed = true;
                ball.dy *= -1;
                state.score += config.pointsPerBrick;
                updateState();
                brickHit = true; 

            }
        }
    })
      if (brickHit) {
        const allDestroyed = bricks.every(b => b.destroyed);
        if (allDestroyed) {
            setTimeout(() => winGame(), 50); 
        }
    }
}


export function wallCollision(canvas){
  // Bounce off left and right walls
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
  }
  // Bounce off top wall
  if (ball.y - ball.radius < 100) {
    ball.y = 100 + ball.radius;
    ball.dy *= -1;
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
  }

}

