'use client';

import { useEffect } from 'react';
import type { RefObject } from 'react';

/** Arms one entrance when its content is visible; server-rendered content stays readable. */
export function useViewportEntrance<T extends Element>(
  ref: RefObject<T | null>,
  contentKey?: unknown,
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches || typeof IntersectionObserver === 'undefined') {
      element.setAttribute('data-entrance', 'static');
      return;
    }

    element.setAttribute('data-entrance', 'waiting');
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.setAttribute('data-entrance', 'running');
      observer.disconnect();
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    const reduceMotion = () => {
      if (!motion.matches) return;
      element.setAttribute('data-entrance', 'static');
      observer.disconnect();
    };

    observer.observe(element);
    motion.addEventListener('change', reduceMotion);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', reduceMotion);
    };
  }, [ref, contentKey]);
}
