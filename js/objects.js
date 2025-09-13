export const ball = {
  x: 400,
  y: 300,
  radius: 10,
  dx: 3,
  dy: 3,
  color: "red"
};

export const paddle = {
  width: 110,
  height: 14,
  x: 345,
  y: 550,
  speed: 7,
  color: "blue"
};

// --- Brick class ---
class Brick {
  constructor(x, y, width, height, color = "blue") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.destroyed = false;
  }

  get left()   { return this.x; }
  get right()  { return this.x + this.width; }
  get top()    { return this.y; }
  get bottom() { return this.y + this.height; }
}

// --- Generate themed bricks ---
export function createBricks(ctx) {
  const bricks = [];
  const brickWidth = 60;
  const brickHeight = 25;
  const padding = 5;
  const offsetTop = 50;

  const themes = ["pyramid", "wall", "diamond"];
  const theme = themes[Math.floor(Math.random() * themes.length)];

  if (theme === "pyramid") {
    let rows = 6;
    let y = offsetTop;
    for (let r = 0; r < rows; r++) {
      let rowBricks = r + 1;
      let x = ctx.canvas.width / 2 - (rowBricks * (brickWidth + padding)) / 2;
      for (let c = 0; c < rowBricks; c++) {
        bricks.push(new Brick(x, y, brickWidth, brickHeight, `hsl(${r*40},70%,50%)`));
        x += brickWidth + padding;
      }
      y += brickHeight + padding;
    }
  }
  else if (theme === "wall") {
    let rows = 5;
    let cols = Math.floor(ctx.canvas.width / (brickWidth + padding));
    let y = offsetTop;
    for (let r = 0; r < rows; r++) {
      let x = 20;
      for (let c = 0; c < cols; c++) {
        let color = r % 2 === 0 ? "red" : "blue";
        bricks.push(new Brick(x, y, brickWidth, brickHeight, color));
        x += brickWidth + padding;
      }
      y += brickHeight + padding;
    }
  }
  else if (theme === "diamond") {
    let rows = 7;
    let y = offsetTop;
    let mid = Math.floor(rows / 2);
    for (let r = 0; r < rows; r++) {
      let count = r <= mid ? r + 1 : rows - r;
      let x = ctx.canvas.width / 2 - (count * (brickWidth + padding)) / 2;
      for (let c = 0; c < count; c++) {
        bricks.push(new Brick(x, y, brickWidth, brickHeight, `hsl(${c*50},70%,50%)`));
        x += brickWidth + padding;
      }
      y += brickHeight + padding;
    }
  }

  return bricks;
}

// --- Export bricks later after canvas exists ---
export let bricks; 

export let score = 0;
export let lives = 3;
