'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { WordFrequencyItem } from '@/lib/judol-keywords';
import { Download } from 'lucide-react';
import { layoutWordCloud, WORD_CLOUD_LIMIT } from '@/lib/word-cloud-layout';
import type { WordCloudCategory, WordCloudLayout, WordCloudWord } from '@/lib/word-cloud-layout';
import styles from './SentimentWordCloud.module.css';

interface SentimentWordCloudProps {
  words: WordFrequencyItem[];
}

type CategoryFilter = 'all' | WordCloudCategory;
type ViewMode = 'cloud' | 'split' | 'barchart';

const CATEGORY_ORDER: readonly WordCloudCategory[] = ['positif', 'negatif', 'netral', 'judol', 'unknown'];
const CATEGORY_DETAILS: Record<WordCloudCategory, { label: string; token: string }> = {
  positif: { label: 'Positif', token: '--sn-positive' },
  negatif: { label: 'Negatif', token: '--sn-negative' },
  netral: { label: 'Netral', token: '--sn-ink' },
  judol: { label: 'Indikasi promosi', token: '--sn-promotion' },
  unknown: { label: 'Belum dikategorikan', token: '--sn-muted' },
};
const VIEW_OPTIONS: readonly { key: ViewMode; label: string }[] = [
  { key: 'cloud', label: 'Peta kata' },
  { key: 'split', label: 'Per kategori' },
  { key: 'barchart', label: 'Frekuensi' },
];
const countFormatter = new Intl.NumberFormat('id-ID');

function resolveCategory(word: WordFrequencyItem): WordCloudCategory {
  switch (word.category) {
    case 'positif':
    case 'negatif':
    case 'netral':
    case 'judol':
      return word.category;
    default:
      // Legacy promotion flags carry information; a missing sentiment does not.
      return word.type === 'judol' ? 'judol' : 'unknown';
  }
}

function categoryColor(category: WordCloudCategory): string {
  return `var(${CATEGORY_DETAILS[category].token})`;
}

interface MeasuredCloud {
  source: readonly WordCloudWord[];
  width: number;
  height: number;
  fontFamily: string;
  layout: WordCloudLayout | null;
  error: string | null;
}

function useMeasuredWordCloud(words: readonly WordCloudWord[]) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [result, setResult] = useState<MeasuredCloud | null>(null);
  const { width, height } = size;

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    const updateSize = (nextWidth: number, nextHeight: number) => {
      const measuredWidth = Math.round(nextWidth);
      const measuredHeight = Math.round(nextHeight);
      setSize((previous) => previous.width === measuredWidth && previous.height === measuredHeight
        ? previous
        : { width: measuredWidth, height: measuredHeight });
    };
    const measureViewport = () => updateSize(element.clientWidth, element.clientHeight);
    measureViewport();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measureViewport);
      return () => window.removeEventListener('resize', measureViewport);
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) updateSize(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element || words.length === 0 || width === 0 || height === 0) return;
    let cancelled = false;

    const generate = async () => {
      const fontFamily = window.getComputedStyle(element).fontFamily;
      const sample = words.slice(0, WORD_CLOUD_LIMIT).map((word) => word.text).join(' ');
      await document.fonts.load(`700 16px ${fontFamily}`, sample);
      await document.fonts.ready;
      if (cancelled) return;

      const context = document.createElement('canvas').getContext('2d');
      if (!context) throw new Error('Canvas text measurement is unavailable');
      context.textAlign = 'left';
      context.textBaseline = 'alphabetic';

      const layout = layoutWordCloud(words, {
        width,
        height,
        measure: (text, fontSize) => {
          context.font = `700 ${fontSize}px ${fontFamily}`;
          const metrics = context.measureText(text);
          const left = Math.max(0, metrics.actualBoundingBoxLeft);
          const right = Math.max(metrics.width, metrics.actualBoundingBoxRight);
          return {
            width: left + right,
            height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
            baselineX: left,
            baselineY: metrics.actualBoundingBoxAscent,
          };
        },
      });
      if (!cancelled) setResult({ source: words, width, height, fontFamily, layout, error: null });
    };

    void generate().catch(() => {
      if (!cancelled) setResult({
        source: words,
        width,
        height,
        fontFamily: '',
        layout: null,
        error: 'Peta kata tidak dapat digambar di peramban ini. Gunakan tabel frekuensi di bawah.',
      });
    });
    return () => { cancelled = true; };
  }, [words, width, height]);

  const current = result && result.source === words && result.width === width && result.height === height
    ? result
    : null;
  return { viewportRef, current, isPending: words.length > 0 && !current };
}

interface WordCloudPlotProps {
  words: readonly WordCloudWord[];
  label: string;
  compact?: boolean;
  downloadable?: boolean;
}

function WordCloudPlot({ words, label, compact = false, downloadable = false }: WordCloudPlotProps) {
  const { viewportRef, current, isPending } = useMeasuredWordCloud(words);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const captionId = useId();
  const layout = current?.layout;

  const downloadPNG = async () => {
    if (!layout || !current || layout.words.length === 0 || isExporting) return;
    setIsExporting(true);
    setExportError(null);

    try {
      await document.fonts.load(`400 16px ${current.fontFamily}`);
      await document.fonts.ready;

      const canvas = document.createElement('canvas');
      const exportWidth = Math.max(1200, layout.width * 2);
      const scale = (exportWidth - 80) / layout.width;
      const cloudTop = 180;
      const cloudBottom = cloudTop + layout.height * scale;
      canvas.width = exportWidth;
      canvas.height = Math.ceil(cloudBottom + 76);
      const context = canvas.getContext('2d');
      const element = viewportRef.current;
      if (!context || !element) throw new Error('PNG rendering is unavailable');

      const computedStyle = window.getComputedStyle(element);
      const token = (name: string) => computedStyle.getPropertyValue(name).trim();
      context.fillStyle = token('--sn-paper');
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = token('--sn-ink');
      context.textAlign = 'left';
      context.textBaseline = 'alphabetic';
      context.font = `400 16px ${current.fontFamily}`;
      context.fillText('Suara-Netizen', 40, 40);
      context.font = `700 30px ${current.fontFamily}`;
      context.fillText('Kata dalam komentar', 40, 80);
      context.font = `400 18px ${current.fontFamily}`;
      context.fillText(`${label} (${countFormatter.format(words.length)} kata tersedia)`, 40, 113);

      context.font = `400 16px ${current.fontFamily}`;
      let legendX = 40;
      for (const category of CATEGORY_ORDER) {
        if (!words.some((word) => word.category === category)) continue;
        context.fillStyle = token(CATEGORY_DETAILS[category].token);
        context.beginPath();
        context.arc(legendX + 5, 144, 5, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = token('--sn-muted');
        context.fillText(CATEGORY_DETAILS[category].label, legendX + 18, 149);
        legendX += context.measureText(CATEGORY_DETAILS[category].label).width + 42;
      }

      // The cloud has its own translated content area, below every header line.
      context.save();
      context.translate(40, cloudTop);
      context.scale(scale, scale);
      for (const word of layout.words) {
        context.fillStyle = token(CATEGORY_DETAILS[word.category].token);
        context.font = `700 ${word.size}px ${current.fontFamily}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
        context.fillText(word.text, word.x, word.y);
      }
      context.restore();
      context.fillStyle = token('--sn-muted');
      context.font = `400 16px ${current.fontFamily}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
      context.fillText(`${countFormatter.format(layout.words.length)} dari ${countFormatter.format(words.length)} kata ditampilkan. Frekuensi adalah jumlah kemunculan.`, 40, cloudBottom + 30);
      context.fillText(layout.omittedCount > 0
        ? 'Kata yang tidak muat tetap tersedia pada tabel frekuensi lengkap.'
        : 'Kategori kata merupakan petunjuk, bukan kesimpulan tentang penulisnya.', 40, cloudBottom + 54);

      const { promise, resolve, reject } = Promise.withResolvers<Blob>();
      canvas.toBlob((image) => image ? resolve(image) : reject(new Error('PNG encoding failed')), 'image/png');
      const blob = await promise;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `suara-netizen-peta-kata-${label.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = url;
      link.hidden = true;
      document.body.appendChild(link);
      try {
        link.click();
      } finally {
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch {
      setExportError('Unduhan PNG gagal. Coba unduh kembali.');
    } finally {
      setIsExporting(false);
    }
  };

  const status = words.length === 0
    ? 'Tidak ada kata dalam kategori ini.'
    : current?.error
      ? 'Frekuensi kata tetap tersedia dalam tabel.'
      : layout
        ? `Menampilkan ${countFormatter.format(layout.words.length)} dari ${countFormatter.format(words.length)} kata.${layout.omittedCount > 0 ? ' Kata yang tidak muat tetap tersedia dalam tabel.' : ''}`
        : 'Menyusun peta kata…';

  return (
    <figure className={styles.plot}>
      {downloadable && (
        <div className={styles.plotActions}>
          <p className={styles.plotScope}>{label}</p>
          <button
            type="button"
            className={styles.downloadButton}
            onClick={() => { void downloadPNG(); }}
            disabled={!layout || layout.words.length === 0 || isExporting}
            aria-describedby={captionId}
          >
            <Download size={18} aria-hidden="true" />
            {isExporting ? 'Menyiapkan PNG…' : 'Unduh PNG'}
          </button>
        </div>
      )}
      <div
        ref={viewportRef}
        className={`${styles.viewport} ${compact ? styles.compactViewport : ''}`}
        aria-busy={isPending}
      >
        {layout && layout.words.length > 0 ? (
          <svg
            className={styles.svg}
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            width={layout.width}
            height={layout.height}
            role="img"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            fontFamily={current?.fontFamily}
          >
            <title id={titleId}>Peta kata: {label}</title>
            <desc id={descriptionId}>
              {status} Ukuran kata mengikuti frekuensi. Jumlah dan kategori setiap kata tersedia pada tabel frekuensi lengkap di bawah.
            </desc>
            {layout.words.map((word) => (
              <text key={word.id} x={word.x} y={word.y} fontSize={word.size} fontWeight={700} fill={categoryColor(word.category)}>
                {word.text}
                <title>{`${word.text}: ${countFormatter.format(word.value)} kali, ${CATEGORY_DETAILS[word.category].label}`}</title>
              </text>
            ))}
          </svg>
        ) : (
          <p className={styles.plotMessage}>
            {current?.error || (words.length === 0
              ? 'Tidak ada kata dalam kategori ini.'
              : layout
                ? 'Kata tidak muat pada peta ini. Lihat tabel frekuensi di bawah.'
                : 'Menyusun peta kata…')}
          </p>
        )}
      </div>
      <figcaption id={captionId} className={styles.caption} aria-live="polite">{status}</figcaption>
      {exportError && <p className={styles.exportError} role="alert">{exportError}</p>}
    </figure>
  );
}

export function SentimentWordCloud({ words }: SentimentWordCloudProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('cloud');
  const [filterCategory, setFilterCategory] = useState<CategoryFilter>('all');
  const headingId = useId();
  const filterLabelId = useId();
  const visualizationId = useId();
  const chartHeadingId = useId();

  // These references remain stable when a view, filter or download state changes.
  const categorizedWords = useMemo(() => {
    const all: WordCloudWord[] = words.map((word, index) => ({
      id: `${index}-${word.text}`,
      text: word.text,
      value: word.value,
      category: resolveCategory(word),
    })).sort((left, right) => right.value - left.value);
    const groups: Record<WordCloudCategory, WordCloudWord[]> = {
      positif: [], negatif: [], netral: [], judol: [], unknown: [],
    };
    for (const word of all) groups[word.category].push(word);
    return { all, groups };
  }, [words]);
  const filteredWords = useMemo(() => filterCategory === 'all'
    ? categorizedWords.all
    : categorizedWords.groups[filterCategory], [categorizedWords, filterCategory]);
  const visibleCategories = useMemo(() => filterCategory === 'all'
    ? CATEGORY_ORDER.filter((category) => categorizedWords.groups[category].length > 0)
    : [filterCategory], [categorizedWords, filterCategory]);
  const topBarWords = useMemo(() => filteredWords.slice(0, 10), [filteredWords]);
  const scopeLabel = filterCategory === 'all' ? 'Semua kategori' : CATEGORY_DETAILS[filterCategory].label;
  const maxFrequency = topBarWords[0]?.value ?? 0;

  return (
    <section className={styles.root} aria-labelledby={headingId} data-ui="word-cloud">
      <div className={styles.header}>
        <div className={styles.intro}>
          <h3 id={headingId} className={styles.title}>Kata dalam komentar</h3>
          <p className={styles.description}>
            Lihat kata yang sering muncul. Kategori kata merupakan petunjuk, bukan kesimpulan tentang penulis komentar.
          </p>
        </div>
        <div className={styles.viewModes} role="group" aria-label="Tampilan frekuensi kata">
          {VIEW_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`${styles.modeButton} ${viewMode === option.key ? styles.activeButton : ''}`}
              aria-pressed={viewMode === option.key}
              aria-controls={visualizationId}
              onClick={() => setViewMode(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.controls}>
        <p id={filterLabelId} className={styles.filterLabel}>Kategori kata</p>
        <div className={styles.filterOptions} role="group" aria-labelledby={filterLabelId}>
          <button
            type="button"
            className={`${styles.filterButton} ${filterCategory === 'all' ? styles.activeButton : ''}`}
            aria-pressed={filterCategory === 'all'}
            aria-controls={visualizationId}
            onClick={() => setFilterCategory('all')}
          >
            Semua <span className={styles.filterCount}>({countFormatter.format(categorizedWords.all.length)})</span>
          </button>
          {CATEGORY_ORDER.filter((category) => category !== 'unknown' || categorizedWords.groups.unknown.length > 0 || filterCategory === 'unknown').map((category) => (
            <button
              key={category}
              type="button"
              className={`${styles.filterButton} ${filterCategory === category ? styles.activeButton : ''}`}
              aria-pressed={filterCategory === category}
              aria-controls={visualizationId}
              onClick={() => setFilterCategory(category)}
            >
              {CATEGORY_DETAILS[category].label}
              <span className={styles.filterCount}>({countFormatter.format(categorizedWords.groups[category].length)})</span>
            </button>
          ))}
        </div>
      </div>

      {categorizedWords.groups.unknown.length > 0 && (
        <p className={styles.notice}>
          {countFormatter.format(categorizedWords.groups.unknown.length)} kata belum memiliki kategori. Kata tersebut tidak dianggap netral; frekuensinya tetap ditampilkan.
        </p>
      )}

      <div id={visualizationId} className={styles.visualization}>
        {filteredWords.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>{categorizedWords.all.length === 0 ? 'Belum ada kata untuk ditampilkan' : 'Tidak ada kata dalam kategori ini'}</p>
            <p>{categorizedWords.all.length === 0 ? 'Hasil ini belum memuat frekuensi kata.' : 'Pilih Semua untuk melihat kata dari kategori lain.'}</p>
            {categorizedWords.all.length > 0 && (
              <button type="button" className={styles.resetButton} onClick={() => setFilterCategory('all')}>Tampilkan semua kata</button>
            )}
          </div>
        ) : (
          <>
            {viewMode !== 'split' && (
              <ul className={styles.legend} aria-label="Arti warna kategori kata">
                {visibleCategories.map((category) => (
                  <li key={category} className={styles.legendItem}>
                    <span className={styles.swatch} style={{ backgroundColor: categoryColor(category) }} aria-hidden="true" />
                    {CATEGORY_DETAILS[category].label}
                  </li>
                ))}
              </ul>
            )}
            {viewMode === 'cloud' && <WordCloudPlot words={filteredWords} label={scopeLabel} downloadable />}
            {viewMode === 'split' && (
              <div className={styles.splitGrid}>
                {visibleCategories.map((category) => (
                  <div key={category} className={styles.splitPanel}>
                    <div className={styles.splitHeading}>
                      <h4 className={styles.splitTitle}>
                        <span className={styles.swatch} style={{ backgroundColor: categoryColor(category) }} aria-hidden="true" />
                        {CATEGORY_DETAILS[category].label}
                      </h4>
                      <p className={styles.splitCount}>{countFormatter.format(categorizedWords.groups[category].length)} kata</p>
                    </div>
                    <WordCloudPlot words={categorizedWords.groups[category]} label={CATEGORY_DETAILS[category].label} compact />
                  </div>
                ))}
              </div>
            )}
            {viewMode === 'barchart' && (
              <figure className={styles.frequencyFigure} aria-labelledby={chartHeadingId}>
                <div className={styles.frequencyHeader}>
                  <h4 id={chartHeadingId}>Frekuensi kata</h4>
                  <p>{countFormatter.format(topBarWords.length)} kata teratas</p>
                </div>
                <ol className={styles.frequencyList} aria-label="Kata terurut dari frekuensi tertinggi">
                  {topBarWords.map((word) => (
                    <li key={word.id} className={styles.frequencyItem}>
                      <span className={styles.frequencyWord}>
                        {word.text}
                        <span className={styles.frequencyCategory}>{CATEGORY_DETAILS[word.category].label}</span>
                      </span>
                      <div className={styles.frequencyTrack} aria-hidden="true">
                        <div className={styles.frequencyBar} style={{
                          width: `${maxFrequency > 0 ? word.value / maxFrequency * 100 : 0}%`,
                          backgroundColor: categoryColor(word.category),
                        }} />
                      </div>
                      <span className={styles.frequencyValue}>{countFormatter.format(word.value)} kali</span>
                    </li>
                  ))}
                </ol>
                <figcaption className={styles.caption}>Skala dimulai dari 0; batang terpanjang menunjukkan {countFormatter.format(maxFrequency)} kemunculan.</figcaption>
              </figure>
            )}
          </>
        )}
      </div>

      {categorizedWords.all.length > 0 && (
        <details className={styles.tableDetails}>
          <summary className={styles.tableSummary}>Lihat tabel frekuensi lengkap ({countFormatter.format(categorizedWords.all.length)} kata)</summary>
          <div className={styles.tableWrap}>
            <table className={styles.frequencyTable}>
              <caption>
                Semua kata yang tersedia, diurutkan dari kemunculan terbanyak. Jumlah menunjukkan berapa kali kata muncul. Tabel memuat semua kategori, termasuk kata yang tidak muat pada peta.
              </caption>
              <thead>
                <tr><th scope="col">Kata</th><th scope="col" className={styles.numeric}>Jumlah</th><th scope="col">Kategori</th></tr>
              </thead>
              <tbody>
                {categorizedWords.all.map((word) => (
                  <tr key={word.id}>
                    <th scope="row">{word.text}</th>
                    <td className={styles.numeric}>{countFormatter.format(word.value)}</td>
                    <td>
                      <span className={styles.tableCategory}>
                        <span className={styles.swatch} style={{ backgroundColor: categoryColor(word.category) }} aria-hidden="true" />
                        {CATEGORY_DETAILS[word.category].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </section>
  );
}
