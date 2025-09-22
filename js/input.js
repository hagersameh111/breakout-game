// Keyboard input
export const keys = {
  left: false,
  right: false,
  space: false
};

// Mouse input
export const mouse = {
  x: null,
  inside: false
};
// keyboard movement
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === " " || e.key === "Spacebar"){
    keys.space = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === " " || e.key === "Spacebar"){

    keys.space = false;
  }
});

const canvas = document.getElementById("myCanvas");

// --- Mouse Events (on canvas) ---
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.inside = (mouse.x >= 0 && mouse.x <= canvas.width);
});

canvas.addEventListener("mouseleave", () => {
  mouse.inside = false;
});

// --- Mouse Click (treat left click as Spacebar) ---
canvas.addEventListener("mousedown", (e) => {
  if (e.button === 0 ) { // 0 = left button
    keys.space = true;
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (e.button === 0) {
    
    keys.space = false;
  }
});

// --- Touch Support for Mobile ---
let paddleTouched = false;
let touchOffsetX = 0;

canvas.addEventListener("touchstart", (e) => {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const touchX = touch.clientX - rect.left;
  const touchY = touch.clientY - rect.top;

  // Start game on first tap (like Space)
  keys.space = true;

  // Check if paddle is touched
  if (
    touchX >= paddle.x &&
    touchX <= paddle.x + paddle.width &&
    touchY >= paddle.y &&
    touchY <= paddle.y + paddle.height
  ) {
    paddleTouched = true;
    touchOffsetX = touchX - paddle.x; // remember where finger touched
  }
});

canvas.addEventListener("touchmove", (e) => {
  if (!paddleTouched) return;
  e.preventDefault(); // stop screen scrolling on swipe

  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const touchX = touch.clientX - rect.left;

  // Move paddle with finger
  paddle.x = touchX - touchOffsetX;

  // Keep paddle inside canvas
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  }
});

canvas.addEventListener("touchend", () => {
  paddleTouched = false;
  keys.space = false; // reset tap
});
