'use client';

import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface JudolThreatGaugeProps {
  score: number; // 0 to 100
}

export function JudolThreatGauge({ score }: JudolThreatGaugeProps) {
  const rounded = Math.round(score);

  // Status and colors for clean light mode
  let color = 'text-emerald-600';
  let strokeColor = '#059669';
  let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let statusText = 'Aman / Rendah';
  let description = 'Komentar didominasi diskusi organik pengguna tanpa indikasi akun spam manipulatif.';
  let Icon = ShieldCheck;

  if (rounded >= 40) {
    color = 'text-red-600';
    strokeColor = '#dc2626';
    badgeBg = 'bg-red-50 text-red-700 border-red-200';
    statusText = 'Indikasi Spam Tinggi';
    description = 'Terdeteksi banyak komentar promosi berulang, ajakan link mencurigakan, dan pola akun terkoordinasi.';
    Icon = ShieldAlert;
  } else if (rounded >= 15) {
    color = 'text-amber-600';
    strokeColor = '#d97706';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
    statusText = 'Waspada / Sedang';
    description = 'Terdapat beberapa kata kunci promosi terselubung atau ajakan mencurigakan yang perlu diperhatikan.';
    Icon = AlertTriangle;
  }

  // Circular gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (rounded / 100) * circumference;

  return (
    <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col items-center text-center transition-all">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${color}`} />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Tingkat Risiko Kontaminasi Spam
        </h3>
      </div>

      <div className="relative w-36 h-36 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="text-slate-100"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-3xl font-extrabold ${color}`}>{rounded}%</span>
          <span className="text-[11px] font-semibold text-slate-400">Skor Risiko</span>
        </div>
      </div>

      <div className="mt-3">
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 border ${badgeBg}`}>
          {statusText}
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-xs">{description}</p>
      </div>
    </div>
  );
}
