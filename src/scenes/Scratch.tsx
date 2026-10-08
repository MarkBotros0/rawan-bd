import { useEffect, useRef, useState } from 'react';

import { burst } from '../confetti';
import { content } from '../content';
import type { SceneProps } from './types';

/** Share of the foil that must be scratched off before the rest falls away. */
const REVEAL_AT = 0.5;
const BRUSH = 26;

export function Scratch({ onDone }: SceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, '#b8862d');
    g.addColorStop(0.35, '#ffe29a');
    g.addColorStop(0.55, '#d9a441');
    g.addColorStop(1, '#fff0c2');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    // Foil texture: a scatter of tiny sparkles.
    for (let i = 0; i < 260; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1.5, 1.5);
    }
    ctx.fillStyle = 'rgba(90,50,10,.75)';
    ctx.font = '800 18px Nunito, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH HERE', width / 2, height / 2 + 6);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = BRUSH * 2;
  }, []);

  useEffect(() => {
    if (revealed) burst({ x: 0.5, y: 0.45 });
  }, [revealed]);

  function point(e: React.PointerEvent<HTMLCanvasElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function scratchTo(e: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = canvasRef.current!.getContext('2d')!;
    const p = point(e);
    const from = last.current ?? p;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    if (++strokes.current % 12 === 0) checkCleared();
  }

  function checkCleared() {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0;
    // Sample every 16th pixel; plenty accurate and much cheaper.
    for (let i = 3; i < data.length; i += 64) if (data[i] === 0) clear++;
    if (clear / (data.length / 64) > REVEAL_AT) setRevealed(true);
  }

  return (
    <section className="scene scratch-scene">
      <h2 className="title">{revealed ? 'A coffee voucher!' : 'One more secret'}</h2>
      <p className="sub">{revealed ? 'Screenshot it and cash it in any day. Your mug, my treat.' : 'Scratch the gold with your finger.'}</p>

      <div className={`ticket ${revealed ? 'revealed' : ''}`}>
        <div className="secret">
          <span className="stamp">OFFICIAL</span>
          {content.scratchSecret.split('\n').map((line) => (
            <p key={line}>{line}</p>
          ))}
          <small>Valid for {content.name}. Expires never.</small>
        </div>
        <canvas
          ref={canvasRef}
          className="foil"
          onPointerDown={(e) => {
            drawing.current = true;
            last.current = null;
            e.currentTarget.setPointerCapture(e.pointerId);
            scratchTo(e);
          }}
          onPointerMove={(e) => drawing.current && scratchTo(e)}
          onPointerUp={() => {
            drawing.current = false;
            checkCleared();
          }}
          aria-label="Scratch card. Drag across it to reveal the message."
        />
      </div>

      {revealed ? (
        <button type="button" className="cta" onClick={onDone}>
          Next surprise
        </button>
      ) : (
        <button type="button" className="ghost" onClick={() => setRevealed(true)}>
          Just show me
        </button>
      )}
    </section>
  );
}
