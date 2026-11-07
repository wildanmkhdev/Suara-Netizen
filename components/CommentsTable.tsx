'use client';

import React, { useState } from 'react';
import { MessageSquare, ShieldAlert, Check } from 'lucide-react';

interface ClassifiedComment {
  text: string;
  isJudol: boolean;
  keywords: string[];
}

interface CommentsTableProps {
  comments: ClassifiedComment[];
}

export function CommentsTable({ comments }: CommentsTableProps) {
  const [filter, setFilter] = useState<'all' | 'judol' | 'clean'>('all');

  if (!comments || comments.length === 0) {
    return (
      <div className="p-6 rounded-2xl border bg-card/60 border-border/80 text-center text-muted-foreground text-sm">
        Tidak ada komentar untuk ditampilkan.
      </div>
    );
  }

  const filteredComments = comments.filter((c) => {
    if (filter === 'judol') return c.isJudol;
    if (filter === 'clean') return !c.isJudol;
    return true;
  });

  return (
    <div className="p-6 rounded-2xl border bg-card/60 border-border/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Sampel Komentar & Flagging Otomatis
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/60 self-start sm:self-auto text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filter === 'all' ? 'bg-primary text-primary-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Semua ({comments.length})
          </button>
          <button
            onClick={() => setFilter('judol')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filter === 'judol' ? 'bg-red-500 text-white font-semibold shadow-sm' : 'text-muted-foreground hover:text-red-400'
            }`}
          >
            Spam Judol ({comments.filter((c) => c.isJudol).length})
          </button>
          <button
            onClick={() => setFilter('clean')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filter === 'clean' ? 'bg-emerald-600 text-white font-semibold shadow-sm' : 'text-muted-foreground hover:text-emerald-400'
            }`}
          >
            Organik ({comments.filter((c) => !c.isJudol).length})
          </button>
        </div>
      </div>

      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
        {filteredComments.map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col gap-1.5 ${
              item.isJudol
                ? 'bg-red-500/5 border-red-500/25 hover:border-red-500/40'
                : 'bg-background/40 border-border/50 hover:border-border'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Komentar #{idx + 1}
              </span>
              {item.isJudol ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                  <ShieldAlert className="w-3 h-3" />
                  Spam Judol Terdeteksi
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <Check className="w-3 h-3" />
                  Organik
                </span>
              )}
            </div>

            <p className="text-foreground/90 leading-relaxed font-sans">{item.text}</p>

            {item.keywords && item.keywords.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                <span className="text-[10px] text-muted-foreground">Pemicu:</span>
                {item.keywords.map((kw, kIdx) => (
                  <span
                    key={kIdx}
                    className="text-[10px] font-mono bg-red-500/15 text-red-300 px-1.5 py-0.2 rounded"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
