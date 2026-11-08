'use client';

import { Lightbulb, Info, MessageSquareQuote, ShieldAlert } from 'lucide-react';
import type { ExecutiveSummaryStructured } from '@/lib/analysis-types';

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
      aria-label="Ringkasan analisis & solusi literasi"
      data-ui
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--sn-ink)', letterSpacing: '-0.02em' }}>
            Ringkasan eksekutif & solusi literasi
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--sn-muted)' }}>
            Sintesis data persentase warganet, pola manipulasi narasi, dan tindakan pencegahan.
          </p>
        </div>
      </div>

      {sampleNote && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '16px',
            padding: '10px 14px',
            borderRadius: '6px',
            background: 'var(--sn-surface)',
            border: '1px solid var(--sn-line)',
            fontSize: '13px',
            color: 'var(--sn-muted)',
            lineHeight: 1.5,
          }}
          role="note"
        >
          <Info size={16} style={{ flexShrink: 0, color: 'var(--sn-ink)' }} aria-hidden="true" />
          <span>{sampleNote}</span>
        </div>
      )}

      {/* Ringkasan Utama Berpersentase */}
      <div
        style={{
          marginTop: '16px',
          padding: '16px',
          background: 'var(--sn-surface)',
          borderRadius: '8px',
          borderLeft: '4px solid var(--sn-ink)',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '16px',
            lineHeight: 1.6,
            color: 'var(--sn-ink)',
            fontWeight: 500,
          }}
        >
          {hasSummary ? summary : 'Belum ada ringkasan untuk komentar ini.'}
        </p>
      </div>

      {/* Grid Analisa Sentimen & Buzzer (2 Kolom) */}
      {(structured?.sentiment_analysis || structured?.buzzer_analysis) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px',
            marginTop: '16px',
          }}
        >
          {structured?.sentiment_analysis && (
            <div
              style={{
                padding: '14px 16px',
                background: 'var(--sn-paper)',
                border: '1px solid var(--sn-line)',
                borderRadius: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--sn-ink)', fontWeight: 600, fontSize: '14px' }}>
                <MessageSquareQuote size={16} style={{ color: '#16a34a' }} aria-hidden="true" />
                <span>Sentimen Warganet Organik:</span>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '14px', color: 'var(--sn-muted)', lineHeight: 1.55 }}>
                {structured.sentiment_analysis}
              </p>
            </div>
          )}

          {structured?.buzzer_analysis && (
            <div
              style={{
                padding: '14px 16px',
                background: 'var(--sn-paper)',
                border: '1px solid var(--sn-line)',
                borderRadius: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--sn-ink)', fontWeight: 600, fontSize: '14px' }}>
                <ShieldAlert size={16} style={{ color: '#ea580c' }} aria-hidden="true" />
                <span>Analisis Pola Buzzer & Bot:</span>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '14px', color: 'var(--sn-muted)', lineHeight: 1.55 }}>
                {structured.buzzer_analysis}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Rekomendasi Solusi & Tindakan */}
      {structured?.solutions && structured.solutions.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            padding: '18px',
            background: 'var(--sn-surface)',
            border: '1px solid var(--sn-line)',
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Lightbulb size={18} style={{ color: '#ea580c' }} aria-hidden="true" />
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--sn-ink)' }}>
              Solusi & Rekomendasi Tindakan:
            </h4>
          </div>
          <ol
            style={{
              margin: 0,
              padding: '0 0 0 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '14px',
              lineHeight: 1.6,
              color: 'var(--sn-ink)',
            }}
          >
            {structured.solutions.map((item, idx) => (
              <li key={idx} style={{ paddingLeft: '4px' }}>
                {item}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Catatan Panduan & Kata Kunci */}
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--sn-muted)', lineHeight: 1.5 }}>
          {judolScore > 0
            ? 'Catatan: Pembacaan bersifat indikatif untuk literasi publik; sebutan tentang judi juga dapat muncul dalam konteks berita atau investigasi warga.'
            : 'Catatan: Hasil analisis membantu melihat tren opini publik secara luas sebelum menarik kesimpulan.'}
        </p>

        {displayedKeywords.length > 0 && (
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--sn-muted)' }}>
            <span>Kata kunci terdeteksi: </span>
            <strong style={{ color: 'var(--sn-ink)' }}>{displayedKeywords.join(', ')}</strong>
            {additionalKeywords > 0 && <span> (+{additionalKeywords} lainnya)</span>}
          </p>
        )}
      </div>
    </section>
  );
}
