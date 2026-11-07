'use client';

import styles from './Report.module.css';

interface LiteracySummaryCardProps {
  summary: string;
  judolScore: number;
  keywords: string[];
}

export function LiteracySummaryCard({ summary, judolScore, keywords }: LiteracySummaryCardProps) {
  const hasSummary = summary.trim().length > 0;
  const displayedKeywords = keywords?.slice(0, 8) ?? [];
  const additionalKeywords = Math.max(0, (keywords?.length ?? 0) - displayedKeywords.length);

  return (
    <section className={styles.panel} aria-label="Ringkasan otomatis" data-ui>
      <h3 className={styles.title}>Ringkasan otomatis</h3>
      <p className={hasSummary ? styles.summaryText : styles.emptyNote}>
        {hasSummary ? summary : 'Belum ada ringkasan untuk komentar ini.'}
      </p>
      {hasSummary && (
        <p className={styles.summaryCaution}>
          Bersifat indikatif dan belum diverifikasi; bukan bukti identitas atau
          tindakan pemilik akun.
        </p>
      )}

      <p className={styles.summaryGuidance}>
        {judolScore > 0
          ? 'Baca komentar yang ditandai dalam konteksnya; sebutan tentang perjudian juga bisa muncul dalam kritik atau berita.'
          : 'Baca konteks komentar sebelum menarik kesimpulan, terutama jika ada tautan atau tawaran keuntungan.'}
      </p>

      {displayedKeywords.length > 0 && (
        <p className={styles.keywordLine}>
          <span>Kata yang ditandai: </span>
          <span className={styles.keywordValues}>{displayedKeywords.join(', ')}</span>
          {additionalKeywords > 0 && (
            <span> dan {additionalKeywords} kata lainnya.</span>
          )}
        </p>
      )}
    </section>
  );
}
