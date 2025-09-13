

export const ball = {
  x: 400,
  y: 300,
  radius: 10,
  dx: 7,
  dy: 7,
  color: "red",
  speed: 7
};

export const paddle = {
  width: 110,
  height: 14,
  x: 345,
  y: 550, 
  speed: 10,
  color: "blue"
};

//  brickslayout, hena mafrod 3la hasb l levels bs da bs demo 8ayro brahtko
// export const bricks = [];
// const rows = 5;
// const cols = 8;
// const brickWidth = 80;
// const brickHeight = 20;
// const padding = 10;
// const offsetTop = 50;
// const offsetLeft = 35;

// for (let r = 0; r < rows; r++) {
//   for (let c = 0; c < cols; c++) {
//     bricks.push({
//       x: c * (brickWidth + padding) + offsetLeft,
//       y: r * (brickHeight + padding) + offsetTop,
//       width: brickWidth,
//       height: brickHeight,
//       color: "blue",
//       destroyed: false
//     });
//   }
// }


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

// --- Brick grid ---
class BrickGrid {
  constructor() {
    // keep constants here
    this.rows = 5;
    this.cols = 8;
    this.brickWidth = 80;
    this.brickHeight = 20;
    this.padding = 10;
    this.offsetTop = 50;
    this.offsetLeft = 35;
    this.bricks = [];

    this.createBricks();
  }

  createBricks() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        let x = c * (this.brickWidth + this.padding) + this.offsetLeft;
        let y = r * (this.brickHeight + this.padding) + this.offsetTop;
        this.bricks.push(new Brick(x, y, this.brickWidth, this.brickHeight));
      }
    }
  }
}

// export bricks list directly
const brickGrid = new BrickGrid();
export const bricks = brickGrid.bricks;



export let score = 0;
export let lives = 3;
