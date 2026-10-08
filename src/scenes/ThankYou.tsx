import { useEffect, useState } from 'react';

import { burst, mentosRain } from '../confetti';
import { content } from '../content';
import type { SceneProps } from './types';

const items = content.thankYous;

export function ThankYou({ onDone }: SceneProps) {
  const [shown, setShown] = useState(0);
  const [promised, setPromised] = useState(false);
  const printed = shown >= items.length;

  useEffect(() => {
    if (!printed) return;
    burst({ x: 0.5, y: 0.3 });
    const t = setTimeout(mentosRain, 900);
    return () => clearTimeout(t);
  }, [printed]);

  if (printed) {
    return (
      <section className="scene thanks-scene">
        <h2 className="title">Thank you</h2>
        <p className="sub">For all of it. Here&apos;s the receipt.</p>
        <div className="receipt" role="table" aria-label="Thank-you receipt">
          <p className="r-head">RAWAN&apos;S DESK</p>
          <p className="r-meta">Open every day · Kindness included</p>
          <hr />
          {items.map((t) => (
            <div className="r-row" role="row" key={t.item}>
              <span role="cell">1× {t.item}</span>
              <span role="cell">{t.price}</span>
            </div>
          ))}
          <hr />
          <div className="r-row total" role="row">
            <span role="cell">TOTAL KINDNESS</span>
            <span role="cell">∞</span>
          </div>
          <div className="r-row" role="row">
            <span role="cell">Paid with</span>
            <span role="cell">{content.from}&apos;s thanks</span>
          </div>
          <button
            type="button"
            className={`r-row iou ${promised ? 'promised' : ''}`}
            onClick={() => {
              setPromised(true);
              navigator.vibrate?.([20, 30, 60]);
            }}
            aria-label={promised ? 'Mug promise stamped' : 'Tap to stamp the mug promise'}
          >
            <span>IOU: 1× {content.iou.item}</span>
            <span>{content.iou.when}</span>
            {promised && <span className="iou-stamp">PROMISED</span>}
          </button>
          {!promised && <p className="r-meta tap-me">↑ tap to make it official</p>}
          <hr />
          <p className="r-thanks">THANK YOU, {content.name.toUpperCase()}</p>
          <p className="r-meta">No refunds needed. Come again.</p>
          <div className="barcode" aria-hidden="true" />
        </div>
        <button type="button" className="cta" onClick={onDone}>
          Last one
        </button>
      </section>
    );
  }

  const t = items[shown];
  return (
    <section className="scene thanks-scene">
      <h2 className="title">The evidence</h2>
      <p className="sub">Things {content.name} did that did not go unnoticed.</p>

      <button
        type="button"
        key={shown}
        className="polaroid"
        style={{ ['--tilt' as string]: `${(shown % 2 ? 3 : -3)}deg` }}
        onClick={() => setShown((n) => n + 1)}
        aria-label={`${t.label}: ${t.caption} Tap for the next one.`}
      >
        <span className="exhibit">{t.label}</span>
        <span className="shot">
          {t.photo ? <img src={t.photo} alt="" /> : <Art kind={t.art} />}
        </span>
        <span className="caption">{t.caption}</span>
        <span className="rubber">{t.stamp}</span>
      </button>

      <p className="hint">{shown < items.length - 1 ? 'Tap for the next one' : 'Tap to print the receipt'}</p>
    </section>
  );
}

function Art({ kind }: { kind: string }) {
  if (kind === 'gum') {
    return (
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <rect width="200" height="200" fill="#fdeef2" />
        <g transform="rotate(-14 100 100)">
          <rect x="62" y="36" width="76" height="132" rx="8" fill="#ff6fa0" stroke="#1c0b21" strokeWidth="4" />
          <path d="M62 52 l10-10 10 10 10-10 10 10 10-10 10 10 10-10 6 6" fill="none" stroke="#e8e8ee" strokeWidth="9" />
          <circle cx="100" cy="122" r="22" fill="#2a5bd7" stroke="#1c0b21" strokeWidth="3" />
          <text x="100" y="130" textAnchor="middle" fontFamily="Bagel Fat One, sans-serif" fontSize="24" fill="#fff">e</text>
          <text x="100" y="92" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="11" fill="#fff">BUBBLEGUM</text>
        </g>
        <circle cx="152" cy="54" r="16" fill="#ffc0d6" stroke="#1c0b21" strokeWidth="3" />
        <circle cx="147" cy="49" r="4" fill="#fff" />
      </svg>
    );
  }
  if (kind === 'internet') {
    return (
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <rect width="200" height="200" fill="#eef4f6" />
        <rect x="40" y="88" width="120" height="70" rx="35" fill="#fff" stroke="#1c0b21" strokeWidth="4" />
        <circle cx="76" cy="123" r="24" fill="#1c0b21" />
        <rect x="112" y="98" width="30" height="10" rx="2" fill="#e4002b" />
        <g fill="none" stroke="#7be0c3" strokeWidth="7" strokeLinecap="round">
          <path d="M70 70 a40 40 0 0 1 60 0" />
          <path d="M82 56 a62 62 0 0 1 36 0" opacity=".6" />
        </g>
        <path d="M58 84 a56 56 0 0 1 84 0" fill="none" stroke="#7be0c3" strokeWidth="7" strokeLinecap="round" opacity=".35" />
        <circle cx="100" cy="80" r="5" fill="#7be0c3" />
        <rect x="70" y="117" width="12" height="7" rx="1.5" fill="none" stroke="#fff" strokeWidth="2" />
      </svg>
    );
  }
  if (kind === 'mentos') {
    return (
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <rect width="200" height="200" fill="#e9eef7" />
        <rect x="66" y="40" width="68" height="26" rx="6" fill="#fff" stroke="#1c0b21" strokeWidth="4" />
        <rect x="60" y="62" width="80" height="106" rx="12" fill="#fff" stroke="#1c0b21" strokeWidth="4" />
        <rect x="60" y="86" width="80" height="58" fill="#2f5fd0" stroke="#1c0b21" strokeWidth="3" />
        <text x="100" y="112" textAnchor="middle" fontFamily="Bagel Fat One, sans-serif" fontSize="17" fill="#fff">mentos</text>
        <text x="100" y="132" textAnchor="middle" fontFamily="Caveat, cursive" fontWeight="700" fontSize="18" fill="#fff">White</text>
        <rect x="66" y="74" width="30" height="9" rx="2" fill="#e4002b" />
        <path d="M150 46 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4z" fill="#ffc46b" stroke="#1c0b21" strokeWidth="2" />
        <text x="24" y="186" fontFamily="Caveat, cursive" fontSize="20" fill="#1c0b21">safe in my car</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <rect width="200" height="200" fill="#fff6e6" />
      <ellipse cx="100" cy="150" rx="78" ry="10" fill="#1c0b21" opacity=".12" />
      <path d="M24 118 q76-36 152 0 v14 q-76 22-152 0z" fill="#f0d79a" stroke="#1c0b21" strokeWidth="3.5" />
      <path d="M26 112 q74-14 148 0 q-6 10-14 6 q-10 8-20 0 q-10 8-20 0 q-10 8-20 0 q-10 8-20 0 q-10 8-20 0 q-10 8-20 0 q-8 6-14-6z" fill="#7cc46b" stroke="#1c0b21" strokeWidth="3" />
      <path d="M30 108 q70-22 140 0" fill="none" stroke="#f7c8a0" strokeWidth="10" strokeLinecap="round" />
      <path d="M22 104 q78-82 156 0 q-78-10-156 0z" fill="#d9a05b" stroke="#1c0b21" strokeWidth="3.5" />
      <g fill="#fff7dd">
        <ellipse cx="70" cy="74" rx="3" ry="1.6" /><ellipse cx="96" cy="64" rx="3" ry="1.6" />
        <ellipse cx="122" cy="70" rx="3" ry="1.6" /><ellipse cx="84" cy="86" rx="3" ry="1.6" />
        <ellipse cx="112" cy="84" rx="3" ry="1.6" /><ellipse cx="140" cy="84" rx="3" ry="1.6" />
      </g>
      <text x="152" y="44" fontFamily="Caveat, cursive" fontSize="22" fill="#1c0b21">tuna!</text>
    </svg>
  );
}
