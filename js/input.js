// Keyboard input
export const keys = {
  left: false,
  right: false,
  space: false
};

// Mouse / Touch pointer state (used for paddle follow)
export const mouse = {
  x: null,
  inside: false
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

const canvas = document.getElementById("myCanvas");

// ---- helper to map clientX to canvas coords, even if CSS-scaled ----
function canvasXFromClient(clientX) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  return (clientX - rect.left) * scaleX;
}

// =========================
//    POINTER (best path)
// =========================
if ("onpointerdown" in window) {
  // Disable default scrolling/zoom pan over the canvas for touch
  canvas.style.touchAction = "none";

  canvas.addEventListener("pointermove", (e) => {
    const x = canvasXFromClient(e.clientX);
    mouse.x = x;
    mouse.inside = x >= 0 && x <= canvas.width;
  });

  canvas.addEventListener("pointerenter", () => {
    mouse.inside = true;
  });

  canvas.addEventListener("pointerleave", () => {
    mouse.inside = false;
  });

  // Treat press as Space (launch)
  canvas.addEventListener("pointerdown", (e) => {
    if (e.isPrimary) keys.space = true;
  });

  canvas.addEventListener("pointerup", (e) => {
    if (e.isPrimary) keys.space = false;
  });

  canvas.addEventListener("pointercancel", () => {
    keys.space = false;
  });

} else {
  // =========================
  //   MOUSE (fallback)
  // =========================
  canvas.addEventListener("mousemove", (e) => {
    const x = canvasXFromClient(e.clientX);
    mouse.x = x;
    mouse.inside = x >= 0 && x <= canvas.width;
  });

  canvas.addEventListener("mouseleave", () => {
    mouse.inside = false;
  });

  canvas.addEventListener("mousedown", (e) => {
    if (e.button === 0) keys.space = true;
  });

  canvas.addEventListener("mouseup", (e) => {
    if (e.button === 0) keys.space = false;
  });

  // =========================
  //   TOUCH (fallback)
  // =========================
  // Use {passive:false} so we can prevent scroll while dragging
  const touchOpts = { passive: false };

  canvas.addEventListener("touchstart", (e) => {
    if (e.touches.length > 0) {
      const x = canvasXFromClient(e.touches[0].clientX);
      mouse.x = x;
      mouse.inside = true;
      keys.space = true; // tap = launch
    }
    e.preventDefault();
  }, touchOpts);

  canvas.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      const x = canvasXFromClient(e.touches[0].clientX);
      mouse.x = x;
      mouse.inside = x >= 0 && x <= canvas.width;
    }
    e.preventDefault();
  }, touchOpts);

  canvas.addEventListener("touchend", (e) => {
    keys.space = false;
    if (e.touches.length === 0) mouse.inside = false;
    e.preventDefault();
  }, touchOpts);

  canvas.addEventListener("touchcancel", (e) => {
    keys.space = false;
    mouse.inside = false;
    e.preventDefault();
  }, touchOpts);
}