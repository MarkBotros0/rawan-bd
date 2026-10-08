import confetti from 'canvas-confetti';

const COLORS = ['#ffc46b', '#ff8fa3', '#c9a7ff', '#7be0c3', '#fff3d6'];

export function burst(origin = { x: 0.5, y: 0.6 }) {
  confetti({ particleCount: 140, spread: 90, startVelocity: 45, origin, colors: COLORS });
}

/** A few seconds of confetti from both sides of the screen. */
export function celebrate(ms = 2500) {
  const end = Date.now() + ms;
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: COLORS });
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: COLORS });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
