import { useEffect, useRef, useState } from 'react';

import { celebrate } from '../confetti';
import { content } from '../content';
import { SingAlong } from './SingAlong';
import type { SceneProps } from './types';

/** Mic loudness (RMS, 0..1) that counts as blowing. */
const BLOW_THRESHOLD = 0.12;
/** How often a sustained blow puts out another candle. */
const BLOW_TICK_MS = 90;

type MicState = 'off' | 'asking' | 'on' | 'denied';

export function Cake({ onDone }: SceneProps) {
  const [lit, setLit] = useState<boolean[]>(() => Array(content.age).fill(true));
  const [mic, setMic] = useState<MicState>('off');
  const [blowing, setBlowing] = useState(false);
  const stopMic = useRef<() => void>(() => {});
  const remaining = lit.filter(Boolean).length;
  const done = remaining === 0;

  function snuffOne() {
    setLit((prev) => {
      const litIdx = prev.flatMap((on, i) => (on ? [i] : []));
      if (litIdx.length === 0) return prev;
      const pick = litIdx[Math.floor(Math.random() * litIdx.length)];
      const nextLit = [...prev];
      nextLit[pick] = false;
      return nextLit;
    });
  }

  function snuff(i: number) {
    setLit((prev) => prev.map((on, j) => (j === i ? false : on)));
    navigator.vibrate?.(10);
  }

  async function startMic() {
    setMic('asking');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const buf = new Float32Array(analyser.fftSize);
      let raf = 0;
      let lastTick = 0;
      const loop = (t: number) => {
        analyser.getFloatTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) sum += v * v;
        const rms = Math.sqrt(sum / buf.length);
        const isBlowing = rms > BLOW_THRESHOLD;
        setBlowing(isBlowing);
        if (isBlowing && t - lastTick > BLOW_TICK_MS) {
          lastTick = t;
          snuffOne();
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      stopMic.current = () => {
        cancelAnimationFrame(raf);
        stream.getTracks().forEach((tr) => tr.stop());
        void ctx.close();
      };
      setMic('on');
    } catch {
      setMic('denied');
    }
  }

  useEffect(() => () => stopMic.current(), []);

  useEffect(() => {
    if (!done) return;
    stopMic.current();
    celebrate();
  }, [done]);

  return (
    <section className="scene cake-scene">
      <h2 className="title">{done ? 'Wish made.' : 'Make a wish'}</h2>
      <p className="sub">
        {done
          ? "Don't tell anyone what it was."
          : mic === 'on'
            ? 'Now blow into your phone.'
            : `${remaining} candles. Blow them out, or tap them one by one.`}
      </p>

      <div className={`cake ${blowing && !done ? 'windy' : ''}`}>
        <div className="candles">
          {lit.map((on, i) => (
            <button
              key={i}
              type="button"
              className={`candle ${on ? 'lit' : 'out'}`}
              style={{ ['--h' as string]: `${18 + ((i * 7) % 11)}px`, ['--i' as string]: i }}
              onClick={() => on && snuff(i)}
              aria-label={on ? `Blow out candle ${i + 1}` : `Candle ${i + 1} is out`}
            >
              <span className="flame" />
              <span className="smoke" />
            </button>
          ))}
        </div>
        <div className="tier top"><span className="drip" /></div>
        <div className="tier bottom">
          <span className="cake-text">{content.age}</span>
        </div>
        <div className="plate" />
      </div>

      {done ? (
        <>
          <SingAlong />
          <button type="button" className="ghost" onClick={onDone}>
            Next surprise
          </button>
        </>
      ) : (
        mic !== 'on' && (
          <button type="button" className="ghost" onClick={startMic} disabled={mic === 'asking'}>
            {mic === 'denied' ? (
              'No mic? Tapping works too'
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <rect x="9" y="3" width="6" height="11" rx="3" />
                  <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                </svg>
                Use my breath
              </>
            )}
          </button>
        )
      )}
    </section>
  );
}
