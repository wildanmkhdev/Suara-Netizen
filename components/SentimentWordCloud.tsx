'use client';

import React, { useState, useEffect, useRef } from 'react';
import { WordFrequencyItem } from '@/lib/judol-keywords';
import {
  Cloud,
  Flame,
  Smile,
  Frown,
  Download,
  BarChart2,
  Layers,
  Sparkles,
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter kata berdasarkan kategori yang dipilih
  const filteredWords = words.filter((w) => {
    if (filterCategory === 'all') return true;
    return w.category === filterCategory;
  });

  const judolWords = words.filter((w) => w.category === 'judol');
  const positiveWords = words.filter((w) => w.category === 'positif');
  const negativeWords = words.filter((w) => w.category === 'negatif');

  // Algoritma Archimedean Spiral Word Cloud Layout (Persis seperti Python WordCloud)
  useEffect(() => {
    if (!filteredWords || filteredWords.length === 0) {
      setPlacedWords([]);
      return;
    }

    setIsGenerating(true);

    const width = 760;
    const height = 440;
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
      // Skala ukuran font dari 14px s/d 54px
      const normalizedSize =
        maxVal === minVal
          ? 28
          : 14 + ((wordItem.value - minVal) / (maxVal - minVal)) * 40;

      // Rotasi 0 derajat (horizontal) atau 90 derajat (vertikal)
      const rotate = idx % 5 === 2; // ~20% kata vertikal untuk variasi visual artistik

      let textWidth = 60;
      let textHeight = normalizedSize;

      if (ctx) {
        ctx.font = `bold ${normalizedSize}px sans-serif`;
        textWidth = ctx.measureText(wordItem.text).width + 8;
        textHeight = normalizedSize * 1.1;
      }

      const w = rotate ? textHeight : textWidth;
      const h = rotate ? textWidth : textHeight;

      // Pemilihan warna berdasarkan sentimen
      let color = '#38bdf8'; // Netral / General (Sky Cyan)
      if (wordItem.category === 'judol') {
        color = '#ff0055'; // Judol / Spam (Bright Crimson Neon)
      } else if (wordItem.category === 'positif') {
        color = '#10b981'; // Positif (Emerald Green)
      } else if (wordItem.category === 'negatif') {
        color = '#f97316'; // Negatif (Vibrant Orange-Red)
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

        // Cek tabrakan bounding box
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

    // Background gelap modern
    ctx.fillStyle = '#060911';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Judul & Watermark
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px sans-serif';
    ctx.fillText('Suara-Netizen AI • Analisis Sentimen & Word Cloud', 40, 50);

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
  const topBarData = words.slice(0, 10).map((w) => ({
    name: w.text,
    frekuensi: w.value,
    category: w.category,
    color:
      w.category === 'judol'
        ? '#ef4444'
        : w.category === 'positif'
        ? '#10b981'
        : w.category === 'negatif'
        ? '#f97316'
        : '#38bdf8',
  }));

  return (
    <div className="p-6 rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl shadow-xl space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-primary" />
            <h3 className="text-base font-extrabold text-foreground tracking-tight">
              Visualisasi Word Cloud & Analisis Frekuensi Kata
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Grafik distribusi kosa kata yang diekstraksi dari komentar YouTube berdasarkan frekuensi kemunculan dan polaritas sentimen.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 self-start sm:self-auto text-xs">
          <button
            onClick={() => setViewMode('cloud')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'cloud'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            Word Cloud
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'split'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Dual Sentimen
          </button>

          <button
            onClick={() => setViewMode('barchart')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'barchart'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
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
              <span className="text-muted-foreground font-medium mr-1">Filter Kategori:</span>
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  filterCategory === 'all'
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                Semua ({words.length})
              </button>
              <button
                onClick={() => setFilterCategory('positif')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 ${
                  filterCategory === 'positif'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-muted/40 text-muted-foreground hover:text-emerald-400'
                }`}
              >
                <Smile className="w-3 h-3" />
                Positif ({positiveWords.length})
              </button>
              <button
                onClick={() => setFilterCategory('negatif')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 ${
                  filterCategory === 'negatif'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                    : 'bg-muted/40 text-muted-foreground hover:text-orange-400'
                }`}
              >
                <Frown className="w-3 h-3" />
                Negatif ({negativeWords.length})
              </button>
              <button
                onClick={() => setFilterCategory('judol')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 ${
                  filterCategory === 'judol'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-muted/40 text-muted-foreground hover:text-red-400'
                }`}
              >
                <Flame className="w-3 h-3" />
                Spam Judol ({judolWords.length})
              </button>
            </div>

            <button
              onClick={downloadWordCloudPNG}
              className="px-3 py-1.5 rounded-lg border border-border/80 hover:border-primary/50 bg-card hover:bg-muted text-xs font-semibold text-primary transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh Gambar (PNG)
            </button>
          </div>

          {/* SVG Canvas Render Area */}
          <div className="relative w-full h-[440px] rounded-2xl bg-gradient-to-b from-[#090e1c] to-[#060911] border border-border/60 overflow-hidden flex items-center justify-center shadow-inner">
            <svg
              viewBox="0 0 760 440"
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
                  className="cursor-pointer hover:opacity-80 transition-opacity drop-shadow-sm font-sans"
                >
                  {item.text}
                  <title>{`${item.text}: ${item.value}x (${item.category})`}</title>
                </text>
              ))}
            </svg>

            {/* Legend Overlay */}
            <div className="absolute bottom-3 left-4 flex items-center gap-4 text-[10px] bg-background/80 backdrop-blur px-3 py-1.5 rounded-lg border border-border/60">
              <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Sentimen Positif
              </span>
              <span className="flex items-center gap-1.5 font-medium text-orange-400">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                Sentimen Negatif
              </span>
              <span className="flex items-center gap-1.5 font-medium text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                Indikasi Spam Judol
              </span>
              <span className="flex items-center gap-1.5 font-medium text-sky-400">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                Kosa Kata Publik
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
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Smile className="w-4 h-4" />
                  Kumpulan Kata Positif (Positive)
                </span>
                <span className="text-xs font-mono text-emerald-300">
                  {positiveWords.length} Istilah
                </span>
              </div>

              <div className="min-h-56 flex flex-wrap items-center justify-center gap-3 p-4">
                {positiveWords.length > 0 ? (
                  positiveWords.map((item, idx) => (
                    <span
                      key={idx}
                      style={{ fontSize: `${Math.min(36, 14 + item.value * 3)}px` }}
                      className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors drop-shadow"
                    >
                      {item.text}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">Tidak ada kata positif yang dominan.</span>
                )}
              </div>
            </div>

            {/* Bottom / Right Half: Negative & Judol Cloud */}
            <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-red-500/20 pb-3 mb-4">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Frown className="w-4 h-4" />
                  Kumpulan Kata Negatif & Judol (Negative)
                </span>
                <span className="text-xs font-mono text-red-300">
                  {negativeWords.length + judolWords.length} Istilah
                </span>
              </div>

              <div className="min-h-56 flex flex-wrap items-center justify-center gap-3 p-4">
                {[...negativeWords, ...judolWords].length > 0 ? (
                  [...negativeWords, ...judolWords].map((item, idx) => (
                    <span
                      key={idx}
                      style={{ fontSize: `${Math.min(36, 14 + item.value * 3)}px` }}
                      className={`font-bold transition-colors drop-shadow ${
                        item.category === 'judol' ? 'text-red-500 underline decoration-red-500/40' : 'text-orange-400'
                      }`}
                    >
                      {item.text}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">Tidak ada kata negatif/judol yang dominan.</span>
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
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Top 10 Kata Paling Sering Muncul di Komentar
            </h4>
            <span className="text-xs text-muted-foreground">Satuan: Frekuensi</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topBarData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={80} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-popover border border-border px-3 py-1.5 rounded-lg shadow-md text-xs space-y-1">
                          <p className="font-bold text-popover-foreground">{d.name}</p>
                          <p className="text-muted-foreground">
                            Frekuensi: <span className="font-bold text-foreground">{d.frekuensi} kali</span>
                          </p>
                          <p className="text-[10px] capitalize text-primary">Kategori: {d.category}</p>
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
