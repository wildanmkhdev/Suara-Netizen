'use client';

import { useRef } from 'react';
import styles from '@/app/page.module.css';

export function MobileNav() {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const closeMenu = () => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  return (
    <details ref={detailsRef} className={styles.mobileMenu}>
      <summary>Menu</summary>
      <nav aria-label="Navigasi seluler">
        <a href="#fitur" onClick={closeMenu}>Fitur</a>
        <a href="#cara-kerja" onClick={closeMenu}>Cara pakai</a>
        <a href="#bantuan" onClick={closeMenu}>Bantuan</a>
        <a href="#pindai" onClick={closeMenu}>Coba analisis</a>
      </nav>
    </details>
  );
}
