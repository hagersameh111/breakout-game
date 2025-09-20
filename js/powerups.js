// powerups.js
import { paddle, lives } from "./objects.js"; // adjust based on your project
// import { spawnExtraBalls } from "./extraBalls.js"; // optional if you implement multi-ball
import { state } from "./state.js";
export let powerUps = [];

// Preload images
export const powerUpImages = {};
["extraLife","widePaddle"].forEach(type => {
  const img = new Image();
  img.src = `./assets/images/${type}.png`;
//   img.src = `./assets/images/icons8-pixel-heart-48.png`;
  powerUpImages[type] = img;
});

export class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.dy = 2;   // falling speed
    this.image = powerUpImages[type];
    // Set width/height proportionally to paddle for better visibility
    if (type === "widePaddle") {
        this.width = paddle.width * 1.4;
        this.height = paddle.height * 3.5;
    } else {
        // Default size for other power-ups
        this.width = 60;
        this.height = 60;
    }
  }

  update() {
    this.y += this.dy;
  }

  draw(ctx) {
    if (this.image.complete) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = "green"; // fallback
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}

export function spawnRandomPowerUp(x, y) {
  const types = ["extraLife","widePaddle"];
  const type = types[Math.floor(Math.random() * types.length)];
  const pu = new PowerUp(x, y, type);
  powerUps.push(pu);
  console.log(`Power-up spawned: ${type} at (${x}, ${y})`);
}

// Apply effect when collected
export function applyPowerUp(pu) {
  switch(pu.type) {
    case "extraLife":
        if(state.lives<3){
            state.lives++;   // adjust if lives is a number or object
            console.log("Extra Life collected! Lives:", state.lives);
        }
      break;

    case "widePaddle":
      const originalWidth = paddle.width;
      paddle.width *= 1.5;
      console.log("Wide Paddle collected!");
      setTimeout(() => {
        paddle.width = originalWidth;
      }, 10000); // 10 sec duration
      break;

    // case "multiBall":
    //   console.log("Multi Ball collected!");
    //   spawnExtraBalls?.(); // implement extra balls separately
    //   break;
  }
}

// Detect paddle collisions
export function paddleCollisionWithPowerUps() {
  powerUps.forEach((pu, index) => {
    if (
      pu.x + pu.width > paddle.x &&
      pu.x < paddle.x + paddle.width &&
      pu.y + pu.height > paddle.y &&
      pu.y < paddle.y + paddle.height
    ) {
      applyPowerUp(pu);
      powerUps.splice(index, 1);
    }
  });
}
