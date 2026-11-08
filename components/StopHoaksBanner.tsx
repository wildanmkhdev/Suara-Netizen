import Image from 'next/image';
import styles from './StopHoaksBanner.module.css';

export function StopHoaksBanner() {
  return (
    <figure className={styles.poster}>
      <div className={styles.artwork}>
        <Image
          src="/images/stop-hoaks.svg"
          alt="STOP HOAKS pada jejak telapak tangan lima jari hitam-putih"
          width={560}
          height={640}
          loading="eager"
          unoptimized
        />
        <div className={styles.lettering} aria-hidden="true">
          <span>STOP</span>
          <span>HOAKS</span>
        </div>
      </div>
      <figcaption>Periksa dulu. Jangan buru-buru percaya.</figcaption>
    </figure>
  );
}
