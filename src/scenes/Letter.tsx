import { useEffect, useState } from 'react';

import { celebrate } from '../confetti';
import { content } from '../content';
import type { SceneProps } from './types';

const CHAR_MS = 32;
const PARAGRAPH_PAUSE_MS = 450;

export function Letter({ onRestart }: SceneProps) {
  const [opened, setOpened] = useState(false);
  const [para, setPara] = useState(0);
  const [chars, setChars] = useState(0);
  const finished = para >= content.letter.length;

  useEffect(() => {
    if (!opened || finished) return;
    const text = content.letter[para];
    if (chars < text.length) {
      const t = setTimeout(() => setChars((c) => c + 1), CHAR_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setPara((p) => p + 1);
      setChars(0);
    }, PARAGRAPH_PAUSE_MS);
    return () => clearTimeout(t);
  }, [opened, para, chars, finished]);

  useEffect(() => {
    if (finished) celebrate(4000);
  }, [finished]);

  function skip() {
    setPara(content.letter.length);
  }

  if (!opened) {
    return (
      <section className="scene letter-scene">
        <h2 className="title">You've got mail</h2>
        <p className="sub">From {content.from}.</p>
        <button type="button" className="envelope" onClick={() => setOpened(true)} aria-label="Open the letter">
          <span className="flap" />
          <span className="seal">R</span>
        </button>
        <p className="hint">Tap to open</p>
      </section>
    );
  }

  return (
    <section className="scene letter-scene">
      <article className="paper" onClick={finished ? undefined : skip}>
        {content.letter.map((text, i) =>
          i < para ? (
            <p key={i}>{text}</p>
          ) : i === para ? (
            <p key={i}>
              {text.slice(0, chars)}
              <span className="caret" />
            </p>
          ) : null,
        )}
        {finished && <p className="sign">— {content.from}</p>}
        {finished && (
          <figure className="taped">
            <img src={content.letterPhoto.src} alt={`${content.name} and ${content.from} smiling at work`} />
            <figcaption>{content.letterPhoto.caption}</figcaption>
          </figure>
        )}
      </article>

      {finished ? (
        <div className="finale">
          <p className="happy">Happy 25th, {content.name}.</p>
          <button type="button" className="ghost" onClick={onRestart}>
            Open it all again
          </button>
        </div>
      ) : (
        <p className="hint">Tap the letter to skip ahead</p>
      )}
    </section>
  );
}
