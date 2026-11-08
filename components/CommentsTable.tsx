'use client';

import { useState } from 'react';
import type { ClassifiedComment } from '@/lib/analysis-types';
import styles from './Report.module.css';

interface CommentsTableProps {
  comments: ClassifiedComment[];
}

type CommentFilter = 'all' | 'judol' | 'buzzer' | 'organic';

const countFormatter = new Intl.NumberFormat('id-ID');

export function CommentsTable({ comments }: CommentsTableProps) {
  const [filter, setFilter] = useState<CommentFilter>('all');
  const availableComments = comments ?? [];

  const judolCount = availableComments.reduce((sum, c) => sum + (c.isJudol ? 1 : 0), 0);
  const buzzerCount = availableComments.reduce((sum, c) => sum + (c.isBuzzer ? 1 : 0), 0);
  const organicCount = availableComments.reduce((sum, c) => sum + (!c.isJudol && !c.isBuzzer ? 1 : 0), 0);

  const filters: { value: CommentFilter; label: string; count: number }[] = [
    { value: 'all', label: 'Semua', count: availableComments.length },
    { value: 'judol', label: 'Spam judol', count: judolCount },
    { value: 'buzzer', label: 'Indikasi buzzer', count: buzzerCount },
    { value: 'organic', label: 'Organik', count: organicCount },
  ];

  const visibleCount =
    filter === 'all'
      ? availableComments.length
      : filter === 'judol'
        ? judolCount
        : filter === 'buzzer'
          ? buzzerCount
          : organicCount;

  const emptyMessage =
    availableComments.length === 0
      ? 'Belum ada komentar untuk ditampilkan.'
      : filter === 'judol'
        ? 'Tidak ada komentar dengan indikasi promosi judol dalam sampel ini.'
        : filter === 'buzzer'
          ? 'Tidak ada komentar dengan indikasi template buzzer dalam sampel ini.'
          : 'Tidak ada komentar organik lainnya dalam sampel ini.';

  return (
    <section
      style={{
        boxSizing: 'border-box',
        width: '100%',
        marginTop: '28px',
        padding: 'clamp(1.25rem, 2.5vw, 2rem)',
        background: 'var(--sn-paper)',
        border: '1px solid var(--sn-line)',
        borderRadius: '12px',
        boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.05)',
      }}
      aria-label="Sampel komentar"
      data-ui
    >
      <h3 className={styles.title}>Sampel komentar terperiksa</h3>
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
        {countFormatter.format(availableComments.length)} komentar sampel (dari total pemindaian hingga 1.000 komentar).
      </p>

      {visibleCount === 0 ? (
        <p className={styles.emptyNote}>{emptyMessage}</p>
      ) : (
        <ol className={styles.commentList} role="list">
          {availableComments.map((item, index) => {
            if (filter === 'judol' && !item.isJudol) return null;
            if (filter === 'buzzer' && !item.isBuzzer) return null;
            if (filter === 'organic' && (item.isJudol || item.isBuzzer)) return null;

            return (
              <li key={index} className={styles.commentRow}>
                <div className={styles.commentMeta}>
                  <span className={styles.commentNumber}>Komentar #{index + 1}</span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {item.isJudol && (
                      <span className={styles.promotionLabel}>Spam Judol</span>
                    )}
                    {item.isBuzzer && (
                      <span className={styles.buzzerBadge}>Buzzer / Template</span>
                    )}
                    {!item.isJudol && !item.isBuzzer && (
                      <span className={styles.otherLabel}>Organik</span>
                    )}
                  </div>
                </div>

                <p className={styles.commentText} dir="auto">{item.text}</p>

                {item.buzzerReason && (
                  <p className={styles.commentKeywords} style={{ color: '#c25e00' }}>
                    <span>Catatan: </span>
                    <span>{item.buzzerReason}</span>
                  </p>
                )}

                {item.keywords && item.keywords.length > 0 && (
                  <p className={styles.commentKeywords}>
                    <span>Kata kunci judol: </span>
                    <span className={styles.keywordValues}>{item.keywords.join(', ')}</span>
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      )}

      <p className={styles.commentNote}>
        Penandaan berlaku pada analisis teks komentar sampel, bukan identitas pemilik akun resmi.
      </p>
    </section>
  );
}
