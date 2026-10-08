import { useEffect, useRef, useState } from 'react';

import { burst } from '../confetti';
import { content } from '../content';
import type { SceneProps } from './types';

const COLORS = ['#ff8fa3', '#ffc46b', '#c9a7ff', '#7be0c3', '#ff9e6b', '#8ec5ff'];
const GOAL = content.balloonWords.length;
const SPAWN_MS = 650;
const MAX_ON_SCREEN = 7;

type Balloon = { id: number; x: number; color: string; duration: number; sway: number };
type Pop = { id: number; x: number; y: number; word: string };

export function Balloons({ onDone }: SceneProps) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [pops, setPops] = useState<Pop[]>([]);
  const [popped, setPopped] = useState(0);
  const nextId = useRef(0);
  const done = popped >= GOAL;

  useEffect(() => {
    if (done) return;
    const timer = setInterval(() => {
      setBalloons((bs) => {
        if (bs.length >= MAX_ON_SCREEN) return bs;
        const id = nextId.current++;
        return [
          ...bs,
          {
            id,
            x: 6 + Math.random() * 78,
            color: COLORS[id % COLORS.length],
            duration: 5 + Math.random() * 3,
            sway: (Math.random() - 0.5) * 40,
          },
        ];
      });
    }, SPAWN_MS);
    return () => clearInterval(timer);
  }, [done]);

  useEffect(() => {
    if (done) burst({ x: 0.5, y: 0.4 });
  }, [done]);

  function pop(b: Balloon, e: React.PointerEvent<HTMLButtonElement>) {
    const field = e.currentTarget.parentElement!.getBoundingClientRect();
    const rect = e.currentTarget.getBoundingClientRect();
    const word = content.balloonWords[popped % GOAL];
    setBalloons((bs) => bs.filter((x) => x.id !== b.id));
    setPops((ps) => [
      ...ps,
      { id: b.id, x: rect.left - field.left + rect.width / 2, y: rect.top - field.top, word },
    ]);
    setPopped((n) => n + 1);
    navigator.vibrate?.(15);
  }

  return (
    <section className="scene balloon-scene">
      <h2 className="title">{done ? '25 for 25' : 'Pop 25 balloons'}</h2>
      <p className="sub">
        {done ? 'One word for every year. All of them true.' : 'Each one is hiding a word about you.'}
      </p>
      <div className="counter" aria-live="polite">
        <b>{Math.min(popped, GOAL)}</b> / {GOAL}
      </div>

      <div className="field">
        {balloons.map((b) => (
          <button
            key={b.id}
            type="button"
            className="balloon"
            style={{
              left: `${b.x}%`,
              ['--c' as string]: b.color,
              ['--d' as string]: `${b.duration}s`,
              ['--sway' as string]: `${b.sway}px`,
            }}
            onPointerDown={(e) => pop(b, e)}
            onAnimationEnd={() => setBalloons((bs) => bs.filter((x) => x.id !== b.id))}
            aria-label="Pop balloon"
          >
            <span className="string" />
          </button>
        ))}
        {pops.map((p) => (
          <span
            key={p.id}
            className="pop-word"
            style={{ left: p.x, top: p.y }}
            onAnimationEnd={() => setPops((ps) => ps.filter((x) => x.id !== p.id))}
          >
            {p.word}
          </span>
        ))}
        {done && (
          <ul className="word-cloud">
            {content.balloonWords.map((w, i) => (
              <li key={w} style={{ ['--i' as string]: i }}>{w}</li>
            ))}
          </ul>
        )}
      </div>

      {done && (
        <button type="button" className="cta" onClick={onDone}>
          Next surprise
        </button>
      )}
    </section>
  );
}
