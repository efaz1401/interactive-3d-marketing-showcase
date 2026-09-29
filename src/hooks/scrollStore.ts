// A tiny mutable scroll store so the R3F character can read scroll state inside
// useFrame without triggering React re-renders on every scroll event.

export const scroll = {
  y: 0, // smoothed scroll position (px)
  progress: 0, // 0..1 over the whole document
  velocity: 0,
};

export function setScroll(y: number, velocity = 0) {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  scroll.y = y;
  scroll.velocity = velocity;
  scroll.progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
}
