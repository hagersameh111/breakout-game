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

// --- Mobile touch: start-on-first-tap + drag paddle smoothly ---
let paddleTouched = false;
let touchOffsetX = 0;
let startedByTouch = false; // ensure first tap starts the game once

function clampPaddleX(x) {
  if (x < 0) return 0;
  if (x + paddle.width > canvas.width) return canvas.width - paddle.width;
  return x;
}

function handleTouchStart(e) {
  if (!e.touches || e.touches.length === 0) return;
  const rect = canvas.getBoundingClientRect();
  const t = e.touches[0];
  const touchX = t.clientX - rect.left;
  const touchY = t.clientY - rect.top;

  // first tap anywhere should start the game (emulate a short Space press)
  if (!startedByTouch) {
    startedByTouch = true;
    keys.space = true;
    // emulate brief key press so your game sees a "press"
    setTimeout(() => { keys.space = false; }, 120);
    // do not return — allow this same touch to begin a drag if it's on the paddle
  }

  // if the touch is on the paddle -> begin dragging
  if (
    touchX >= paddle.x &&
    touchX <= paddle.x + paddle.width &&
    touchY >= paddle.y &&
    touchY <= paddle.y + paddle.height
  ) {
    e.preventDefault(); // prevent page scrolling while dragging
    paddleTouched = true;
    touchOffsetX = touchX - paddle.x; // keep relative finger position on paddle

    // Sync mouse state so existing code that reads mouse.x/inside still works
    mouse.inside = true;
    mouse.x = touchX;
    // also set paddle.x immediately to avoid a visual jump
    paddle.x = clampPaddleX(touchX - touchOffsetX);
  }
}

function handleTouchMove(e) {
  if (!paddleTouched) return;
  if (!e.touches || e.touches.length === 0) return;
  e.preventDefault(); // keep page from scrolling while dragging

  const rect = canvas.getBoundingClientRect();
  const t = e.touches[0];
  const touchX = t.clientX - rect.left;

  // compute new paddle x and clamp
  const newPaddleX = clampPaddleX(touchX - touchOffsetX);
  paddle.x = newPaddleX;

  // keep mouse in sync (some game loops use mouse.x to move the paddle)
  mouse.x = newPaddleX + paddle.width / 2;
  mouse.inside = true;
}

function handleTouchEnd(e) {
  paddleTouched = false;
  mouse.inside = false;
  // do not change startedByTouch — the game should stay started
}

// attach listeners (passive: false for touchstart/touchmove so we can preventDefault)
canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
canvas.addEventListener("touchend", handleTouchEnd);
canvas.addEventListener("touchcancel", handleTouchEnd);
