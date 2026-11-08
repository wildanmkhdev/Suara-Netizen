'use client';

import { Users, PieChart as PieIcon, BarChart3, StretchHorizontal, ShieldCheck, AlertTriangle, Bot } from 'lucide-react';
import type { BuzzerStats } from '@/lib/analysis-types';

interface SentimentDistribution {
  positif: number;
  netral: number;
  negatif: number;
}

interface AnalysisDashboardProps {
  distribution: SentimentDistribution;
  buzzerStats?: BuzzerStats;
  judolScore?: number;
  totalCommentsScanned?: number;
}

const percentFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 1,
});

export function AnalysisDashboard({
  distribution,
  buzzerStats,
  judolScore = 0,
  totalCommentsScanned = 1000,
}: AnalysisDashboardProps) {
  // 1. Hitung Komposisi Entitas (Human vs Buzzer vs Bot Judol)
  const buzzerPct = buzzerStats?.buzzer_percentage ?? 0;
  const judolPct = Math.min(100, Math.round(judolScore));
  const manipulationTotal = Math.min(100, buzzerPct + judolPct);
  const organicHumanPct = Math.max(0, 100 - manipulationTotal);

  const entityData = [
    {
      name: 'Human / Warganet Organik',
      shortName: 'Human Organik',
      percentage: organicHumanPct,
      hexColor: '#16a34a', // Emerald Green
      badgeColor: '#dcfce7',
      textColor: '#15803d',
      icon: Users,
      description: 'Opini autentik masyarakat tanpa pola koordinasi',
    },
    {
      name: 'Buzzer Bayaran / Astroturfing',
      shortName: 'Buzzer Bayaran',
      percentage: buzzerPct,
      hexColor: '#ea580c', // Amber Orange
      badgeColor: '#ffedd5',
      textColor: '#c2410c',
      icon: Users,
      description: 'Template kalimat terkoordinasi & akun bayaran',
    },
    {
      name: 'Bot Promosi / Spam Judol',
      shortName: 'Bot Judol',
      percentage: judolPct,
      hexColor: '#dc2626', // Crimson Red
      badgeColor: '#fee2e2',
      textColor: '#b91c1c',
      icon: Bot,
      description: 'Akun bot penyebar tautan & ajakan judi slot',
    },
  ];

  // SVG Donut Math untuk Entitas Akun (Radius = 40, Keliling = 251.327)
  const RADIUS = 40;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  let accumulatedEntity = 0;

  const entityDonutSegments = entityData.map((item) => {
    const strokeDasharray = `${(item.percentage / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
    const strokeDashoffset = -((accumulatedEntity / 100) * CIRCUMFERENCE);
    accumulatedEntity += item.percentage;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const dominantEntity = entityData.reduce((prev, curr) => (curr.percentage > prev.percentage ? curr : prev), entityData[0]);

  // 2. Hitung Spektrum Sentimen Publik (Positif vs Netral vs Negatif)
  const pos = Math.max(0, distribution.positif || 0);
  const net = Math.max(0, distribution.netral || 0);
  const neg = Math.max(0, distribution.negatif || 0);
  const totalSent = pos + net + neg || 100;

  const sentimentData = [
    {
      label: 'Positif (Apresiasi / Dukungan)',
      shortLabel: 'Positif',
      pct: (pos / totalSent) * 100,
      color: '#16a34a',
    },
    {
      label: 'Netral (Pertanyaan / Diskusi Objektif)',
      shortLabel: 'Netral',
      pct: (net / totalSent) * 100,
      color: '#64748b',
    },
    {
      label: 'Negatif (Kritik Tajam / Keresahan Publik)',
      shortLabel: 'Negatif',
      pct: (neg / totalSent) * 100,
      color: '#dc2626',
    },
  ];

  // 3. Hitung Distribusi Niat Komentar (Pita Proporsi Stacked Track)
  // Menjawab: Apa niat / tujuan utama komentar-komentar tersebut ditulis?
  const promoIntent = judolPct;
  const buzzerIntent = buzzerPct;
  const criticalIntent = Math.round((neg / totalSent) * organicHumanPct);
  const organicDiscussionIntent = Math.max(0, 100 - promoIntent - buzzerIntent - criticalIntent);

  const intentData = [
    { name: 'Diskusi & Edukasi Wajar', pct: organicDiscussionIntent, color: '#16a34a' },
    { name: 'Kritik & Pelaporan Isu', pct: criticalIntent, color: '#64748b' },
    { name: 'Template Buzzer Bayaran', pct: buzzerIntent, color: '#ea580c' },
    { name: 'Spam Promosi Judol', pct: promoIntent, color: '#dc2626' },
  ];

  // Status Ekosistem Digital
  const healthStatus =
    manipulationTotal >= 40
      ? { label: 'Terkontaminasi Tinggi', color: '#dc2626', bg: '#fee2e2', icon: AlertTriangle }
      : manipulationTotal >= 15
        ? { label: 'Waspada Manipulasi', color: '#ea580c', bg: '#ffedd5', icon: AlertTriangle }
        : { label: 'Ekosistem Sehat & Organik', color: '#16a34a', bg: '#dcfce7', icon: ShieldCheck };

  const StatusIcon = healthStatus.icon;

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
      aria-label="Dashboard Intelijen Percakapan"
      data-ui
    >
      {/* 1. Header Dashboard & Status Ekosistem */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--sn-line)',
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--sn-ink)',
              letterSpacing: '-0.02em',
            }}
          >
            Dashboard intelijen percakapan
          </h3>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: '14px',
              color: 'var(--sn-muted)',
            }}
          >
            Pemetaan komprehensif proporsi entitas akun, spektrum sentimen warganet, dan klasifikasi niat komentar.
          </p>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: healthStatus.bg,
            color: healthStatus.color,
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <StatusIcon size={16} aria-hidden="true" />
          <span>{healthStatus.label}</span>
        </div>
      </div>

      {/* 2. Top 4 Metric KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px',
          marginTop: '20px',
        }}
      >
        {/* KPI 1: Total Komentar */}
        <div
          style={{
            padding: '16px',
            background: 'var(--sn-surface)',
            borderRadius: '8px',
            border: '1px solid var(--sn-line)',
          }}
        >
          <span style={{ fontSize: '13px', color: 'var(--sn-muted)', fontWeight: 500 }}>
            Total Komentar Sampel
          </span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--sn-ink)', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
            {totalCommentsScanned.toLocaleString('id-ID')}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--sn-muted)', marginTop: '4px', display: 'block' }}>
            Batas pemindaian aktif
          </span>
        </div>

        {/* KPI 2: Human Organik */}
        <div
          style={{
            padding: '16px',
            background: 'var(--sn-surface)',
            borderRadius: '8px',
            border: '1px solid var(--sn-line)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#15803d', fontWeight: 600 }}>Human Organik</span>
            <Users size={16} style={{ color: '#16a34a' }} aria-hidden="true" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#15803d', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
            {percentFormatter.format(organicHumanPct)}%
          </div>
          <span style={{ fontSize: '12px', color: 'var(--sn-muted)', marginTop: '4px', display: 'block' }}>
            Suara warganet murni
          </span>
        </div>

        {/* KPI 3: Buzzer Bayaran */}
        <div
          style={{
            padding: '16px',
            background: 'var(--sn-surface)',
            borderRadius: '8px',
            border: '1px solid var(--sn-line)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#c2410c', fontWeight: 600 }}>Indikasi Buzzer</span>
            <Users size={16} style={{ color: '#ea580c' }} aria-hidden="true" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#c2410c', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
            {percentFormatter.format(buzzerPct)}%
          </div>
          <span style={{ fontSize: '12px', color: 'var(--sn-muted)', marginTop: '4px', display: 'block' }}>
            {buzzerStats?.duplicate_clusters_count ?? 0} klaster template
          </span>
        </div>

        {/* KPI 4: Bot Promosi Judol */}
        <div
          style={{
            padding: '16px',
            background: 'var(--sn-surface)',
            borderRadius: '8px',
            border: '1px solid var(--sn-line)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#b91c1c', fontWeight: 600 }}>Kontaminasi Judol</span>
            <Bot size={16} style={{ color: '#dc2626' }} aria-hidden="true" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#b91c1c', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
            {percentFormatter.format(judolPct)}%
          </div>
          <span style={{ fontSize: '12px', color: 'var(--sn-muted)', marginTop: '4px', display: 'block' }}>
            Pola promosi & bot slot
          </span>
        </div>
      </div>

      {/* 3. Main Dashboard Visuals: Pie Chart & Bar Chart (Beda Kategori, Berdampingan) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          marginTop: '24px',
        }}
      >
        {/* Visual 1: Diagram Lingkaran (Pie Chart) - Komposisi Entitas Akun */}
        <div
          style={{
            padding: '20px',
            background: 'var(--sn-paper)',
            borderRadius: '10px',
            border: '1px solid var(--sn-line)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--sn-ink)' }}>
                1. Komposisi entitas akun (Pie chart)
              </h4>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--sn-muted)' }}>
                Proporsi pengirim komentar: Human vs Buzzer vs Bot.
              </p>
            </div>
            <PieIcon size={16} style={{ color: 'var(--sn-muted)' }} aria-hidden="true" />
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              padding: '12px 0',
            }}
          >
            {/* SVG Donut */}
            <div style={{ position: 'relative', width: '150px', height: '150px', flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} aria-hidden="true">
                <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="var(--sn-surface)" strokeWidth="18" />
                {entityDonutSegments.map((seg) => (
                  <circle
                    key={seg.name}
                    cx="50"
                    cy="50"
                    r={RADIUS}
                    fill="none"
                    stroke={seg.hexColor}
                    strokeWidth="18"
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    strokeLinecap="butt"
                  />
                ))}
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--sn-ink)', fontVariantNumeric: 'tabular-nums' }}>
                  {percentFormatter.format(dominantEntity.percentage)}%
                </span>
                <span style={{ fontSize: '11px', color: 'var(--sn-muted)' }}>{dominantEntity.shortName}</span>
              </div>
            </div>

            {/* Legenda Entitas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '160px' }}>
              {entityData.map((item) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '3px',
                        background: item.hexColor,
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    />
                    <span style={{ fontSize: '13px', color: 'var(--sn-ink)' }}>{item.shortName}</span>
                  </div>
                  <strong style={{ fontSize: '14px', color: 'var(--sn-ink)', fontVariantNumeric: 'tabular-nums' }}>
                    {percentFormatter.format(item.percentage)}%
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visual 2: Diagram Batang (Bar Chart) - Spektrum Sentimen Publik */}
        <div
          style={{
            padding: '20px',
            background: 'var(--sn-paper)',
            borderRadius: '10px',
            border: '1px solid var(--sn-line)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--sn-ink)' }}>
                2. Spektrum sentimen publik (Bar chart)
              </h4>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--sn-muted)' }}>
                Nada tanggapan dari opini masyarakat yang diperiksa.
              </p>
            </div>
            <BarChart3 size={16} style={{ color: 'var(--sn-muted)' }} aria-hidden="true" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {sentimentData.map((item) => (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '13px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--sn-ink)', fontWeight: 500 }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '2px',
                        background: item.color,
                        display: 'inline-block',
                      }}
                      aria-hidden="true"
                    />
                    {item.label}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--sn-ink)', fontVariantNumeric: 'tabular-nums' }}>
                    {percentFormatter.format(item.pct)}%
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '14px',
                    background: 'var(--sn-surface)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${item.pct}%`,
                      background: item.color,
                      borderRadius: '3px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Visual 3: Diagram Pita Proporsi (Distribution Stream Track) - Distribusi Niat Komentar */}
      <div
        style={{
          marginTop: '20px',
          padding: '20px',
          background: 'var(--sn-paper)',
          borderRadius: '10px',
          border: '1px solid var(--sn-line)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--sn-ink)' }}>
              3. Distribusi niat komentar (Diagram pita proporsi)
            </h4>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--sn-muted)' }}>
              Segmentasi tujuan komentar: Diskusi vs Kritik Masalah vs Template Bayaran vs Spam Judol.
            </p>
          </div>
          <StretchHorizontal size={16} style={{ color: 'var(--sn-muted)' }} aria-hidden="true" />
        </div>

        {/* Pita Bertumpuk Multi-Segmen */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '24px',
            borderRadius: '4px',
            overflow: 'hidden',
            background: 'var(--sn-surface)',
            marginTop: '16px',
          }}
          aria-hidden="true"
        >
          {intentData.map((item) => (
            <span
              key={item.name}
              style={{
                display: 'block',
                flex: '0 0 auto',
                height: '100%',
                width: `${item.pct}%`,
                background: item.color,
                transition: 'width 0.4s ease',
              }}
              title={`${item.name}: ${percentFormatter.format(item.pct)}%`}
            />
          ))}
        </div>

        {/* Skala Persentase */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--sn-muted)',
            marginTop: '6px',
            fontVariantNumeric: 'tabular-nums',
          }}
          aria-hidden="true"
        >
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>

        {/* Legenda Niat Komentar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginTop: '16px',
            paddingTop: '14px',
            borderTop: '1px solid var(--sn-line)',
          }}
        >
          {intentData.map((item) => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '2px',
                    background: item.color,
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
                <span style={{ fontSize: '13px', color: 'var(--sn-ink)' }}>{item.name}</span>
              </div>
              <strong style={{ fontSize: '13px', color: 'var(--sn-ink)', fontVariantNumeric: 'tabular-nums' }}>
                {percentFormatter.format(item.pct)}%
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Alert Template Buzzer (jika ada) */}
      {(buzzerStats?.top_templates?.length ?? 0) > 0 && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            background: '#fffaf0',
            border: '1px solid #fed7aa',
            borderRadius: '8px',
            borderLeft: '4px solid #ea580c',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c2410c', fontWeight: 600, fontSize: '14px' }}>
            <AlertTriangle size={16} aria-hidden="true" />
            <span>Pola Template Kalimat Buzzer yang Ditemukan:</span>
          </div>
          <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {buzzerStats?.top_templates?.slice(0, 3).map((tpl, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: '12px',
                  fontSize: '13px',
                  color: 'var(--sn-ink)',
                }}
              >
                <span>“{tpl.template}”</span>
                <span
                  style={{
                    flexShrink: 0,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: '#ffedd5',
                    color: '#9a3412',
                    fontSize: '12px',
                    fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {tpl.count}x terulang
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
