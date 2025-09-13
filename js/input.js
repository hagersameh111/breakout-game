// Keyboard input
export const keys = {
  left: false,
  right: false,
  space: false
};

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === " " || e.key === "Spacebar") keys.space = true;
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === " " || e.key === "Spacebar") keys.space = false;
});

