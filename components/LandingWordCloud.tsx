'use client';

import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { WordFrequencyItem } from '@/lib/judol-keywords';
import { useViewportEntrance } from '@/lib/use-viewport-entrance';
import styles from './LandingWordCloud.module.css';

const positions = [[145, 55], [350, 50], [495, 60], [140, 124], [355, 120], [510, 138], [170, 191], [450, 196]] as const;

export function LandingWordCloud({ words }: { words: WordFrequencyItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [sequence, setSequence] = useState(0);
  useViewportEntrance(ref, sequence);

  return (
    <div className={styles.root} data-ui="landing-word-cloud">
      <div ref={ref} className={styles.cloud}>
        <svg viewBox="0 0 600 240" role="img" aria-label="Kata yang menonjol dalam contoh percakapan">
          {words.slice(0, positions.length).map((word, index) => {
            const [x, y] = positions[index];
            return (
              <text
                key={`${sequence}-${word.text}`}
                x={x}
                y={y}
                textAnchor="middle"
                fontSize={Math.min(42, 26 + word.value * 3)}
                fontWeight={600}
                fill={word.category === 'positif' ? 'var(--sn-positive)' : word.category === 'negatif' ? 'var(--sn-negative)' : 'var(--sn-ink)'}
                className={styles.word}
                style={{ '--word-delay': `${index * 700}ms` } as CSSProperties}
              >
                {word.text}
                <title>{`${word.text}: ${word.value} kali`}</title>
              </text>
            );
          })}
        </svg>
      </div>
      <button type="button" className={styles.replay} onClick={() => setSequence((value) => value + 1)}>
        Ulang animasi
      </button>
    </div>
  );
}
