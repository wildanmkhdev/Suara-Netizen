'use client';

import styles from './Report.module.css';

interface JudolThreatGaugeProps {
  score: number; // 0 to 100
}

export function JudolThreatGauge({ score }: JudolThreatGaugeProps) {
  const hasScore = Number.isFinite(score);
  const value = hasScore ? Math.min(100, Math.max(0, score)) : 0;
  const rounded = Math.round(value);
  const status = !hasScore
    ? 'Belum tersedia'
    : rounded === 0
      ? 'Belum terindikasi'
      : rounded >= 40
        ? 'Tinggi'
        : rounded >= 15
          ? 'Sedang'
          : 'Rendah';

  return (
    <section className={styles.panel} aria-label="Indikasi promosi" data-ui>
      <h3 className={styles.title}>Indikasi promosi</h3>
      <div className={styles.scoreLine}>
        <p className={styles.score}>
          <span className={styles.scoreValue}>{hasScore ? rounded : '—'}</span>
          <span className={styles.scoreUnit}>/100</span>
        </p>
        <span className={styles.scoreStatus}>{status}</span>
      </div>

      <div
        className={styles.riskTrack}
        role={hasScore ? 'meter' : undefined}
        aria-label={hasScore ? 'Skor indikasi promosi' : undefined}
        aria-valuemin={hasScore ? 0 : undefined}
        aria-valuemax={hasScore ? 100 : undefined}
        aria-valuenow={hasScore ? rounded : undefined}
        aria-valuetext={hasScore ? `${rounded} dari 100, ${status.toLowerCase()}` : undefined}
        aria-hidden={!hasScore || undefined}
      >
        <span className={styles.riskFill} style={{ width: `${value}%` }} />
      </div>
      <div className={styles.chartScale} aria-hidden="true">
        <span>0</span>
        <span>100</span>
      </div>

      <p className={styles.riskDescription}>
        Skor memperkirakan pola promosi perjudian dalam teks, bukan persentase akun
        atau bukti pelanggaran.
      </p>
    </section>
  );
}
