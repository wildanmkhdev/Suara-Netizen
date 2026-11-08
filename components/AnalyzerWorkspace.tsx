'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowUpRight, ChevronRight, LoaderCircle } from 'lucide-react';
import { AnalysisDashboard } from '@/components/AnalysisDashboard';
import { SentimentWordCloud } from '@/components/SentimentWordCloud';
import { LiteracySummaryCard } from '@/components/LiteracySummaryCard';
import { CommentsTable } from '@/components/CommentsTable';
import { ScrollReveal } from '@/components/ScrollReveal';
import { StopHoaksBanner } from '@/components/StopHoaksBanner';
import { parseAnalysisResponse, responseError } from '@/lib/analysis-types';
import type { AnalysisResult, CommentFilter, ExampleKind } from '@/lib/analysis-types';
import { REPORT_EXAMPLES } from '@/lib/report-examples';
import styles from './AnalyzerWorkspace.module.css';

type ReportView = { data: AnalysisResult; kind: 'example' | 'analysis'; cached: boolean };

const EXAMPLE_LABELS: Record<ExampleKind, string> = {
  discussion: 'Percakapan biasa',
  promotion: 'Indikasi promosi judol',
  'x-thread': 'Utas X & Buzzer',
};

function validateSocialLink(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('Masukkan tautan lengkap, misalnya https://www.youtube.com/watch?v=... atau https://x.com/username/status/...');
  }

  const host = url.hostname.toLowerCase();
  const isYt = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'].includes(host);
  const isX = ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com', 'mobile.twitter.com'].includes(host);

  if (!isYt && !isX) {
    throw new Error('Gunakan tautan video YouTube (youtube.com / youtu.be) atau postingan X (x.com / twitter.com).');
  }

  if (isYt) {
    const id = host === 'youtu.be'
      ? url.pathname.split('/')[1]
      : url.pathname === '/watch'
        ? url.searchParams.get('v')
        : /^\/(?:shorts|embed)\/([\w-]{11})\/?$/.exec(url.pathname)?.[1];
    if (!id || !/^[\w-]{11}$/.test(id)) {
      throw new Error('Tautan belum mengarah ke video. Salin tautan dari tombol Bagikan di YouTube.');
    }
    return `https://www.youtube.com/watch?v=${id}`;
  }

  // X / Twitter
  const xMatch = /^\/([a-zA-Z0-9_]+)\/status(?:es)?\/(\d+)/.exec(url.pathname);
  if (!xMatch) {
    throw new Error('Tautan belum mengarah ke postingan X. Salin tautan status postingan dari X (Twitter).');
  }
  return `https://x.com/${xMatch[1]}/status/${xMatch[2]}`;
}

export function AnalyzerWorkspace() {
  const [url, setUrl] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ReportView | null>(null);
  const [commentFilter, setCommentFilter] = useState<CommentFilter>('all');
  const requestRef = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => () => requestRef.current?.abort(), []);

  useEffect(() => {
    if (!view) return;
    resultRef.current?.focus({ preventScroll: true });
    resultRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
  }, [view]);

  const showExample = (kind: ExampleKind) => {
    requestRef.current?.abort();
    requestRef.current = null;
    setPending(false);
    setError(null);
    setCommentFilter('all');
    setView({ data: REPORT_EXAMPLES[kind], kind: 'example', cached: false });
  };

  const analyze = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    setError(null);
    let canonicalUrl: string;
    try {
      canonicalUrl = validateSocialLink(url.trim());
    } catch (validationError: unknown) {
      setError(validationError instanceof Error ? validationError.message : 'Periksa kembali tautan.');
      inputRef.current?.focus();
      return;
    }
    const controller = new AbortController();
    requestRef.current?.abort();
    requestRef.current = controller;
    setPending(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: canonicalUrl }),
        signal: controller.signal,
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(responseError(body));
      const parsed = parseAnalysisResponse(body);
      if (controller.signal.aborted) return;
      setCommentFilter('all');
      setView({
        data: parsed.data,
        kind: parsed.data.video_title?.startsWith('Demo Sampel:') ? 'example' : 'analysis',
        cached: parsed.cached,
      });
    } catch (requestError: unknown) {
      if (!controller.signal.aborted) {
        setError(requestError instanceof Error ? requestError.message : 'Layanan belum dapat dihubungi. Coba kembali.');
      }
    } finally {
      if (requestRef.current === controller) {
        setPending(false);
        requestRef.current = null;
      }
    }
  };

  return (
    <>
      <section className={styles.hero} aria-labelledby="landing-title">
        <ScrollReveal className={styles.heroArtwork} delayMs={100}>
          <StopHoaksBanner />
        </ScrollReveal>
        <div className={styles.heroCopy}>
          <h1 id="landing-title">Pahami suara<br />warganet.</h1>
          <p className={styles.intro}>
            Baca sentimen, kenali pola komentar, dan periksa promosi mencurigakan di YouTube & X (Twitter).
          </p>
          <div id="pindai" className={styles.formArea} data-ui>
            <form onSubmit={analyze} noValidate aria-busy={pending}>
              <label htmlFor="content-url">Tautan video YouTube atau postingan X (Twitter)</label>
              <div className={styles.inputGroup}>
                <input
                  id="content-url"
                  ref={inputRef}
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  placeholder="https://youtube.com/watch?v=... atau https://x.com/user/status/..."
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  aria-describedby={error ? 'link-help analysis-error' : 'link-help'}
                  aria-invalid={Boolean(error)}
                  disabled={pending}
                />
                <button type="submit" disabled={pending}>
                  {pending ? <LoaderCircle className={styles.spinner} size={18} aria-hidden="true" /> : null}
                  {pending ? 'Menganalisis' : 'Analisis'}
                  {!pending ? <ChevronRight size={18} aria-hidden="true" /> : null}
                </button>
              </div>
              <p id="link-help" className={styles.help}>
                Mendukung YouTube Video/Shorts dan Postingan/Utas X (Twitter). Mengambil sampel hingga 1.000 komentar publik.
              </p>
              {error ? <p id="analysis-error" role="alert" className={styles.error}>{error}</p> : null}
              {pending ? (
                <p className={styles.progress} role="status">
                  Sedang mengambil hingga 1.000 komentar sampel, mendeteksi pola buzzer & judol, dan menyusun sintesis laporan. Mohon tunggu...
                </p>
              ) : null}
            </form>
            <div className={styles.examples}>
              <p>Lihat contoh hasil</p>
              <div className={styles.exampleButtons}>
                <button type="button" onClick={() => showExample('discussion')}>
                  {EXAMPLE_LABELS.discussion}<ArrowUpRight size={16} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => showExample('promotion')}>
                  {EXAMPLE_LABELS.promotion}<ArrowUpRight size={16} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => showExample('x-thread')}>
                  {EXAMPLE_LABELS['x-thread']}<ArrowUpRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          <noscript><p className={styles.help}>Aktifkan JavaScript untuk menjalankan analisis. Informasi fitur tetap dapat dibaca di halaman ini.</p></noscript>
        </div>

      </section>

      {view ? (
        <section ref={resultRef} tabIndex={-1} id="hasil-analisis" aria-labelledby="report-title" className={styles.report} aria-busy={pending}>
          <div className={styles.reportHeading}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    background: view.data.platform === 'x' ? '#111111' : '#fde8e8',
                    color: view.data.platform === 'x' ? '#ffffff' : '#c81e1e',
                  }}
                >
                  {view.data.platform === 'x' ? 'Platform X (Twitter)' : 'Platform YouTube'}
                </span>
                <span style={{ fontSize: '14px', color: 'var(--sn-muted)' }}>{view.data.channel_name}</span>
              </div>
              <h2 id="report-title">{view.data.video_title || 'Laporan Komentar Publik'}</h2>
            </div>
            <span className={styles.reportCount}>
              {view.data.total_comments_scanned.toLocaleString('id-ID')} komentar diperiksa
            </span>
          </div>

          <p className={styles.reportNotice}>
            {view.kind === 'example'
              ? 'Contoh ilustratif. Komentar dan label disusun untuk memperlihatkan cara membaca laporan deteksi sentimen, buzzer, dan judol.'
              : `${view.cached ? 'Menampilkan laporan tersimpan. ' : ''}${view.data.sample_note || 'Data mengambil sampel hingga 1.000 komentar teratas untuk efisiensi analisis.'}`}
          </p>

          {view.kind === 'analysis' && view.data.video_url ? (
            <a href={view.data.video_url} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
              Buka konten sumber<ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ) : null}

          <div className={styles.reportMain} key={view.data.video_id}>
            <ScrollReveal>
              <AnalysisDashboard
                distribution={view.data.sentiment_distribution}
                buzzerStats={view.data.buzzer_stats}
                judolScore={view.data.judol_risk_score}
                totalCommentsScanned={view.data.total_comments_scanned}
                comments={view.data.comments_sample ?? []}
                selectedFilter={commentFilter}
                onSelectFilter={setCommentFilter}
              />
            </ScrollReveal>
            <ScrollReveal delayMs={100}>
              <CommentsTable
                comments={view.data.comments_sample ?? []}
                filter={commentFilter}
                onFilterChange={setCommentFilter}
                totalScanned={view.data.total_comments_scanned}
              />
            </ScrollReveal>
          </div>

          <ScrollReveal delayMs={100}>
            <LiteracySummaryCard
              summary={view.data.executive_summary}
              judolScore={view.data.judol_risk_score}
              keywords={view.data.judol_keywords_found}
              structured={view.data.executive_summary_structured}
              sampleNote={view.data.sample_note}
            />
          </ScrollReveal>

          <ScrollReveal delayMs={150}>
            <SentimentWordCloud words={view.data.word_frequencies} />
          </ScrollReveal>
        </section>
      ) : null}
    </>
  );
}
