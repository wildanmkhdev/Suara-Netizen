'use client';

import { useState } from 'react';
import styles from './Report.module.css';

interface ClassifiedComment {
  text: string;
  isJudol: boolean;
  keywords: string[];
}

interface CommentsTableProps {
  comments: ClassifiedComment[];
}

type CommentFilter = 'all' | 'suspected' | 'other';

const countFormatter = new Intl.NumberFormat('id-ID');

export function CommentsTable({ comments }: CommentsTableProps) {
  const [filter, setFilter] = useState<CommentFilter>('all');
  const availableComments = comments ?? [];
  const suspectedCount = availableComments.reduce(
    (count, comment) => count + (comment.isJudol ? 1 : 0),
    0,
  );
  const otherCount = availableComments.length - suspectedCount;
  const filters: { value: CommentFilter; label: string; count: number }[] = [
    { value: 'all', label: 'Semua', count: availableComments.length },
    { value: 'suspected', label: 'Indikasi promosi', count: suspectedCount },
    { value: 'other', label: 'Lainnya', count: otherCount },
  ];
  const visibleCount = filter === 'all'
    ? availableComments.length
    : filter === 'suspected'
      ? suspectedCount
      : otherCount;
  const emptyMessage = availableComments.length === 0
    ? 'Belum ada komentar untuk ditampilkan.'
    : filter === 'suspected'
      ? 'Tidak ada komentar dengan indikasi promosi dalam sampel ini.'
      : 'Tidak ada komentar lainnya dalam sampel ini.';

  return (
    <section className={styles.panel} aria-label="Sampel komentar" data-ui>
      <h3 className={styles.title}>Sampel komentar</h3>
      <div className={styles.filters} role="group" aria-label="Filter komentar">
        {filters.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={styles.filterButton}
            aria-pressed={filter === option.value}
          >
            <span className={styles.filterLabel}>{option.label}</span>
            <span className={styles.filterCount}>({countFormatter.format(option.count)})</span>
          </button>
        ))}
      </div>

      <p className={styles.resultCount} role="status">
        Menampilkan {countFormatter.format(visibleCount)} dari{' '}
        {countFormatter.format(availableComments.length)} komentar sampel.
      </p>

      {visibleCount === 0 ? (
        <p className={styles.emptyNote}>{emptyMessage}</p>
      ) : (
        <ol className={styles.commentList} role="list">
          {availableComments.map((item, index) => {
            if (filter === 'suspected' && !item.isJudol) return null;
            if (filter === 'other' && item.isJudol) return null;

            return (
              <li key={index} className={styles.commentRow}>
                <div className={styles.commentMeta}>
                  <span className={styles.commentNumber}>Komentar {index + 1}</span>
                  <span className={item.isJudol ? styles.promotionLabel : styles.otherLabel}>
                    {item.isJudol ? 'Indikasi promosi' : 'Lainnya'}
                  </span>
                </div>
                <p className={styles.commentText} dir="auto">{item.text}</p>
                {item.keywords && item.keywords.length > 0 && (
                  <p className={styles.commentKeywords}>
                    <span>Kata yang ditandai: </span>
                    <span className={styles.keywordValues}>{item.keywords.join(', ')}</span>
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      )}

      <p className={styles.commentNote}>
        Penandaan berlaku pada isi komentar, bukan pemilik akun. Tautan dalam
        komentar ditampilkan sebagai teks.
      </p>
    </section>
  );
}
