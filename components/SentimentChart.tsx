'use client';

import styles from './Report.module.css';

interface SentimentDistribution {
  positif: number;
  netral: number;
  negatif: number;
}

interface SentimentChartProps {
  distribution: SentimentDistribution;
}

const percentFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 1,
});

function nonNegative(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function SentimentChart({ distribution }: SentimentChartProps) {
  const data = [
    { name: 'Positif', value: nonNegative(distribution.positif), className: styles.positive },
    { name: 'Netral', value: nonNegative(distribution.netral), className: styles.neutral },
    { name: 'Negatif', value: nonNegative(distribution.negatif), className: styles.negative },
  ];
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const hasData = total > 0;

  return (
    <section className={styles.panel} aria-label="Perkiraan sentimen" data-ui>
      <h3 className={styles.title}>Perkiraan sentimen</h3>
      <p className={styles.description}>Nada tanggapan dalam komentar yang dianalisis.</p>

      <div className={styles.sentimentTrack} aria-hidden="true">
        {data.map((item) => (
          <span
            key={item.name}
            className={`${styles.sentimentSegment} ${item.className}`}
            style={{ width: `${hasData ? (item.value / total) * 100 : 0}%` }}
          />
        ))}
      </div>
      <div className={styles.chartScale} aria-hidden="true">
        <span>0%</span>
        <span>100%</span>
      </div>

      <dl className={styles.sentimentBreakdown}>
        {data.map((item) => (
          <div key={item.name}>
            <dt className={styles.sentimentLabel}>
              <span className={`${styles.swatch} ${item.className}`} aria-hidden="true" />
              {item.name}
            </dt>
            <dd className={styles.sentimentValue}>
              {percentFormatter.format(hasData ? (item.value / total) * 100 : 0)}%
            </dd>
          </div>
        ))}
      </dl>

      {!hasData && (
        <p className={styles.emptyNote}>Belum ada data sentimen untuk dihitung.</p>
      )}
    </section>
  );
}
