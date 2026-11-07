'use client';

import React, { useState, useEffect } from 'react';
import { WordFrequencyItem } from '@/lib/judol-keywords';
import {
  Cloud,
  Flame,
  Smile,
  Frown,
  Download,
  BarChart2,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface SentimentWordCloudProps {
  words: WordFrequencyItem[];
}

interface PlacedWord {
  text: string;
  size: number;
  x: number;
  y: number;
  rotate: boolean;
  color: string;
  category: string;
  value: number;
}

export function SentimentWordCloud({ words }: SentimentWordCloudProps) {
  const [viewMode, setViewMode] = useState<'cloud' | 'split' | 'barchart'>('cloud');
  const [filterCategory, setFilterCategory] = useState<'all' | 'positif' | 'negatif' | 'judol'>('all');
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Normalisasi kategori jika membaca cache lama
  const safeWords = words.map((w) => ({
    ...w,
    category: w.category || (w.type === 'judol' ? ('judol' as const) : ('netral' as const)),
  }));

  // Filter kata berdasarkan kategori yang dipilih
  const filteredWords = safeWords.filter((w) => {
    if (filterCategory === 'all') return true;
    return w.category === filterCategory;
  });

  const judolWords = safeWords.filter((w) => w.category === 'judol');
  const positiveWords = safeWords.filter((w) => w.category === 'positif');
  const negativeWords = safeWords.filter((w) => w.category === 'negatif');

  // Algoritma Archimedean Spiral Word Cloud Layout
  useEffect(() => {
    if (!filteredWords || filteredWords.length === 0) {
      setPlacedWords([]);
      return;
    }

    setIsGenerating(true);

    const width = 760;
    const height = 420;
    const centerX = width / 2;
    const centerY = height / 2;

    const maxVal = Math.max(...filteredWords.map((w) => w.value), 1);
    const minVal = Math.min(...filteredWords.map((w) => w.value), 1);

    const boxes: Array<{ x: number; y: number; w: number; h: number }> = [];
    const results: PlacedWord[] = [];

    // Virtual canvas untuk mengukur ukuran teks
    const measureCanvas = document.createElement('canvas');
    const ctx = measureCanvas.getContext('2d');

    filteredWords.forEach((wordItem, idx) => {
      // Skala ukuran font dari 14px s/d 50px
      const normalizedSize =
        maxVal === minVal
          ? 26
          : 14 + ((wordItem.value - minVal) / (maxVal - minVal)) * 36;

      // Rotasi 0 derajat (horizontal) atau 90 derajat (vertikal)
      const rotate = idx % 5 === 2;

      let textWidth = 60;
      let textHeight = normalizedSize;

      if (ctx) {
        ctx.font = `bold ${normalizedSize}px sans-serif`;
        textWidth = ctx.measureText(wordItem.text).width + 8;
        textHeight = normalizedSize * 1.1;
      }

      const w = rotate ? textHeight : textWidth;
      const h = rotate ? textWidth : textHeight;

      // Pemilihan warna bertaraf kontras tinggi untuk background putih/terang
      let color = '#0f172a'; // Netral / General (Charcoal / Almost Black)
      if (wordItem.category === 'judol') {
        color = '#dc2626'; // Judol / Spam (Bold Red)
      } else if (wordItem.category === 'positif') {
        color = '#059669'; // Positif (Emerald Green)
      } else if (wordItem.category === 'negatif') {
        color = '#ea580c'; // Negatif (Vibrant Orange)
      }

      // Archimedean Spiral Search
      let placed = false;
      let angle = 0;
      const step = 0.35;
      const spiralA = 2.2;

      while (angle < 120 && !placed) {
        const radius = spiralA * angle;
        const x = centerX + radius * Math.cos(angle) - w / 2;
        const y = centerY + radius * Math.sin(angle) - h / 2;

        let collision = false;
        if (x < 10 || x + w > width - 10 || y < 10 || y + h > height - 10) {
          collision = true;
        } else {
          for (const b of boxes) {
            if (
              x < b.x + b.w &&
              x + w > b.x &&
              y < b.y + b.h &&
              y + h > b.y
            ) {
              collision = true;
              break;
            }
          }
        }

        if (!collision) {
          boxes.push({ x, y, w, h });
          results.push({
            text: wordItem.text,
            size: Math.round(normalizedSize),
            x: Math.round(x + w / 2),
            y: Math.round(y + h / 2),
            rotate,
            color,
            category: wordItem.category,
            value: wordItem.value,
          });
          placed = true;
        }

        angle += step;
      }
    });

    setPlacedWords(results);
    setIsGenerating(false);
  }, [filteredWords, filterCategory]);

  // Fungsi Download Gambar Word Cloud (PNG)
  const downloadWordCloudPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background putih bersih
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Judul & Header
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('Suara-Netizen • Analisis Sentimen & Word Cloud Komentar', 40, 50);

    // Draw words
    const scale = 1200 / 760;
    placedWords.forEach((word) => {
      ctx.save();
      ctx.translate(word.x * scale, word.y * scale);
      if (word.rotate) {
        ctx.rotate(-Math.PI / 2);
      }
      ctx.fillStyle = word.color;
      ctx.font = `bold ${Math.round(word.size * scale)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(word.text, 0, 0);
      ctx.restore();
    });

    // Buat link download
    const link = document.createElement('a');
    link.download = `suara-netizen-wordcloud-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Top 10 data untuk Bar Chart
  const topBarData = safeWords.slice(0, 10).map((w) => ({
    name: w.text,
    frekuensi: w.value,
    category: w.category,
    color:
      w.category === 'judol'
        ? '#dc2626'
        : w.category === 'positif'
        ? '#059669'
        : w.category === 'negatif'
        ? '#ea580c'
        : '#0f172a',
  }));

  return (
    <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Peta Kosa Kata & Analisis Frekuensi Kata (Word Cloud)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Distribusi kata paling sering muncul di komentar dengan pembedaan warna sentimen dan istilah promosi.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
          <button
            onClick={() => setViewMode('cloud')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'cloud'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            Word Cloud
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'split'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Dual Sentimen
          </button>

          <button
            onClick={() => setViewMode('barchart')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'barchart'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Diagram Batang
          </button>
        </div>
      </div>

      {/* Mode 1: Unified Archimedean Word Cloud */}
      {viewMode === 'cloud' && (
        <div className="space-y-4">
          {/* Filter Sub-categories */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium mr-1">Kategori:</span>
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua ({safeWords.length})
              </button>
              <button
                onClick={() => setFilterCategory('positif')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  filterCategory === 'positif'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <Smile className="w-3 h-3" />
                Positif ({positiveWords.length})
              </button>
              <button
                onClick={() => setFilterCategory('negatif')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  filterCategory === 'negatif'
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                }`}
              >
                <Frown className="w-3 h-3" />
                Negatif ({negativeWords.length})
              </button>
              <button
                onClick={() => setFilterCategory('judol')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  filterCategory === 'judol'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                <Flame className="w-3 h-3" />
                Spam Promosi ({judolWords.length})
              </button>
            </div>

            <button
              onClick={downloadWordCloudPNG}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh Gambar (PNG)
            </button>
          </div>

          {/* SVG Canvas Render Area */}
          <div className="relative w-full h-[420px] rounded-2xl bg-slate-50/80 border border-slate-200 overflow-hidden flex items-center justify-center">
            <svg
              viewBox="0 0 760 420"
              className="w-full h-full select-none transition-opacity duration-300"
              style={{ opacity: isGenerating ? 0.3 : 1 }}
            >
              {placedWords.map((item, idx) => (
                <text
                  key={`${item.text}-${idx}`}
                  x={item.x}
                  y={item.y}
                  transform={item.rotate ? `rotate(-90 ${item.x} ${item.y})` : undefined}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={item.size}
                  fontWeight="bold"
                  fill={item.color}
                  className="cursor-pointer hover:opacity-75 transition-opacity font-sans"
                >
                  {item.text}
                  <title>{`${item.text}: ${item.value}x (${item.category})`}</title>
                </text>
              ))}
            </svg>

            {/* Legend Overlay */}
            <div className="absolute bottom-3 left-4 flex items-center gap-4 text-[11px] bg-white/95 px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Positif
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-orange-700">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                Negatif
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-red-700">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                Spam Promosi
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                Kosa Kata Umum
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Split Sentiment Comparison Cloud (Persis Gambar 2) */}
      {viewMode === 'split' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top / Left Half: Positive Cloud */}
            <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3 mb-4">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-emerald-600" />
                  Kumpulan Kata Positif (Positive)
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  {positiveWords.length} Istilah
                </span>
              </div>

              <div className="min-h-56 flex flex-wrap items-center justify-center gap-3 p-4">
                {positiveWords.length > 0 ? (
                  positiveWords.map((item, idx) => (
                    <span
                      key={idx}
                      style={{ fontSize: `${Math.min(36, 14 + item.value * 3)}px` }}
                      className="font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
                    >
                      {item.text}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Tidak ada kata positif yang dominan.</span>
                )}
              </div>
            </div>

            {/* Bottom / Right Half: Negative & Judol Cloud */}
            <div className="p-5 rounded-2xl bg-red-50/40 border border-red-200 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-red-200/60 pb-3 mb-4">
                <span className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Frown className="w-4 h-4 text-red-600" />
                  Kumpulan Kata Negatif & Spam (Negative)
                </span>
                <span className="text-xs font-mono font-bold text-red-700">
                  {negativeWords.length + judolWords.length} Istilah
                </span>
              </div>

              <div className="min-h-56 flex flex-wrap items-center justify-center gap-3 p-4">
                {[...negativeWords, ...judolWords].length > 0 ? (
                  [...negativeWords, ...judolWords].map((item, idx) => (
                    <span
                      key={idx}
                      style={{ fontSize: `${Math.min(36, 14 + item.value * 3)}px` }}
                      className={`font-bold transition-colors ${
                        item.category === 'judol' ? 'text-red-700 underline decoration-red-300' : 'text-orange-700'
                      }`}
                    >
                      {item.text}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Tidak ada kata negatif atau spam yang dominan.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Diagram Batang Distribusi Frekuensi (Persis Gambar 3) */}
      {viewMode === 'barchart' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Top 10 Kata Paling Sering Muncul di Komentar
            </h4>
            <span className="text-xs text-slate-400">Satuan: Frekuensi</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topBarData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={12} width={80} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-lg text-xs space-y-1">
                          <p className="font-bold text-slate-900">{d.name}</p>
                          <p className="text-slate-600">
                            Frekuensi: <span className="font-bold text-slate-900">{d.frekuensi} kali</span>
                          </p>
                          <p className="text-[11px] capitalize font-medium text-blue-600">
                            Kategori: {d.category}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="frekuensi" radius={[0, 6, 6, 0]}>
                  {topBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
