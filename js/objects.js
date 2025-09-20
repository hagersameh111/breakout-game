export const ball = {
  x: 400,
  y: 300,
  radius: 10,
  dx: 7,
  dy: 7,
  color: "purple",
  speed: 5,
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

// --- Brick class ---
class Brick {
  constructor(x, y, width, height, color = "blue", imageSrc = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.destroyed = false;
    this.imageSrc = imageSrc;
    this.image = null;
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

export function createBricks(ctx) {
  const brickWidth = 60;
  const brickHeight = 30;
  const padding = 5;
  const offsetTop = 100;


  const themes = ["pyramid", "wall", "diamond"];
  const theme = themes[Math.floor(Math.random() * themes.length)];
  let generatedBricks = [];

  let imgIndex = 0;

  if (theme === "pyramid") {
    let rows = 6;
    let y = offsetTop;
    for (let r = 0; r < rows; r++) {
      let rowBricks = r + 1;
      let x = ctx.canvas.width / 2 - (rowBricks * (brickWidth + padding)) / 2;
      for (let c = 0; c < rowBricks; c++) {
        const imageSrc = brickImagesSrc[imgIndex % brickImagesSrc.length];
        generatedBricks.push(
          new Brick(x, y, brickWidth, brickHeight, `hsl(${r * 40},70%,50%)`, imageSrc)
        );
        x += brickWidth + padding;
        imgIndex++;
      }
      y += brickHeight + padding;
    }
  } else if (theme === "wall") {
    let rows = 5;
    let cols = Math.floor(ctx.canvas.width / (brickWidth * 1.02 + padding));
    let y = offsetTop;
    for (let r = 0; r < rows; r++) {
      let x = 20;
      if (r % 2 === 1) {
        x += (brickWidth + padding) / 2;
      }
      for (let c = 0; c < cols; c++) {
        const imageSrc = brickImagesSrc[imgIndex % brickImagesSrc.length];
        let color = r % 2 === 0 ? "red" : "blue";
        generatedBricks.push(new Brick(x, y, brickWidth, brickHeight, color, imageSrc));
        x += brickWidth + padding;
        imgIndex++;
      }
      y += brickHeight + padding;
    }
  } else if (theme === "diamond") {
    let rows = 7;
    let y = offsetTop;
    let mid = Math.floor(rows / 2);
    for (let r = 0; r < rows; r++) {
      let count = r <= mid ? r + 1 : rows - r;
      let x = ctx.canvas.width / 2 - (count * (brickWidth + padding)) / 2;
      for (let c = 0; c < count; c++) {
        const imageSrc = brickImagesSrc[imgIndex % brickImagesSrc.length];
        generatedBricks.push(
          new Brick(x, y, brickWidth, brickHeight, `hsl(${c * 50},70%,50%)`, imageSrc)
        );
        x += brickWidth + padding;
        imgIndex++;
      }
      y += brickHeight + padding;
    }
  }

  // load pics on bricks
  generatedBricks.forEach((brick) => {
    if (brick.imageSrc) {
      const img = new Image();
      img.src = brick.imageSrc;
      brick.image = img;
    }
  });

  bricks.length = 0;
  bricks.push(...generatedBricks);

  return bricks;
}

export let score = 0;
export let lives = 3;
export const ballState = {
  Launched: false
};