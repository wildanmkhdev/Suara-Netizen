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
      <div className="p-6 rounded-2xl border border-slate-200 bg-white text-center text-slate-500 text-xs">
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
    <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Sampel Komentar & Penandaan Kategori
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({comments.length})
          </button>
          <button
            onClick={() => setFilter('judol')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'judol'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-red-600'
            }`}
          >
            Indikasi Spam ({comments.filter((c) => c.isJudol).length})
          </button>
          <button
            onClick={() => setFilter('clean')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'clean'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-600'
            }`}
          >
            Komentar Wajar ({comments.filter((c) => !c.isJudol).length})
          </button>
        </div>
      </div>

      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
        {filteredComments.map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col gap-1.5 ${
              item.isJudol
                ? 'bg-red-50/40 border-red-200'
                : 'bg-slate-50/50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">
                Komentar #{idx + 1}
              </span>
              {item.isJudol ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100/70 px-2 py-0.5 rounded-md border border-red-200">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Pola Spam Terdeteksi
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-200">
                  <Check className="w-3.5 h-3.5" />
                  Diskusi Wajar
                </span>
              )}
            </div>

            <p className="text-slate-800 leading-relaxed font-sans">{item.text}</p>

            {item.keywords && item.keywords.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                <span className="text-[10px] text-slate-500 font-medium">Kata kunci terdeteksi:</span>
                {item.keywords.map((kw, kIdx) => (
                  <span
                    key={kIdx}
                    className="text-[10px] font-mono bg-red-100 text-red-800 px-1.5 py-0.5 rounded border border-red-200 font-medium"
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
