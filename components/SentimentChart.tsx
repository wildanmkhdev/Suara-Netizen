'use client';

import { useState } from 'react';
import { BarChart3, PieChart, StretchHorizontal } from 'lucide-react';
import styles from './Report.module.css';

interface SentimentDistribution {
  positif: number;
  netral: number;
  negatif: number;
}

interface SentimentChartProps {
  distribution: SentimentDistribution;
}

type ChartMode = 'bar' | 'pie' | 'track';

const percentFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 1,
});
export function SentimentChart({ distribution }: SentimentChartProps) {
  const [mode, setMode] = useState<ChartMode>('bar');

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
      hexColor: 'var(--sn-positive)',
    },
    {
      name: 'Netral',
      value: net,
      percentage: hasData ? (net / total) * 100 : 0,
      className: styles.neutral,
      hexColor: 'var(--sn-control)',
    },
    {
      name: 'Negatif',
      value: neg,
      percentage: hasData ? (neg / total) * 100 : 0,
      className: styles.negative,
      hexColor: 'var(--sn-negative)',
    },
  ];

  // Hitung slice untuk Donut SVG (Radius = 40, Keliling = 251.327)
  const RADIUS = 40;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  let accumulatedPercent = 0;

  const donutSegments = data.map((item) => {
    const strokeDasharray = `${(item.percentage / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * CIRCUMFERENCE);
    accumulatedPercent += item.percentage;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  // Tentukan sentimen dominan
  const dominant = data.reduce((prev, curr) => (curr.value > prev.value ? curr : prev), data[0]);

  return (
    <section className={styles.panel} aria-label="Visualisasi sentimen" data-ui>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 className={styles.title}>Perkiraan sentimen</h3>
          <p className={styles.description}>Nada tanggapan dalam komentar yang dianalisis.</p>
        </div>

        {/* Chart View Switcher */}
        <div className={styles.chartTypeNav} role="tablist" aria-label="Pilihan visualisasi grafik">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'bar'}
            className={`${styles.chartTypeBtn} ${mode === 'bar' ? styles.chartTypeBtnActive : ''}`}
            onClick={() => setMode('bar')}
          >
            <BarChart3 size={15} aria-hidden="true" />
            Batang
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'pie'}
            className={`${styles.chartTypeBtn} ${mode === 'pie' ? styles.chartTypeBtnActive : ''}`}
            onClick={() => setMode('pie')}
          >
            <PieChart size={15} aria-hidden="true" />
            Donut / Pie
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'track'}
            className={`${styles.chartTypeBtn} ${mode === 'track' ? styles.chartTypeBtnActive : ''}`}
            onClick={() => setMode('track')}
          >
            <StretchHorizontal size={15} aria-hidden="true" />
            Pita
          </button>
        </div>
      </div>

      {/* 1. Tampilan Grafik Batang (Bar Chart) */}
      {mode === 'bar' && (
        <div className={styles.barChartWrap} role="region" aria-label="Grafik batang sentimen">
          {data.map((item) => (
            <div key={item.name} className={styles.barItem}>
              <div className={styles.barMeta}>
                <span className={styles.barName}>
                  <span className={`${styles.swatch} ${item.className}`} aria-hidden="true" />
                  {item.name}
                </span>
                <span className={styles.barVal}>{percentFormatter.format(item.percentage)}%</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={`${styles.barFill} ${item.className}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Tampilan Grafik Donut / Pie Chart */}
      {mode === 'pie' && (
        <div className={styles.donutChartWrap} role="region" aria-label="Grafik lingkaran sentimen">
          <div className={styles.donutSvgWrap}>
            <svg viewBox="0 0 100 100" className={styles.donutSvg} aria-hidden="true">
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke="var(--sn-surface)"
                strokeWidth="16"
              />
              {hasData &&
                donutSegments.map((seg) => (
                  <circle
                    key={seg.name}
                    cx="50"
                    cy="50"
                    r={RADIUS}
                    fill="none"
                    stroke={seg.hexColor}
                    strokeWidth="16"
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
        </div>
      )}

      {/* 3. Tampilan Pita Aliran (Track Stream) */}
      {mode === 'track' && (
        <>
          <div className={styles.sentimentTrack} aria-hidden="true">
            {data.map((item) => (
              <span
                key={item.name}
                className={`${styles.sentimentSegment} ${item.className}`}
                style={{ width: `${item.percentage}%` }}
              />
            ))}
          </div>
          <div className={styles.chartScale} aria-hidden="true">
            <span>0%</span>
            <span>100%</span>
          </div>
        </>
      )}

      {/* Breakdown Statistik */}
      <dl className={styles.sentimentBreakdown}>
        {data.map((item) => (
          <div key={item.name}>
            <dt className={styles.sentimentLabel}>
              <span className={`${styles.swatch} ${item.className}`} aria-hidden="true" />
              {item.name}
            </dt>
            <dd className={styles.sentimentValue}>
              {percentFormatter.format(item.percentage)}%
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
