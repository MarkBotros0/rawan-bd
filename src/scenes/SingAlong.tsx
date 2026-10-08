import { useEffect, useRef, useState } from 'react';

import { burst } from '../confetti';
import { content } from '../content';

/**
 * "Happy Birthday" played by a little music box, with her own voice saying her
 * name on the "dear ___" line. The recording only ever lives in this page's
 * memory: nothing is uploaded or stored.
 */

const BEAT = 0.42; // seconds per beat (3/4 time)
const RECORD_MS = 2500;

type Note = { f: number; beats: number; word: string };
const G4 = 392, A4 = 440, B4 = 493.88, C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99;

const LINES: Note[][] = [
  [
    { f: G4, beats: 0.75, word: 'Hap' }, { f: G4, beats: 0.25, word: 'py' }, { f: A4, beats: 1, word: 'birth' },
    { f: G4, beats: 1, word: 'day' }, { f: C5, beats: 1, word: 'to' }, { f: B4, beats: 2, word: 'you' },
  ],
  [
    { f: G4, beats: 0.75, word: 'Hap' }, { f: G4, beats: 0.25, word: 'py' }, { f: A4, beats: 1, word: 'birth' },
    { f: G4, beats: 1, word: 'day' }, { f: D5, beats: 1, word: 'to' }, { f: C5, beats: 2, word: 'you' },
  ],
  [
    { f: G4, beats: 0.75, word: 'Hap' }, { f: G4, beats: 0.25, word: 'py' }, { f: G5, beats: 1, word: 'birth' },
    { f: E5, beats: 1, word: 'day,' }, { f: C5, beats: 1, word: 'dear' },
    // The name: her recording plays here instead of these notes (if she recorded one).
    { f: B4, beats: 1, word: '' }, { f: A4, beats: 2, word: '' },
  ],
  [
    { f: F5, beats: 0.75, word: 'Hap' }, { f: F5, beats: 0.25, word: 'py' }, { f: E5, beats: 1, word: 'birth' },
    { f: C5, beats: 1, word: 'day' }, { f: D5, beats: 1, word: 'to' }, { f: C5, beats: 2, word: 'you!' },
  ],
];

/** Syllables that continue into the next one, so no space follows them. */
const MID_WORD = new Set(['Hap', 'birth']);

type Stage = 'intro' | 'recording' | 'ready' | 'playing' | 'done';

export function SingAlong() {
  const [stage, setStage] = useState<Stage>('intro');
  const [error, setError] = useState('');
  const [level, setLevel] = useState(0);
  const [cursor, setCursor] = useState<{ line: number; word: number } | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const voice = useRef<AudioBuffer | null>(null);
  const [hasVoice, setHasVoice] = useState(false);
  const cleanup = useRef<() => void>(() => {});

  useEffect(() => () => cleanup.current(), []);

  function audio() {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    void ctxRef.current.resume();
    return ctxRef.current;
  }

  async function record() {
    setError('');
    const ctx = audio();
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("The mic is blocked, so I'll play it without your voice.");
      setStage('ready');
      return;
    }
    setStage('recording');

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const buf = new Float32Array(analyser.fftSize);
    let raf = 0;
    const meter = () => {
      analyser.getFloatTimeDomainData(buf);
      let peak = 0;
      for (const v of buf) peak = Math.max(peak, Math.abs(v));
      setLevel(Math.min(1, peak * 2.5));
      raf = requestAnimationFrame(meter);
    };
    raf = requestAnimationFrame(meter);

    const chunks: Blob[] = [];
    const rec = new MediaRecorder(stream);
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const stopAll = () => {
      cancelAnimationFrame(raf);
      stream.getTracks().forEach((t) => t.stop());
    };
    cleanup.current = stopAll;
    rec.onstop = async () => {
      stopAll();
      setLevel(0);
      try {
        const raw = await new Blob(chunks, { type: rec.mimeType }).arrayBuffer();
        const decoded = await ctx.decodeAudioData(raw);
        voice.current = trimSilence(ctx, decoded);
        setHasVoice(!!voice.current);
        if (!voice.current) setError("I couldn't hear anything. Try again, a bit louder?");
      } catch {
        setError("That recording didn't work. Try again?");
      }
      setStage('ready');
    };
    rec.start();
    setTimeout(() => rec.state === 'recording' && rec.stop(), RECORD_MS);
  }

  function preview() {
    const ctx = audio();
    if (!voice.current) return;
    const src = ctx.createBufferSource();
    src.buffer = voice.current;
    const g = ctx.createGain();
    g.gain.value = 1.8;
    src.connect(g).connect(ctx.destination);
    src.start();
  }

  function play() {
    cleanup.current();
    const ctx = audio();
    const out = ctx.createGain();
    out.gain.value = 0.55; // a little softer so the voice sits on top
    out.connect(ctx.destination);

    const start = ctx.currentTime + 0.3;
    let t = start;
    const marks: { at: number; line: number; word: number }[] = [];

    LINES.forEach((line, li) => {
      line.forEach((n, wi) => {
        const isName = li === 2 && wi >= 5;
        if (isName && voice.current) {
          if (wi === 5) {
            // Her voice, with a soft chord underneath so it still sounds like the song.
            const v = ctx.createBufferSource();
            v.buffer = voice.current;
            const comp = ctx.createDynamicsCompressor();
            comp.threshold.value = -24;
            comp.ratio.value = 6;
            const vg = ctx.createGain();
            vg.gain.value = 1.8;
            // Straight to the speakers, not through the softer music bus.
            v.connect(comp).connect(vg).connect(ctx.destination);
            v.start(t + 0.05);
            const span = Math.max(3 * BEAT, voice.current.duration + 0.35);
            pad(ctx, out, [B4 / 2, D5 / 2, G4], t, span);
            marks.push({ at: t, line: li, word: wi });
            t += span;
          }
          return;
        }
        musicBox(ctx, out, n.f, t, n.beats * BEAT);
        marks.push({ at: t, line: li, word: wi });
        t += n.beats * BEAT;
      });
      t += BEAT * 0.15;
    });

    setStage('playing');
    // iPhones only allow speech that starts inside the tap, so the first syllable goes right away.
    sing(LINES[0][0].word, LINES[0][0].f);
    let raf = 0;
    let lastKey = '';
    let celebrated = false;
    const tick = () => {
      const now = ctx.currentTime;
      const current = [...marks].reverse().find((m) => m.at <= now);
      if (current) {
        const key = `${current.line}-${current.word}`;
        if (key !== lastKey) {
          lastKey = key;
          setCursor({ line: current.line, word: current.word });
          const note = LINES[current.line][current.word];
          const isName = current.line === 2 && current.word >= 5;
          if (isName) {
            if (!voice.current && current.word === 5) sing(content.nickname, note.f, 0.9);
          } else if (current.line + current.word > 0) {
            sing(note.word, note.f);
          }
          if (current.line === 2 && current.word === 5 && !celebrated) {
            celebrated = true;
            burst({ x: 0.5, y: 0.55 });
          }
        }
      }
      if (now < t + 0.6) raf = requestAnimationFrame(tick);
      else {
        setStage('done');
        setCursor(null);
      }
    };
    raf = requestAnimationFrame(tick);
    cleanup.current = () => {
      cancelAnimationFrame(raf);
      void out.disconnect();
      window.speechSynthesis?.cancel();
    };
  }

  return (
    <div className="sing">
      {stage === 'intro' && (
        <>
          <p className="sing-lead">Want your own birthday song?</p>
          <p className="sing-sub">Say your name into the mic, and I&apos;ll sing the rest.</p>
          <button type="button" className="cta" onClick={record}>
            <MicIcon /> Record my name
          </button>
          <button type="button" className="link" onClick={() => setStage('ready')}>
            Skip, just play the song
          </button>
        </>
      )}

      {stage === 'recording' && (
        <>
          <p className="sing-lead">Say “{content.nickname}”!</p>
          <div className="meter" aria-hidden="true">
            <span style={{ transform: `scaleX(${Math.max(0.04, level)})` }} />
          </div>
          <p className="sing-sub">Listening…</p>
        </>
      )}

      {stage === 'ready' && (
        <>
          {error && <p className="sing-sub">{error}</p>}
          <p className="sing-lead">{hasVoice ? 'Got it. Sounds great.' : 'Ready when you are.'}</p>
          <p className="sing-sub small">Sound on. If your phone is on silent, flip the switch first.</p>
          <button type="button" className="cta" onClick={play}>
            <SpeakerIcon /> Play my song
          </button>
          <div className="sing-row">
            {hasVoice && (
              <button type="button" className="link" onClick={preview}>Hear my recording</button>
            )}
            <button type="button" className="link" onClick={record}>
              {hasVoice ? 'Record again' : 'Record my name'}
            </button>
          </div>
        </>
      )}

      {(stage === 'playing' || stage === 'done') && (
        <div className="lyrics" aria-live="polite">
          {LINES.map((line, li) => (
            <p key={li} className={cursor?.line === li ? 'on' : ''}>
              {line.map((n, wi) => {
                const isName = li === 2 && wi === 5;
                if (li === 2 && wi === 6) return null;
                const lit = cursor && (cursor.line > li || (cursor.line === li && cursor.word >= wi));
                return (
                  <span key={wi} className={`${lit ? 'lit' : ''} ${isName ? 'name' : ''}`}>
                    {isName ? content.nickname : n.word}
                    {MID_WORD.has(n.word) ? '' : ' '}
                  </span>
                );
              })}
            </p>
          ))}
          {stage === 'done' && (
            <button type="button" className="link" onClick={play}>Play it again</button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * "Sing" one syllable with the phone's text-to-speech voice. Speech voices
 * can't hold a note, but their pitch can follow the melody: G4..G5 maps onto
 * the voice's 0.6..2 pitch range. Anything still talking is cut off so the
 * voice stays on the beat.
 */
function sing(syllable: string, freq: number, rate = 1.25) {
  const synth = window.speechSynthesis;
  if (!synth || !syllable) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(syllable.replace(/[,!]/g, ''));
  const english = synth.getVoices().find((v) => v.lang.startsWith('en'));
  if (english) u.voice = english;
  u.lang = 'en-US';
  const octave = Math.log2(freq / G4); // 0 at G4, 1 at G5
  u.pitch = Math.min(2, 0.6 + octave * 1.4);
  u.rate = rate;
  u.volume = 1;
  synth.speak(u);
}

/** A plucked music-box note: a bright sine with a quick attack and a long ring. */
function musicBox(ctx: AudioContext, out: AudioNode, f: number, at: number, len: number) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(0.35, at + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, at + Math.max(0.5, len * 1.6));
  g.connect(out);
  for (const [mult, amp] of [[1, 1], [2, 0.35], [3.01, 0.12]] as const) {
    const o = ctx.createOscillator();
    const og = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = f * mult;
    og.gain.value = amp;
    o.connect(og).connect(g);
    o.start(at);
    o.stop(at + Math.max(0.6, len * 1.7));
  }
}

/** A soft held chord under her voice. */
function pad(ctx: AudioContext, out: AudioNode, freqs: number[], at: number, len: number) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.linearRampToValueAtTime(0.09, at + 0.25);
  g.gain.setValueAtTime(0.09, at + len - 0.3);
  g.gain.linearRampToValueAtTime(0.0001, at + len);
  g.connect(out);
  for (const f of freqs) {
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.value = f;
    o.connect(g);
    o.start(at);
    o.stop(at + len);
  }
}

/** Cut the quiet before and after her voice, so the name lands on the beat. */
function trimSilence(ctx: AudioContext, buf: AudioBuffer): AudioBuffer | null {
  const data = buf.getChannelData(0);
  const win = Math.floor(buf.sampleRate * 0.02);
  const loud = (i: number) => {
    let sum = 0;
    for (let j = i; j < Math.min(i + win, data.length); j++) sum += data[j] * data[j];
    return Math.sqrt(sum / win) > 0.02;
  };
  let first = -1;
  let last = -1;
  for (let i = 0; i < data.length; i += win) {
    if (loud(i)) {
      if (first < 0) first = i;
      last = i + win;
    }
  }
  if (first < 0) return null;
  const pad = Math.floor(buf.sampleRate * 0.06);
  const from = Math.max(0, first - pad);
  const to = Math.min(data.length, last + pad);
  const clip = data.slice(from, to);
  // Phone mics record quietly; scale so the loudest moment is near full volume.
  let peak = 0;
  for (const v of clip) peak = Math.max(peak, Math.abs(v));
  const boost = Math.min(12, 0.95 / Math.max(peak, 1e-4));
  for (let i = 0; i < clip.length; i++) clip[i] *= boost;
  const out = ctx.createBuffer(1, clip.length, buf.sampleRate);
  out.copyToChannel(clip, 0);
  return out;
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 4V5L8 9z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}
