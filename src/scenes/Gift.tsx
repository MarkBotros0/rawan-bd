import { useState } from 'react';

import { burst } from '../confetti';
import { content } from '../content';
import type { SceneProps } from './types';

const TAPS_TO_OPEN = 3;
const HINTS = ['Tap the box', 'Harder', 'One more…'];

export function Gift({ onDone }: SceneProps) {
  const [taps, setTaps] = useState(0);
  const open = taps >= TAPS_TO_OPEN;

  function tap() {
    if (open) return;
    const n = taps + 1;
    setTaps(n);
    navigator.vibrate?.(n === TAPS_TO_OPEN ? [30, 40, 80] : 25);
    if (n === TAPS_TO_OPEN) setTimeout(() => burst({ x: 0.5, y: 0.5 }), 250);
  }

  return (
    <section className="scene gift-scene">
      {!open && <p className="kicker">{content.giftTag}</p>}

      <button
        type="button"
        className={`gift ${open ? 'open' : ''}`}
        data-taps={taps}
        onClick={tap}
        aria-label={open ? 'Opened gift' : 'Tap to open the gift'}
      >
        <span className="lid"><span className="bow" /></span>
        <span className="box" />
        <span className="ribbon" />
      </button>

      {open ? (
        <div className="reveal">
          <h1 className="big-name">
            {content.name}
            <span className="age">is {content.age}</span>
          </h1>
          <p className="sub">Five little surprises inside. Ready?</p>
          <button type="button" className="cta" onClick={onDone}>
            Let&apos;s go
          </button>
        </div>
      ) : (
        <p className="hint">{HINTS[taps]}</p>
      )}
    </section>
  );
}
