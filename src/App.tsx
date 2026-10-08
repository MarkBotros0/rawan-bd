import { useState } from 'react';

import { Balloons } from './scenes/Balloons';
import { Cake } from './scenes/Cake';
import { Gift } from './scenes/Gift';
import { Letter } from './scenes/Letter';
import { Scratch } from './scenes/Scratch';
import { ThankYou } from './scenes/ThankYou';

const SCENES = [Gift, Cake, Balloons, Scratch, ThankYou, Letter];

export default function App() {
  // In dev, ?scene=N jumps straight to a scene for previewing.
  const [step, setStep] = useState(() =>
    import.meta.env.DEV ? Number(new URLSearchParams(location.search).get('scene') ?? 0) : 0,
  );
  const Scene = SCENES[step];
  const next = () => setStep((s) => Math.min(s + 1, SCENES.length - 1));
  const restart = () => setStep(0);

  return (
    <main className="app">
      <Sky />
      <nav className="progress" aria-label={`Part ${step + 1} of ${SCENES.length}`}>
        {SCENES.map((_, i) => (
          <span key={i} className={i < step ? 'done' : i === step ? 'now' : ''} />
        ))}
      </nav>
      <div className="stage" key={step}>
        <Scene onDone={next} onRestart={restart} />
      </div>
    </main>
  );
}

/** Twinkling stars behind every scene. Positions are fixed per load. */
function Sky() {
  const [stars] = useState(() =>
    Array.from({ length: 60 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      delay: Math.random() * 4,
    })),
  );
  return (
    <div className="sky" aria-hidden="true">
      {stars.map((s, i) => (
        <i
          key={i}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
