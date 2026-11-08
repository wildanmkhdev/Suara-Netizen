'use client';

import { PieChart as PieIcon } from 'lucide-react';
import styles from './Report.module.css';

interface SentimentDistribution {
  positif: number;
  netral: number;
  negatif: number;
}

interface SentimentPieChartProps {
  distribution: SentimentDistribution;
}

const percentFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 1,
});

export function SentimentPieChart({ distribution }: SentimentPieChartProps) {
  const pos = Math.max(0, distribution.positif || 0);
  const net = Math.max(0, distribution.netral || 0);
  const neg = Math.max(0, distribution.negatif || 0);
  const total = pos + net + neg;
  const hasData = total > 0;

  const data = [
    {
      name: 'Positif',
      value: pos,
      percentage: hasData ? (pos / total) * 100 : 0,
      className: styles.positive,
      hexColor: '#237454',
    },
    {
      name: 'Netral',
      value: net,
      percentage: hasData ? (net / total) * 100 : 0,
      className: styles.neutral,
      hexColor: '#b9bdb8',
    },
    {
      name: 'Negatif',
      value: neg,
      percentage: hasData ? (neg / total) * 100 : 0,
      className: styles.negative,
      hexColor: '#af4338',
    },
  ];

  // Hitung stroke-dasharray untuk SVG Donut Pie Chart (Radius = 40, Keliling = 251.327)
  const RADIUS = 40;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  let accumulated = 0;

  const segments = data.map((item) => {
    const strokeDasharray = `${(item.percentage / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
    const strokeDashoffset = -((accumulated / 100) * CIRCUMFERENCE);
    accumulated += item.percentage;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const dominant = data.reduce((prev, curr) => (curr.value > prev.value ? curr : prev), data[0]);

  return (
    <section className={styles.panel} aria-label="Diagram Lingkaran Sentimen" data-ui>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div>
          <h3 className={styles.title}>Diagram lingkaran (Pie chart)</h3>
          <p className={styles.description}>Proporsi pembagian nada sentimen warganet.</p>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
            background: 'var(--sn-surface)',
            color: 'var(--sn-ink)',
            border: '1px solid var(--sn-line)',
          }}
        >
          <PieIcon size={14} aria-hidden="true" />
          Pie Chart
        </span>
      </div>

      <div className={styles.donutChartWrap}>
        <div className={styles.donutSvgWrap}>
          <svg viewBox="0 0 100 100" className={styles.donutSvg} aria-hidden="true">
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="var(--sn-surface)"
              strokeWidth="18"
            />
            {hasData &&
              segments.map((seg) => (
                <circle
                  key={seg.name}
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  fill="none"
                  stroke={seg.hexColor}
                  strokeWidth="18"
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="butt"
                />
              ))}
          </svg>
          <div className={styles.donutCenter}>
            <span className={styles.donutCenterValue}>
              {percentFormatter.format(dominant.percentage)}%
            </span>
            <span className={styles.donutCenterLabel}>{dominant.name}</span>
          </div>
        </div>

        {/* Legenda Pie Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '130px' }}>
          {data.map((item) => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    background: item.hexColor,
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
                <span style={{ fontSize: '14px', color: 'var(--sn-ink)' }}>{item.name}</span>
              </div>
              <strong style={{ fontSize: '15px', color: 'var(--sn-ink)', fontVariantNumeric: 'tabular-nums' }}>
                {percentFormatter.format(item.percentage)}%
              </strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
