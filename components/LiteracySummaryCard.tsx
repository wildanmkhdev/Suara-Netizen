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
    <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-bold text-slate-900">
          Ringkasan & Panduan Literasi Informasi
        </h3>
      </div>

      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
        {summary}
      </p>

      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Panduan Kewaspadaan Masyarakat:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-200">
            {isHighRisk ? (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <span className="text-slate-700 leading-relaxed">
              {isHighRisk
                ? 'Waspadai akun anonim yang merekomendasikan "bocoran admin", iming-iming modal instan, atau nomor WhatsApp di kolom komentar.'
                : 'Komentar video didominasi tanggapan wajar pengguna tanpa pola penipuan terstruktur.'}
            </span>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-200">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="text-slate-700 leading-relaxed">
              Jangan pernah mengklik tautan tidak dikenal di profil pengguna yang menjanjikan keuntungan finansial tidak masuk akal.
            </span>
          </div>
        </div>
      </div>

      {keywords && keywords.length > 0 && (
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500">Kata kunci terpantau:</span>
          {keywords.slice(0, 8).map((kw, i) => (
            <span
              key={i}
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-red-50 border border-red-200 text-red-700 font-mono"
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
