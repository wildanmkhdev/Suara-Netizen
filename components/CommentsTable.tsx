'use client';

import { useId, useMemo, useState } from 'react';
import type { ClassifiedComment, CommentFilter } from '@/lib/analysis-types';
import { getCommentLinkFilter, type CommentLinkFilter } from '@/lib/comment-links';
import styles from './CommentsTable.module.css';

export interface CommentsTableProps {
  comments: ClassifiedComment[];
  filter?: CommentFilter;
  onFilterChange?: (filter: CommentFilter) => void;
  totalScanned?: number;
}

type CommentSort = 'source' | 'likes' | 'newest';

interface CommentEntry {
  comment: ClassifiedComment;
  sourceIndex: number;
  linkFilter: CommentLinkFilter;
  publishedTimestamp?: number;
  sourceHref?: string;
}

interface ExpandedView {
  comments: ClassifiedComment[];
  filter: CommentFilter;
  query: string;
  sort: CommentSort;
}

const EMPTY_COMMENTS: ClassifiedComment[] = [];
const INITIAL_COUNT = 5;
const countFormatter = new Intl.NumberFormat('id-ID');
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const FILTER_LABELS: Record<CommentFilter, string> = {
  all: 'Semua komentar',
  judol: 'Promosi judol',
  buzzer: 'Indikasi teks mirip',
  organic: 'Tanpa penanda',
  positif: 'Positif',
  netral: 'Netral',
  negatif: 'Negatif',
  contact: 'WhatsApp / Telegram',
  linked: 'Tautan lain',
  unlinked: 'Tanpa tautan terdeteksi',
};

const FILTER_ORDER: readonly CommentFilter[] = [
  'all', 'judol', 'buzzer', 'organic', 'positif', 'netral', 'negatif', 'contact', 'linked', 'unlinked',
];

function safeSourceHref(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if ((url.protocol !== 'https:' && url.protocol !== 'http:') || url.username || url.password) return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}

function matchesFilter(entry: CommentEntry, filter: CommentFilter): boolean {
  const { comment } = entry;
  if (filter === 'all') return true;
  if (filter === 'judol') return comment.isJudol;
  if (filter === 'buzzer') return Boolean(comment.isBuzzer) && !comment.isJudol;
  if (filter === 'organic') return !comment.isJudol && !comment.isBuzzer;
  if (filter === 'contact' || filter === 'linked' || filter === 'unlinked') return entry.linkFilter === filter;
  return comment.sentiment === filter;
}

function compareLikes(a: CommentEntry, b: CommentEntry): number {
  const first = a.comment.likeCount;
  const second = b.comment.likeCount;
  if (first === undefined) return second === undefined ? a.sourceIndex - b.sourceIndex : 1;
  if (second === undefined) return -1;
  return second - first || a.sourceIndex - b.sourceIndex;
}

function compareDates(a: CommentEntry, b: CommentEntry): number {
  const first = a.publishedTimestamp;
  const second = b.publishedTimestamp;
  if (first === undefined) return second === undefined ? a.sourceIndex - b.sourceIndex : 1;
  if (second === undefined) return -1;
  return second - first || a.sourceIndex - b.sourceIndex;
}

export function CommentsTable({ comments, filter, onFilterChange, totalScanned }: CommentsTableProps) {
  const id = useId();
  const availableComments = comments ?? EMPTY_COMMENTS;
  const [localFilter, setLocalFilter] = useState<CommentFilter>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<CommentSort>('source');
  const [expandedView, setExpandedView] = useState<ExpandedView | null>(null);
  const activeFilter = filter ?? localFilter;
  const normalizedQuery = query.trim().toLocaleLowerCase('id-ID');
  const listId = `${id}-comments`;

  const summary = useMemo(() => {
    const counts: Record<CommentFilter, number> = {
      all: availableComments.length,
      judol: 0,
      buzzer: 0,
      organic: 0,
      positif: 0,
      netral: 0,
      negatif: 0,
      contact: 0,
      linked: 0,
      unlinked: 0,
    };
    const entries: CommentEntry[] = availableComments.map((comment, sourceIndex) => {
      if (comment.isJudol) counts.judol++;
      else if (comment.isBuzzer) counts.buzzer++;
      else counts.organic++;
      if (comment.sentiment) counts[comment.sentiment]++;
      const linkFilter = getCommentLinkFilter(comment.text);
      counts[linkFilter]++;
      const timestamp = comment.publishedAt ? Date.parse(comment.publishedAt) : NaN;
      return {
        comment,
        sourceIndex,
        linkFilter,
        publishedTimestamp: Number.isFinite(timestamp) ? timestamp : undefined,
        sourceHref: safeSourceHref(comment.url),
      };
    });
    return {
      counts,
      entries,
      hasLikes: entries.some((entry) => entry.comment.likeCount !== undefined),
      hasDates: entries.some((entry) => entry.publishedTimestamp !== undefined),
      hasSentiments: counts.positif + counts.netral + counts.negatif > 0,
    };
  }, [availableComments]);

  const effectiveSort: CommentSort = (sort === 'likes' && !summary.hasLikes) || (sort === 'newest' && !summary.hasDates)
    ? 'source'
    : sort;
  const matchingEntries = useMemo(() => {
    const entries = summary.entries.filter((entry) => {
      if (!matchesFilter(entry, activeFilter)) return false;
      if (!normalizedQuery) return true;
      return entry.comment.text.toLocaleLowerCase('id-ID').includes(normalizedQuery)
        || Boolean(entry.comment.author?.toLocaleLowerCase('id-ID').includes(normalizedQuery));
    });
    if (effectiveSort === 'likes') entries.sort(compareLikes);
    else if (effectiveSort === 'newest') entries.sort(compareDates);
    return entries;
  }, [summary.entries, activeFilter, normalizedQuery, effectiveSort]);

  const expanded = expandedView?.comments === availableComments
    && expandedView.filter === activeFilter
    && expandedView.query === normalizedQuery
    && expandedView.sort === effectiveSort;
  const shownEntries = expanded ? matchingEntries : matchingEntries.slice(0, INITIAL_COUNT);

  function changeFilter(nextFilter: CommentFilter) {
    if (filter === undefined) setLocalFilter(nextFilter);
    onFilterChange?.(nextFilter);
    setExpandedView(null);
  }

  function resetView() {
    setQuery('');
    changeFilter('all');
  }

  function toggleExpanded() {
    setExpandedView(expanded ? null : {
      comments: availableComments,
      filter: activeFilter,
      query: normalizedQuery,
      sort: effectiveSort,
    });
  }

  const isSentimentFilter = activeFilter === 'positif' || activeFilter === 'netral' || activeFilter === 'negatif';
  const emptyMessage = availableComments.length === 0
    ? 'Laporan ini belum menyertakan teks komentar.'
    : normalizedQuery
      ? `Tidak ada komentar yang cocok dengan “${query.trim()}” pada filter ini.`
      : isSentimentFilter && !summary.hasSentiments
        ? 'Cuplikan belum memiliki label sentimen per komentar. Persentase pemindaian tidak digunakan untuk menebak label.'
        : `Tidak ada komentar untuk filter “${FILTER_LABELS[activeFilter]}” dalam cuplikan ini.`;

  return (
    <section
      id="komentar-teratas"
      className={styles.panel}
      aria-labelledby={`${id}-title`}
      tabIndex={-1}
      data-ui
    >
      <h3 id={`${id}-title`} className={styles.title}>Komentar teratas</h3>
      <p className={styles.intro}>
        {countFormatter.format(availableComments.length)} komentar dalam cuplikan.
        {totalScanned !== undefined && ` ${countFormatter.format(totalScanned)} komentar diperiksa.`}
        {' '}Urutan awal mengikuti laporan.
      </p>

      <div className={styles.controls}>
        <label className={`${styles.field} ${styles.searchField}`} htmlFor={`${id}-search`}>
          <span className={styles.fieldLabel}>Cari komentar</span>
          <input
            id={`${id}-search`}
            className={styles.input}
            type="search"
            value={query}
            placeholder="Isi atau nama penulis"
            onChange={(event) => {
              setQuery(event.target.value);
              setExpandedView(null);
            }}
          />
        </label>
        <label className={styles.field} htmlFor={`${id}-filter`}>
          <span className={styles.fieldLabel}>Tampilkan</span>
          <select
            id={`${id}-filter`}
            className={styles.select}
            value={activeFilter}
            onChange={(event) => changeFilter(event.target.value as CommentFilter)}
          >
            {FILTER_ORDER.map((value) => (
              <option key={value} value={value}>{FILTER_LABELS[value]} ({countFormatter.format(summary.counts[value])})</option>
            ))}
          </select>
        </label>
        <label className={styles.field} htmlFor={`${id}-sort`}>
          <span className={styles.fieldLabel}>Urutan</span>
          <select
            id={`${id}-sort`}
            className={styles.select}
            value={effectiveSort}
            onChange={(event) => {
              setSort(event.target.value as CommentSort);
              setExpandedView(null);
            }}
          >
            <option value="source">Dari laporan</option>
            <option value="likes" disabled={!summary.hasLikes}>Suka terbanyak{!summary.hasLikes ? ' (tanpa data)' : ''}</option>
            <option value="newest" disabled={!summary.hasDates}>Terbaru{!summary.hasDates ? ' (tanpa tanggal)' : ''}</option>
          </select>
        </label>
      </div>

      <p className={styles.resultCount} role="status" aria-atomic="true">
        Menampilkan {countFormatter.format(shownEntries.length)} dari {countFormatter.format(matchingEntries.length)} komentar yang sesuai.
      </p>

      {matchingEntries.length === 0 ? (
        <div>
          <p className={styles.empty}>{emptyMessage}</p>
          {availableComments.length > 0 && (activeFilter !== 'all' || normalizedQuery) && (
            <button type="button" className={styles.resetButton} onClick={resetView}>Reset pencarian dan filter</button>
          )}
        </div>
      ) : (
        <ol id={listId} className={styles.commentList} role="list">
          {shownEntries.map((entry) => {
            const { comment } = entry;
            const patternFilter = comment.isJudol ? 'judol' : comment.isBuzzer ? 'buzzer' : 'organic';
            const hasAuthor = Boolean(comment.author?.trim());
            const hasMetadata = comment.likeCount !== undefined || entry.publishedTimestamp !== undefined || entry.sourceHref !== undefined;
            return (
              <li key={comment.id ? `${comment.id}-${entry.sourceIndex}` : entry.sourceIndex} className={styles.commentRow}>
                <div className={styles.rowHeader}>
                  {hasAuthor && <p className={styles.author} dir="auto">{comment.author}</p>}
                  <span className={`${styles.patternLabel} ${styles[patternFilter] ?? ''}`}>{FILTER_LABELS[patternFilter]}</span>
                  {comment.sentiment && <span className={styles.sentimentLabel}>Sentimen {FILTER_LABELS[comment.sentiment].toLocaleLowerCase('id-ID')}</span>}
                </div>
                <p className={styles.commentText} dir="auto">{comment.text}</p>
                {hasMetadata && (
                  <div className={styles.metadata}>
                    {comment.likeCount !== undefined && <span>{countFormatter.format(comment.likeCount)} suka</span>}
                    {entry.publishedTimestamp !== undefined && <time dateTime={new Date(entry.publishedTimestamp).toISOString()}>{dateFormatter.format(entry.publishedTimestamp)}</time>}
                    {entry.sourceHref && <a className={styles.sourceLink} href={entry.sourceHref} target="_blank" rel="noopener noreferrer">Lihat komentar asli</a>}
                  </div>
                )}
                {comment.isJudol && comment.keywords.length > 0 && <p className={styles.keywords}>Kata kunci penanda: {comment.keywords.join(', ')}</p>}
              </li>
            );
          })}
        </ol>
      )}

      {matchingEntries.length > INITIAL_COUNT && (
        <button
          type="button"
          className={styles.expandButton}
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={toggleExpanded}
        >
          {expanded ? `Ringkas ke ${INITIAL_COUNT} komentar` : `Tampilkan semua (${countFormatter.format(matchingEntries.length)})`}
        </button>
      )}

      <p className={styles.note}>
        Penanda membaca pola teks, bukan memastikan identitas atau niat pengirim. Tautan dalam teks tidak diaktifkan; hanya tautan sumber komentar yang dapat dibuka.
      </p>
    </section>
  );
}
