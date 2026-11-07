'use client';

import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface JudolThreatGaugeProps {
  score: number; // 0 to 100
}

export function JudolThreatGauge({ score }: JudolThreatGaugeProps) {
  const rounded = Math.round(score);

  // Status and colors
  let color = 'text-emerald-500';
  let bgColor = 'bg-emerald-500/10 border-emerald-500/30';
  let statusText = 'Aman / Rendah';
  let description = 'Komentar didominasi diskusi organik pengguna tanpa indikasi bot terorganisir.';
  let Icon = ShieldCheck;

  if (rounded >= 40) {
    color = 'text-red-500';
    bgColor = 'bg-red-500/10 border-red-500/30';
    statusText = 'Bahaya Kontaminasi Tinggi';
    description = 'Terdeteksi serbuan bot/afiliator judol dengan promosi slot, link bio, dan pola akun terkoordinasi.';
    Icon = ShieldAlert;
  } else if (rounded >= 15) {
    color = 'text-amber-500';
    bgColor = 'bg-amber-500/10 border-amber-500/30';
    statusText = 'Waspada / Sedang';
    description = 'Terdapat beberapa kata kunci mencurigakan atau promosi samar yang perlu diwaspadai.';
    Icon = AlertTriangle;
  }

  // Circular gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (rounded / 100) * circumference;

  return (
    <div className={`p-6 rounded-2xl border ${bgColor} flex flex-col items-center text-center transition-all`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${color}`} />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Indikator Risiko Judol
        </h3>
      </div>

      <div className="relative w-36 h-36 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="text-muted/20"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            className={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-3xl font-extrabold ${color}`}>{rounded}%</span>
          <span className="text-[11px] font-medium text-muted-foreground">Tingkat Risiko</span>
        </div>
      </div>

      <div className="mt-3">
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${bgColor} ${color}`}>
          {statusText}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">{description}</p>
      </div>
    </div>
  );
}
