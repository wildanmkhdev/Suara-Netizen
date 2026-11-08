'use client';

import { Users, AlertTriangle } from 'lucide-react';
import type { BuzzerStats } from '@/lib/analysis-types';
import styles from './Report.module.css';

interface BuzzerDetectionCardProps {
  stats?: BuzzerStats;
}

export function BuzzerDetectionCard({ stats }: BuzzerDetectionCardProps) {
  const percentage = stats?.buzzer_percentage ?? 0;
  const count = stats?.buzzer_count ?? 0;
  const clustersCount = stats?.duplicate_clusters_count ?? 0;
  const topTemplates = stats?.top_templates ?? [];

  const status =
    percentage === 0
      ? 'Tidak terdeteksi'
      : percentage >= 35
        ? 'Tinggi / Terkoordinasi'
        : percentage >= 15
          ? 'Sedang'
          : 'Rendah';

  return (
    <section className={styles.panel} aria-label="Indikasi buzzer & komentar bayaran" data-ui>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <h3 className={styles.title}>Indikasi buzzer bayaran</h3>
        <span className={styles.buzzerBadge}>
          <Users size={14} aria-hidden="true" />
          Astroturfing
        </span>
      </div>

      <div className={styles.scoreLine}>
        <p className={styles.score}>
          <span className={styles.scoreValue} style={{ color: percentage > 15 ? '#c25e00' : 'var(--sn-ink)' }}>
            {percentage}%
          </span>
          <span className={styles.scoreUnit}>
            ({count.toLocaleString('id-ID')} komentar serupa/template)
          </span>
        </p>
        <span className={styles.scoreStatus}>{status}</span>
      </div>

      <div
        className={styles.riskTrack}
        role="meter"
        aria-label="Persentase indikasi buzzer"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
      >
        <span
          className={styles.riskFill}
          style={{
            width: `${percentage}%`,
            background: '#c25e00',
          }}
        />
      </div>

      <div className={styles.chartScale} aria-hidden="true">
        <span>0%</span>
        <span>100%</span>
      </div>

      <p className={styles.riskDescription}>
        {percentage > 0
          ? `Terdeteksi ${clustersCount} kelompok variasi template komentar dengan kesamaan semantik tinggi. Akun buzzer umumnya menggunakan susunan kata serupa untuk mendominasi percakapan publik.`
          : 'Pola komentar tampak bervariasi secara alami. Tidak terdeteksi indikasi template komentar berulang atau astroturfing massal.'}
      </p>

      {topTemplates.length > 0 && (
        <div className={styles.templateBox}>
          <p className={styles.templateTitle}>
            <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '6px' }} />
            Contoh Pola Template Serupa yang Ditemukan:
          </p>
          <ul className={styles.templateList}>
            {topTemplates.slice(0, 3).map((tpl, i) => (
              <li key={i} className={styles.templateItem}>
                <span>“{tpl.template}”</span>
                <span className={styles.templateCount}>{tpl.count}x terulang</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
