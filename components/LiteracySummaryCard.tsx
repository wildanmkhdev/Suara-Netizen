'use client';

import { Lightbulb, Info } from 'lucide-react';
import type { ExecutiveSummaryStructured } from '@/lib/analysis-types';
import styles from './Report.module.css';

interface LiteracySummaryCardProps {
  summary: string;
  judolScore: number;
  keywords: string[];
  structured?: ExecutiveSummaryStructured;
  sampleNote?: string;
}

export function LiteracySummaryCard({
  summary,
  judolScore,
  keywords,
  structured,
  sampleNote,
}: LiteracySummaryCardProps) {
  const hasSummary = summary.trim().length > 0;
  const displayedKeywords = keywords?.slice(0, 8) ?? [];
  const additionalKeywords = Math.max(0, (keywords?.length ?? 0) - displayedKeywords.length);

  return (
    <section className={styles.panel} aria-label="Ringkasan otomatis & rekomendasi solusi" data-ui>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <h3 className={styles.title}>Ringkasan analisis & solusi</h3>
      </div>

      {sampleNote && (
        <div className={styles.sampleNotice} role="note">
          <Info size={15} style={{ flexShrink: 0 }} aria-hidden="true" />
          <span>{sampleNote}</span>
        </div>
      )}

      {/* Ringkasan Utama */}
      <p className={hasSummary ? styles.summaryText : styles.emptyNote}>
        {hasSummary ? summary : 'Belum ada ringkasan untuk komentar ini.'}
      </p>

      {/* Rincian Analisa Opini Publik & Buzzer jika tersedia */}
      {structured?.sentiment_analysis && (
        <p className={styles.summaryGuidance} style={{ marginTop: '12px' }}>
          <strong>Sentimen Warganet: </strong>
          {structured.sentiment_analysis}
        </p>
      )}

      {structured?.buzzer_analysis && (
        <p className={styles.summaryGuidance} style={{ marginTop: '8px' }}>
          <strong>Analisis Buzzer & Bot: </strong>
          {structured.buzzer_analysis}
        </p>
      )}

      {/* Solusi & Rekomendasi Tindakan */}
      {structured?.solutions && structured.solutions.length > 0 && (
        <div className={styles.solutionsContainer}>
          <h4 className={styles.solutionsHeading}>
            <Lightbulb size={17} style={{ color: '#c25e00' }} aria-hidden="true" />
            Solusi & Rekomendasi Literasi:
          </h4>
          <ol className={styles.solutionsList}>
            {structured.solutions.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        </div>
      )}

      {hasSummary && (
        <p className={styles.summaryCaution}>
          Bersifat indikatif berbasis algoritma heuristik dan AI; bukan bukti identitas atau tindakan pemilik akun resmi.
        </p>
      )}

      <p className={styles.summaryGuidance}>
        {judolScore > 0
          ? 'Baca komentar yang ditandai dalam konteksnya; sebutan tentang perjudian juga bisa muncul dalam kritik atau berita investigasi.'
          : 'Baca konteks komentar sebelum menarik kesimpulan, terutama jika terdapat tautan di bio atau testimoni kemenangan tidak wajar.'}
      </p>

      {displayedKeywords.length > 0 && (
        <p className={styles.keywordLine}>
          <span>Kata yang ditandai: </span>
          <span className={styles.keywordValues}>{displayedKeywords.join(', ')}</span>
          {additionalKeywords > 0 && <span> dan {additionalKeywords} kata lainnya.</span>}
        </p>
      )}
    </section>
  );
}
