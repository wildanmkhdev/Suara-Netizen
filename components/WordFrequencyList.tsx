'use client';

import React from 'react';
import { Tag, Flame } from 'lucide-react';

interface WordFrequencyItem {
  text: string;
  value: number;
  type: 'judol' | 'normal';
}

interface WordFrequencyListProps {
  words: WordFrequencyItem[];
}

export function WordFrequencyList({ words }: WordFrequencyListProps) {
  if (!words || words.length === 0) {
    return (
      <div className="p-6 rounded-2xl border bg-card/60 border-border/80 text-center text-muted-foreground text-sm">
        Belum ada kata kunci yang terkumpul.
      </div>
    );
  }

  const judolWords = words.filter((w) => w.type === 'judol');
  const normalWords = words.filter((w) => w.type === 'normal');

  return (
    <div className="p-6 rounded-2xl border bg-card/60 border-border/80 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Kata Kunci & Istilah Terpopuler (Word Cloud)
          </h3>
        </div>
        {judolWords.length > 0 && (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
            <Flame className="w-3 h-3" />
            {judolWords.length} Istilah Judol Terindikasi
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 py-2">
        {words.map((item, idx) => {
          const isJudol = item.type === 'judol';
          const sizeClass =
            item.value > 5
              ? 'text-sm font-bold px-3 py-1.5'
              : item.value > 2
              ? 'text-xs font-semibold px-2.5 py-1'
              : 'text-[11px] px-2 py-0.5';

          return (
            <span
              key={`${item.text}-${idx}`}
              className={`rounded-lg border transition-all inline-flex items-center gap-1.5 ${sizeClass} ${
                isJudol
                  ? 'bg-red-500/15 border-red-500/40 text-red-400 shadow-sm shadow-red-500/10'
                  : 'bg-muted/40 border-border/70 text-foreground/80 hover:bg-muted'
              }`}
            >
              <span>{item.text}</span>
              <span className={`text-[10px] opacity-70 font-mono ${isJudol ? 'text-red-300' : 'text-muted-foreground'}`}>
                {item.value}x
              </span>
            </span>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-3 border-t border-border/50 mt-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            Pola Spam Judol
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />
            Kosa Kata Publik
          </span>
        </div>
        <span>Total: {normalWords.length + judolWords.length} kata terlacak</span>
      </div>
    </div>
  );
}
