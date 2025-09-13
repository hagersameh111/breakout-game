

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

//  brickslayout, hena mafrod 3la hasb l levels bs da bs demo 8ayro brahtko
export const bricks = [];
const rows = 5;
const cols = 8;
const brickWidth = 80;
const brickHeight = 20;
const padding = 10;
const offsetTop = 50;
const offsetLeft = 35;

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    bricks.push({
      x: c * (brickWidth + padding) + offsetLeft,
      y: r * (brickHeight + padding) + offsetTop,
      width: brickWidth,
      height: brickHeight,
      color: "blue",
      destroyed: false
    });
  }
}


export let score = 0;
export let lives = 3;
