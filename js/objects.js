export const ball = {
  x: 400,
  y: 300,
  radius: 10,
  dx: 7,
  dy: 7,
  color: "purple",
  speed: 7,
  onPaddle: true
};

export const paddle = {
  width: 110,
  height: 14,
  x: 345,
  y: 550,
  speed: 7,
};


// --- Brick class ---
export class Brick {
  constructor(x, y, width, height, color = "blue", imageSrc = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.destroyed = false;
    this.breaking = false;  //  animation state
    this.halves = [];       // will store halves
    this.imageSrc = imageSrc;
    this.image = null;
  }
  split() {
    const halfWidth = this.width / 2;

    this.halves = [
      {
        // left half
        sx: 0, sy: 0,
        sw: this.image.width / 2, sh: this.image.height,
        dx: this.x, dy: this.y,
        dw: halfWidth, dh: this.height,
        dxSpeed: -1.5,    // move left
        dySpeed: 2      // fall down fast
      },
      {
        // right half
        sx: this.image.width / 2, sy: 0,
        sw: this.image.width / 2, sh: this.image.height,
        dx: this.x + halfWidth, dy: this.y,
        dw: halfWidth, dh: this.height,
        dxSpeed: 1.5,     // move right
        dySpeed: 2
      }
    ];
  }

  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width;
  }
  get top() {
    return this.y;
  }
  get bottom() {
    return this.y + this.height;
  }
}


export const bricks = [];

const brickImagesSrc = [
  "./assets/images/a.jpg",
  "./assets/images/bam.jpg",
  "./assets/images/e.jpg",
  "./assets/images/f.jpg",
  "./assets/images/k.jpg",
  "./assets/images/g.jpg",
  "./assets/images/j.jpg",
  "./assets/images/o.jpg",
  "./assets/images/k.jpg",
  "./assets/images/e.jpg",
  "./assets/images/j.jpg",
  "./assets/images/d.jpg",
  "./assets/images/c.jpg",
  "./assets/images/e.jpg",
  "./assets/images/h.jpg",
];

export function createBricks(ctx, levelId) {
  const brickWidth = 60;
  const brickHeight = 30;
  const padding = 5;
  const offsetTop = 100;

  let generatedBricks = [];
  let imgIndex = 0;

  if (levelId === "L1") {
    // Level 1 → Diamond
    let rows = 7;
    let y = offsetTop;
    let mid = Math.floor(rows / 2);

    for (let r = 0; r < rows; r++) {
      let count = r <= mid ? r + 1 : rows - r;
      let x = ctx.canvas.width / 2 - (count * (brickWidth + padding)) / 2;

      generatedBricks[r] = []; // create row

      for (let c = 0; c < count; c++) {
        const imageSrc = brickImagesSrc[imgIndex % brickImagesSrc.length];
        generatedBricks[r][c] = new Brick(
          x,
          y,
          brickWidth,
          brickHeight,
          `hsl(${c * 50},70%,50%)`,
          imageSrc
        );
        x += brickWidth + padding;
        imgIndex++;
      }
      y += brickHeight + padding;
    }
  } else if (levelId === "L2") {
    // Level 2 → Pyramid
    let rows = 6;
    let y = offsetTop;

    for (let r = 0; r < rows; r++) {
      let rowBricks = r + 1;
      let x = ctx.canvas.width / 2 - (rowBricks * (brickWidth + padding)) / 2;

      generatedBricks[r] = []; // create row

      for (let c = 0; c < rowBricks; c++) {
        const imageSrc = brickImagesSrc[imgIndex % brickImagesSrc.length];
        generatedBricks[r][c] = new Brick(
          x,
          y,
          brickWidth,
          brickHeight,
          `hsl(${r * 40},70%,50%)`,
          imageSrc
        );
        x += brickWidth + padding;
        imgIndex++;
      }
      y += brickHeight + padding;
    }
  } else if (levelId === "L3") {
    // Level 3 → Wall
    let rows = 5;
    let cols = Math.floor(ctx.canvas.width / (brickWidth + padding));
    let y = offsetTop;

    for (let r = 0; r < rows; r++) {
      let x = 20;
      if (r % 2 === 1) x += (brickWidth + padding) / 2;

      generatedBricks[r] = []; // create row

      for (let c = 0; c < cols; c++) {
        const imageSrc = brickImagesSrc[imgIndex % brickImagesSrc.length];
        let color = r % 2 === 0 ? "red" : "blue";
        generatedBricks[r][c] = new Brick(
          x,
          y,
          brickWidth,
          brickHeight,
          color,
          imageSrc
        );
        x += brickWidth + padding;
        imgIndex++;
      }
      y += brickHeight + padding;
    }
  }

  // Load images on bricks
  generatedBricks.forEach((row) =>
    row.forEach((brick) => {
      if (brick.imageSrc) {
        const img = new Image();
        img.src = brick.imageSrc;
        brick.image = img;
      }
    })
  );

  bricks.length = 0;
  bricks.push(...generatedBricks);

  return generatedBricks;
}

export let score = 0;
export let lives = 3;