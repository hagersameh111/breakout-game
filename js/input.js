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
let touchStartX = null;

canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  touchStartX = touch.clientX - rect.left;

  // Treat tap as "space" (like mouse click / launch ball)
  keys.space = true;
});

canvas.addEventListener("touchend", () => {
  touchStartX = null;
  keys.space = false;
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault(); // prevent page scrolling
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const currentX = touch.clientX - rect.left;

  // Directly move paddle (like mouse.x)
  mouse.x = currentX;
  mouse.inside = (mouse.x >= 0 && mouse.x <= canvas.width);

  // Or detect swipe direction:
  if (touchStartX !== null) {
    const diffX = currentX - touchStartX;
    if (diffX > 30) {
      keys.right = true;
      keys.left = false;
    } else if (diffX < -30) {
      keys.left = true;
      keys.right = false;
    }
  }
}, { passive: false });
