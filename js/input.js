import { ballState } from "./objects.js";

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

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if ((e.key === " " || e.key === "Spacebar") && !ballState.Launched){
    ballState.Launched = true;
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

// --- Mouse Events (on canvas) ---
const canvas = document.getElementById("myCanvas");

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
  if (e.button === 0 && !ballState.Launched) { // 0 = left button
    ballState.Launched = true;
    keys.space = true;
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (e.button === 0) {
    
    keys.space = false;
  }
});
