'use client';

import { useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useViewportEntrance } from '@/lib/use-viewport-entrance';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

export function ScrollReveal({ children, className = '', delayMs = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useViewportEntrance(ref);

  return (
    <div
      ref={ref}
      className={`scrollReveal ${className}`}
      style={{ '--sn-reveal-delay': `${delayMs}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
