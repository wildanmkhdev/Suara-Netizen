'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

export function ScrollReveal({ children, className = '', delayMs = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delayMs > 0) {
            setTimeout(() => setRevealed(true), delayMs);
          } else {
            setRevealed(true);
          }
          observer.disconnect();
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div
      ref={ref}
      className={`${className} ${revealed ? 'revealed' : 'revealPending'}`}
    >
      {children}
    </div>
  );
}
