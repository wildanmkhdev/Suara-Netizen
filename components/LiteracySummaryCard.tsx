'use client';

import React from 'react';
import { BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LiteracySummaryCardProps {
  summary: string;
  judolScore: number;
  keywords: string[];
}

export function LiteracySummaryCard({ summary, judolScore, keywords }: LiteracySummaryCardProps) {
  const isHighRisk = judolScore >= 30;

  return (
    <div className="p-6 rounded-2xl border bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="text-base font-bold text-foreground">
          Edukasi & Rekomendasi Literasi Digital
        </h3>
      </div>

      <p className="text-sm text-foreground/90 leading-relaxed bg-background/60 p-4 rounded-xl border border-border/60 mb-4">
        {summary}
      </p>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Panduan Perlindungan Masyarakat:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-background/40 border border-border/40">
            {isHighRisk ? (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            )}
            <span className="text-muted-foreground">
              {isHighRisk
                ? 'Waspadai akun anonim yang merekomendasikan "bocoran admin", "pola gacor", atau nomor WhatsApp di komentar.'
                : 'Komentar relatif bersih dari skema manipulasi sindikat judi online.'}
            </span>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-background/40 border border-border/40">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span className="text-muted-foreground">
              Jangan pernah mengklik tautan pendek di bio profil yang menjanjikan deposit instan atau modal receh berlipat.
            </span>
          </div>
        </div>
      </div>

      {keywords && keywords.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border/40 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-muted-foreground">Modus terdeteksi:</span>
          {keywords.slice(0, 8).map((kw, i) => (
            <span
              key={i}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400"
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
