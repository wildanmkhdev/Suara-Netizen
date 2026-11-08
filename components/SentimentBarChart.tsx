'use client';

import { BarChart3 } from 'lucide-react';
import type { BuzzerStats } from '@/lib/analysis-types';
import styles from './Report.module.css';

interface SentimentDistribution {
  positif: number;
  netral: number;
  negatif: number;
}

interface SentimentBarChartProps {
  distribution: SentimentDistribution;
  buzzerStats?: BuzzerStats;
  judolScore?: number;
}

const percentFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 1,
});

export function SentimentBarChart({
  distribution,
  buzzerStats,
  judolScore = 0,
}: SentimentBarChartProps) {
  const pos = Math.max(0, distribution.positif || 0);
  const net = Math.max(0, distribution.netral || 0);
  const neg = Math.max(0, distribution.negatif || 0);
  const total = pos + net + neg;
  const hasData = total > 0;

  const sentimentData = [
    {
      name: 'Positif (Apresiasi / Dukungan)',
      value: pos,
      percentage: hasData ? (pos / total) * 100 : 0,
      className: styles.positive,
      hexColor: '#237454',
    },
    {
      name: 'Netral (Pertanyaan / Diskusi)',
      value: net,
      percentage: hasData ? (net / total) * 100 : 0,
      className: styles.neutral,
      hexColor: '#b9bdb8',
    },
    {
      name: 'Negatif (Kritik / Keresahan)',
      value: neg,
      percentage: hasData ? (neg / total) * 100 : 0,
      className: styles.negative,
      hexColor: '#af4338',
    },
  ];

  // Komposisi: Organik vs Buzzer vs Judol
  const buzzerPct = buzzerStats?.buzzer_percentage ?? 0;
  const judolPct = Math.min(100, Math.round(judolScore));
  const contaminationTotal = Math.min(100, buzzerPct + judolPct);
  const organicPct = Math.max(0, 100 - contaminationTotal);

  const compositionData = [
    {
      name: 'Opini Organik Warganet',
      percentage: organicPct,
      hexColor: '#237454',
    },
    {
      name: 'Indikasi Buzzer Bayaran / Bot',
      percentage: buzzerPct,
      hexColor: '#c25e00',
    },
    {
      name: 'Kontaminasi Promosi Judol',
      percentage: judolPct,
      hexColor: '#af4338',
    },
  ];

  return (
    <section className={styles.panel} aria-label="Grafik Batang Sentimen & Komposisi" data-ui>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div>
          <h3 className={styles.title}>Grafik batang (Bar chart)</h3>
          <p className={styles.description}>Volume komparasi sentimen dan komposisi warganet.</p>
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
          <BarChart3 size={14} aria-hidden="true" />
          Bar Chart
        </span>
      </div>

      {/* Bagian 1: Distribusi Sentimen */}
      <div style={{ marginTop: '18px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--sn-ink)', margin: '0 0 10px' }}>
          Distribusi Sentimen Warganet:
        </h4>
        <div className={styles.barChartWrap} style={{ marginTop: '8px' }}>
          {sentimentData.map((item) => (
            <div key={item.name} className={styles.barItem}>
              <div className={styles.barMeta}>
                <span className={styles.barName}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '2px',
                      background: item.hexColor,
                      display: 'inline-block',
                    }}
                    aria-hidden="true"
                  />
                  {item.name}
                </span>
                <span className={styles.barVal}>{percentFormatter.format(item.percentage)}%</span>
              </div>
              <div className={styles.barTrack} style={{ height: '16px' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${item.percentage}%`,
                    background: item.hexColor,
                    borderRadius: '3px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bagian 2: Komposisi Organik vs Buzzer vs Judol */}
      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--sn-line)' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--sn-ink)', margin: '0 0 10px' }}>
          Komposisi Kualitas Percakapan (Organik vs Manipulasi):
        </h4>
        <div className={styles.barChartWrap} style={{ marginTop: '8px' }}>
          {compositionData.map((item) => (
            <div key={item.name} className={styles.barItem}>
              <div className={styles.barMeta}>
                <span className={styles.barName}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '2px',
                      background: item.hexColor,
                      display: 'inline-block',
                    }}
                    aria-hidden="true"
                  />
                  {item.name}
                </span>
                <span className={styles.barVal}>{percentFormatter.format(item.percentage)}%</span>
              </div>
              <div className={styles.barTrack} style={{ height: '14px' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${item.percentage}%`,
                    background: item.hexColor,
                    borderRadius: '3px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
