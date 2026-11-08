'use client';

import { useId, useMemo, useState, type CSSProperties, type PointerEvent } from 'react';
import type { BuzzerStats, ClassifiedComment, CommentFilter } from '@/lib/analysis-types';
import { getCommentLinkFilter } from '@/lib/comment-links';
import styles from './AnalysisDashboard.module.css';

interface SentimentDistribution {
  positif: number;
  netral: number;
  negatif: number;
}

export interface AnalysisDashboardProps {
  distribution: SentimentDistribution;
  buzzerStats?: BuzzerStats;
  judolScore?: number;
  totalCommentsScanned?: number;
  comments?: ClassifiedComment[];
  selectedFilter?: CommentFilter;
  onSelectFilter?: (filter: CommentFilter) => void;
}

interface ChartDatum {
  filter: Exclude<CommentFilter, 'all'>;
  label: string;
  count: number;
  percentage: number;
}

const EMPTY_COMMENTS: readonly ClassifiedComment[] = [];
const countFormatter = new Intl.NumberFormat('id-ID');
const percentFormatter = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 });
const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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

// Round the parts together so displayed sample shares still total exactly 100%.
function samplePercentages(counts: readonly [number, number, number]): [number, number, number] {
  const total = counts[0] + counts[1] + counts[2];
  if (total === 0) return [0, 0, 0];

  const exact = counts.map((count) => (count / total) * 1000);
  const rounded = exact.map((value) => Math.floor(value));
  const order = [0, 1, 2].sort((a, b) =>
    (exact[b]! - rounded[b]!) - (exact[a]! - rounded[a]!),
  );
  const remainder = 1000 - rounded.reduce((sum, value) => sum + value, 0);
  for (let index = 0; index < remainder; index++) {
    const target = order[index]!;
    rounded[target] = rounded[target]! + 1;
  }
  return [rounded[0]! / 10, rounded[1]! / 10, rounded[2]! / 10];
}

function shareStyle(percentage: number): CSSProperties {
  return { '--share': `${percentage}%` } as CSSProperties;
}

export function AnalysisDashboard({
  distribution,
  buzzerStats,
  judolScore,
  totalCommentsScanned,
  comments: suppliedComments,
  selectedFilter,
  onSelectFilter,
}: AnalysisDashboardProps) {
  const id = useId();
  const comments = suppliedComments ?? EMPTY_COMMENTS;
  const [localFilter, setLocalFilter] = useState<CommentFilter>('all');
  const [hoveredFilter, setHoveredFilter] = useState<CommentFilter | null>(null);
  const [focusedFilter, setFocusedFilter] = useState<CommentFilter | null>(null);
  const activeFilter = selectedFilter ?? localFilter;
  const detailFilter = hoveredFilter ?? focusedFilter ?? activeFilter;
  const detailId = `${id}-detail`;

  const counts = useMemo(() => {
    const result: Record<CommentFilter, number> = {
      all: comments.length,
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
    for (const comment of comments) {
      if (comment.isJudol) result.judol++;
      else if (comment.isBuzzer) result.buzzer++;
      else result.organic++;
      if (comment.sentiment) result[comment.sentiment]++;
      result[getCommentLinkFilter(comment.text)]++;
    }
    return result;
  }, [comments]);

  const groupShares = samplePercentages([counts.judol, counts.buzzer, counts.organic]);
  const groupData: ChartDatum[] = [
    { filter: 'judol', label: FILTER_LABELS.judol, count: counts.judol, percentage: groupShares[0] },
    { filter: 'buzzer', label: FILTER_LABELS.buzzer, count: counts.buzzer, percentage: groupShares[1] },
    { filter: 'organic', label: FILTER_LABELS.organic, count: counts.organic, percentage: groupShares[2] },
  ];
  const sentimentData: ChartDatum[] = [
    { filter: 'positif', label: FILTER_LABELS.positif, count: counts.positif, percentage: distribution.positif },
    { filter: 'netral', label: FILTER_LABELS.netral, count: counts.netral, percentage: distribution.netral },
    { filter: 'negatif', label: FILTER_LABELS.negatif, count: counts.negatif, percentage: distribution.negatif },
  ];
  const linkShares = samplePercentages([counts.contact, counts.linked, counts.unlinked]);
  const linkData: ChartDatum[] = [
    { filter: 'contact', label: FILTER_LABELS.contact, count: counts.contact, percentage: linkShares[0] },
    { filter: 'linked', label: FILTER_LABELS.linked, count: counts.linked, percentage: linkShares[1] },
    { filter: 'unlinked', label: FILTER_LABELS.unlinked, count: counts.unlinked, percentage: linkShares[2] },
  ];
  const detailDatum = groupData.find((item) => item.filter === detailFilter)
    ?? sentimentData.find((item) => item.filter === detailFilter)
    ?? linkData.find((item) => item.filter === detailFilter);
  const isSentimentDetail = detailFilter === 'positif' || detailFilter === 'netral' || detailFilter === 'negatif';
  const sentimentTotal = distribution.positif + distribution.netral + distribution.negatif;
  const markedCount = counts.judol + counts.buzzer;

  function selectFilter(filter: CommentFilter) {
    if (selectedFilter === undefined) setLocalFilter(filter);
    onSelectFilter?.(filter);
  }

  function previewPointer(event: PointerEvent<Element>, filter: CommentFilter) {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') setHoveredFilter(filter);
  }

  function legendButton(item: ChartDatum, denominator: number) {
    return (
      <button
        key={item.filter}
        type="button"
        className={`${styles.legendButton} ${styles[item.filter]}`}
        aria-pressed={activeFilter === item.filter}
        aria-describedby={detailId}
        aria-label={`${item.label}: ${countFormatter.format(item.count)} dari ${countFormatter.format(denominator)} komentar cuplikan. Tampilkan komentar.`}
        onPointerEnter={(event) => previewPointer(event, item.filter)}
        onPointerLeave={() => setHoveredFilter(null)}
        onFocus={() => setFocusedFilter(item.filter)}
        onBlur={() => setFocusedFilter(null)}
        onClick={() => selectFilter(item.filter)}
      >
        <span className={styles.swatch} aria-hidden="true" />
        <span className={styles.legendLabel}>{item.label}</span>
        <span className={styles.legendValue}>
          <strong>{countFormatter.format(item.count)}</strong>
          <small>{denominator > 0 ? `${percentFormatter.format(item.percentage)}%` : '—'}</small>
        </span>
      </button>
    );
  }

  let donutOffset = 0;
  const detailText = isSentimentDetail && detailDatum
    ? `${percentFormatter.format(detailDatum.percentage)}% pada laporan pemindaian${totalCommentsScanned !== undefined ? ` atas ${countFormatter.format(totalCommentsScanned)} komentar` : ' (jumlah komentar tidak disertakan)'}. ${countFormatter.format(detailDatum.count)} komentar cuplikan memiliki label ${detailDatum.label.toLocaleLowerCase('id-ID')}. Persentase tidak digunakan untuk menebak label per komentar.`
    : comments.length === 0
      ? 'Teks komentar belum tersedia untuk menghitung proporsi cuplikan.'
      : detailDatum
        ? `${countFormatter.format(detailDatum.count)} dari ${countFormatter.format(comments.length)} komentar cuplikan (${percentFormatter.format(detailDatum.percentage)}%). ${detailFilter === 'organic' ? 'Tanpa penanda bukan berarti identitas atau niat pengirim telah terverifikasi.' : detailFilter === 'contact' ? 'Alamat WhatsApp atau Telegram ditemukan di teks. Keberadaan tautan bukan bukti promosi judol.' : detailFilter === 'linked' || detailFilter === 'unlinked' ? 'Yang dihitung adalah alamat dalam teks, bukan tautan ke sumber komentar.' : 'Penanda berasal dari pola teks; setiap komentar dihitung dalam satu kelompok.'}`
        : `${countFormatter.format(comments.length)} komentar tersedia dalam cuplikan. Pilih kategori grafik untuk menyaring komentar teratas.`;

  return (
    <section className={styles.report} aria-labelledby={`${id}-title`} data-ui>
      <header>
        <h3 id={`${id}-title`} className={styles.title}>Peta percakapan</h3>
        <p className={styles.finding}>
          {comments.length > 0
            ? `${countFormatter.format(markedCount)} dari ${countFormatter.format(comments.length)} komentar cuplikan memiliki penanda promosi judol atau kemiripan teks.`
            : 'Cuplikan komentar belum tersedia. Nilai pemindaian ditampilkan tanpa menebak isi komentar.'}
        </p>
        <dl className={styles.scope}>
          <div>
            <dt>Komentar diperiksa</dt>
            <dd className={totalCommentsScanned === undefined ? styles.missing : undefined}>
              {totalCommentsScanned !== undefined ? countFormatter.format(totalCommentsScanned) : '—'}
            </dd>
          </div>
          <div>
            <dt>Dalam cuplikan</dt>
            <dd className={suppliedComments === undefined ? styles.missing : undefined}>
              {suppliedComments !== undefined ? countFormatter.format(comments.length) : '—'}
            </dd>
          </div>
        </dl>
      </header>

      <div className={styles.primaryCharts}>
        <figure className={styles.chart} aria-labelledby={`${id}-patterns`} data-chart="pie">
          <figcaption>
            <h4 id={`${id}-patterns`} className={styles.chartTitle}>Penanda dalam teks</h4>
            <p className={styles.chartDescription}>Basis: {countFormatter.format(comments.length)} komentar cuplikan.</p>
          </figcaption>
          <div className={styles.pieLayout}>
            <div className={styles.donut}>
              <svg className={styles.donutSvg} viewBox="0 0 120 120" aria-hidden="true">
                <circle className={styles.donutTrack} cx="60" cy="60" r={RADIUS} />
                {groupData.map((item) => {
                  const length = (item.percentage / 100) * CIRCUMFERENCE;
                  const offset = -donutOffset;
                  donutOffset += length;
                  return (
                    <g
                      key={item.filter}
                      className={`${styles.donutGroup} ${styles[item.filter]}`}
                      data-selected={activeFilter === item.filter}
                      data-preview={detailFilter === item.filter}
                      onPointerEnter={(event) => previewPointer(event, item.filter)}
                      onPointerLeave={() => setHoveredFilter(null)}
                      onClick={() => selectFilter(item.filter)}
                    >
                      <circle className={styles.donutHit} cx="60" cy="60" r={RADIUS} strokeDasharray={`${length} ${CIRCUMFERENCE}`} strokeDashoffset={offset} />
                      <circle className={styles.donutSegment} cx="60" cy="60" r={RADIUS} strokeDasharray={`${length} ${CIRCUMFERENCE}`} strokeDashoffset={offset} />
                    </g>
                  );
                })}
              </svg>
              <div className={styles.donutCenter} aria-hidden="true">
                <span className={styles.donutTotal}>{suppliedComments !== undefined ? countFormatter.format(comments.length) : '—'}</span>
                <span className={styles.donutCaption}>komentar cuplikan</span>
              </div>
            </div>
            <div className={styles.legend} role="group" aria-label="Pilih penanda teks">
              {groupData.map((item) => legendButton(item, comments.length))}
            </div>
          </div>
          <p className={styles.chartNote}>
            {comments.length === 0
              ? 'Belum ada cuplikan untuk menghitung proporsi. Skor deteksi tidak dipakai sebagai persentase pengirim.'
              : 'Kelompok tidak tumpang tindih: penanda judol didahulukan, lalu teks mirip, lalu tanpa penanda.'}
          </p>
        </figure>

        <figure className={`${styles.chart} ${styles.barChart}`} aria-labelledby={`${id}-sentiment`} data-chart="bar">
          <figcaption>
            <h4 id={`${id}-sentiment`} className={styles.chartTitle}>Sentimen pemindaian</h4>
            <p className={styles.chartDescription}>
              {totalCommentsScanned !== undefined
                ? `Basis laporan: ${countFormatter.format(totalCommentsScanned)} komentar diperiksa.`
                : 'Basis laporan: jumlah komentar yang diperiksa tidak disertakan.'}
            </p>
          </figcaption>
          <div className={styles.barList} role="group" aria-label="Pilih label sentimen komentar">
            {sentimentData.map((item) => (
              <button
                key={item.filter}
                type="button"
                className={`${styles.barButton} ${styles[item.filter]}`}
                aria-pressed={activeFilter === item.filter}
                aria-describedby={detailId}
                aria-label={`${item.label}: ${percentFormatter.format(item.percentage)}% pada laporan pemindaian. Tampilkan ${countFormatter.format(item.count)} komentar cuplikan berlabel ${item.label.toLocaleLowerCase('id-ID')}.`}
                onPointerEnter={(event) => previewPointer(event, item.filter)}
                onPointerLeave={() => setHoveredFilter(null)}
                onFocus={() => setFocusedFilter(item.filter)}
                onBlur={() => setFocusedFilter(null)}
                onClick={() => selectFilter(item.filter)}
              >
                <span className={styles.barLabel}><span>{item.label}</span><strong>{percentFormatter.format(item.percentage)}%</strong></span>
                <span className={styles.barTrack} aria-hidden="true"><span className={styles.barFill} style={shareStyle(item.percentage)} /></span>
              </button>
            ))}
          </div>
          <div className={styles.scale} aria-hidden="true"><span>0%</span><span>50%</span><span>100%</span></div>
          <p className={styles.chartNote}>
            {sentimentTotal === 0
              ? 'Tidak ada nilai sentimen pada laporan ini.'
              : sentimentTotal !== 100
                ? `Nilai laporan berjumlah ${percentFormatter.format(sentimentTotal)}%. Ditampilkan apa adanya, tanpa normalisasi ulang.`
                : 'Persentase berasal dari laporan pemindaian. Filter hanya memakai label yang tersedia pada komentar cuplikan.'}
          </p>
        </figure>
      </div>

      <figure className={`${styles.chart} ${styles.ribbonChart}`} aria-labelledby={`${id}-links`} data-chart="ribbon">
        <figcaption>
          <h4 id={`${id}-links`} className={styles.chartTitle}>Tautan dalam komentar</h4>
          <p className={styles.chartDescription}>Basis: {countFormatter.format(comments.length)} komentar cuplikan, bukan jumlah pengirim atau tautan.</p>
        </figcaption>
        <div className={styles.ribbon} aria-hidden="true">
          {linkData.map((item) => (
            <span
              key={item.filter}
              className={`${styles.ribbonSegment} ${styles[item.filter]}`}
              style={shareStyle(item.percentage)}
              data-selected={activeFilter === item.filter}
              data-preview={detailFilter === item.filter}
              onPointerEnter={(event) => previewPointer(event, item.filter)}
              onPointerLeave={() => setHoveredFilter(null)}
              onClick={() => selectFilter(item.filter)}
            />
          ))}
        </div>
        <div className={styles.scale} aria-hidden="true"><span>0%</span><span>50%</span><span>100%</span></div>
        <div className={styles.ribbonLegend} role="group" aria-label="Pilih jenis tautan dalam teks">
          {linkData.map((item) => legendButton(item, comments.length))}
        </div>
        <p className={styles.chartNote}>
          {comments.length === 0
            ? 'Belum ada teks komentar untuk menghitung tautan. Pita dibiarkan kosong.'
            : 'Tautan WhatsApp / Telegram didahulukan jika ada beberapa jenis tautan. Alamat sumber komentar tidak dihitung.'}
        </p>
      </figure>

      <div className={styles.detail}>
        <div id={detailId} aria-live="polite" aria-atomic="true">
          <p className={styles.detailTitle}>{FILTER_LABELS[detailFilter]}</p>
          <p className={styles.detailText}>{detailText}</p>
        </div>
        <div className={styles.selectedDetail}>
          <p className={styles.selectionStatus} role="status" aria-atomic="true">
            Filter komentar: <strong>{FILTER_LABELS[activeFilter]}</strong>. {countFormatter.format(counts[activeFilter])} dari {countFormatter.format(comments.length)} komentar cuplikan.
          </p>
          <div className={styles.actions}>
            <a className={styles.commentsLink} href="#komentar-teratas">Lihat komentar</a>
            {activeFilter !== 'all' && <button className={styles.resetButton} type="button" onClick={() => selectFilter('all')}>Semua komentar</button>}
          </div>
        </div>
      </div>

      <p className={styles.methodNote}>
        Penanda menilai pola teks, bukan membuktikan identitas pengirim, koordinasi, atau pembayaran. Proporsi cuplikan dibulatkan bersama agar berjumlah 100% bila cuplikan tersedia.
        {judolScore !== undefined && ` Skor deteksi judol: ${percentFormatter.format(judolScore)}/100, bukan persentase akun.`}
        {buzzerStats !== undefined && ` Hasil pemindaian mencatat ${countFormatter.format(buzzerStats.duplicate_clusters_count)} kelompok teks mirip.`}
      </p>

      {(buzzerStats?.top_templates?.length ?? 0) > 0 && (
        <section className={styles.templates} aria-labelledby={`${id}-templates`}>
          <h4 id={`${id}-templates`} className={styles.chartTitle}>Contoh teks berulang</h4>
          <ul className={styles.templateList}>
            {buzzerStats?.top_templates?.slice(0, 3).map((template, index) => (
              <li key={index}>
                <q className={styles.templateText} dir="auto">{template.template}</q>
                <span className={styles.templateCount}>{countFormatter.format(template.count)} kali pada pemindaian</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
