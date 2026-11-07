'use client';

import React, { useState, useEffect } from 'react';
import { JudolThreatGauge } from '@/components/JudolThreatGauge';
import { SentimentChart } from '@/components/SentimentChart';
import { WordFrequencyList } from '@/components/WordFrequencyList';
import { LiteracySummaryCard } from '@/components/LiteracySummaryCard';
import { CommentsTable } from '@/components/CommentsTable';
import {
  Search,
  Sparkles,
  Shield,
  History,
  Video,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface AnalysisResult {
  video_id: string;
  video_url: string;
  video_title?: string;
  channel_name?: string;
  thumbnail_url?: string;
  total_comments_scanned: number;
  judol_risk_score: number;
  sentiment_distribution: {
    positif: number;
    netral: number;
    negatif: number;
  };
  judol_keywords_found: string[];
  word_frequencies: Array<{ text: string; value: number; type: 'judol' | 'normal' }>;
  executive_summary: string;
  comments_sample?: Array<{
    text: string;
    isJudol: boolean;
    keywords: string[];
  }>;
}

interface HistoryItem {
  id: string;
  video_id: string;
  video_title?: string;
  channel_name?: string;
  thumbnail_url?: string;
  judol_risk_score: number;
  created_at: string;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Ambil riwayat analisis terbaru saat pertama kali load
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (data.data) {
        setHistory(data.data);
      }
    } catch (e) {
      console.warn('Gagal memuat history:', e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAnalyze = async (e?: React.FormEvent, customUrl?: string) => {
    if (e) e.preventDefault();
    const targetUrl = customUrl || url;
    if (!targetUrl.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || 'Gagal memproses analisis');
      }

      setResult(resData.data);
      fetchHistory(); // Refresh riwayat setelah berhasil
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kegagalan koneksi';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const loadDemo = () => {
    const demoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    setUrl(demoUrl);
    handleAnalyze(undefined, demoUrl);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Navbar Header */}
      <header className="border-b border-border/60 bg-card/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                SiberLiterasi <span className="text-primary font-mono text-xs px-1.5 py-0.5 rounded bg-primary/10">AI</span>
              </h1>
              <p className="text-[10px] text-muted-foreground hidden sm:block">
                Sentimen Analisis & Deteksi Kontaminasi Bot Judol
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="w-3 h-3" />
              100% Free Production Stack
            </span>
            <button
              onClick={loadDemo}
              className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-medium transition-all"
            >
              Uji Coba Demo
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            Literasi Digital & Perlindungan Publik
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Analisis Sentimen Publik & Filter Bot Promosi Judi Online
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Masukkan tautan video YouTube atau postingan publik untuk mengekstraksi komentar, memetakan sentimen masyarakat, mendeteksi sindikat spam judol, dan mendapatkan panduan edukasi literasi.
          </p>
        </div>

        {/* Input Form Box */}
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={(e) => handleAnalyze(e)}
            className="p-2 sm:p-2.5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur shadow-lg flex flex-col sm:flex-row gap-2 transition-all focus-within:border-primary/50"
          >
            <div className="relative flex-1 flex items-center">
              <Video className="w-5 h-5 absolute left-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Paste link video YouTube (cth: https://youtube.com/watch?v=...)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-transparent pl-11 pr-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60 text-foreground"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Menganalisis...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Analisis Teks
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Triggers */}
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
            <span>Contoh link:</span>
            <button
              type="button"
              onClick={() => {
                const sample = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
                setUrl(sample);
                handleAnalyze(undefined, sample);
              }}
              className="text-primary hover:underline font-mono text-[11px]"
            >
              youtube.com/watch?v=dQw4w9WgXcQ
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="max-w-3xl mx-auto p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="max-w-3xl mx-auto p-8 rounded-2xl border border-border/60 bg-card/30 text-center space-y-4 animate-pulse">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-primary animate-spin">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold">Menjalankan Pipeline AI Multi-Tahap</h3>
              <p className="text-xs text-muted-foreground">
                Ekstraksi komentar ➔ Filter heuristik regex judol ➔ Nalar inferensi Llama-3.3-70B di Groq Cloud...
              </p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && !loading && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Video Overview Card */}
            <div className="p-4 sm:p-5 rounded-2xl border bg-card/60 border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {result.thumbnail_url ? (
                  <img
                    src={result.thumbnail_url}
                    alt={result.video_title || 'Thumbnail'}
                    className="w-20 h-14 object-cover rounded-lg border border-border/60 shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-14 bg-muted/40 rounded-lg flex items-center justify-center text-muted-foreground">
                    <Video className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className="text-sm sm:text-base font-bold line-clamp-1">{result.video_title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {result.channel_name} •{' '}
                    <span className="font-semibold text-foreground">{result.total_comments_scanned}</span> komentar
                    terpindai
                  </p>
                </div>
              </div>

              <a
                href={result.video_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted inline-flex items-center gap-1.5 self-end sm:self-auto"
              >
                Buka Video
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <JudolThreatGauge score={result.judol_risk_score} />
              <SentimentChart distribution={result.sentiment_distribution} />
            </div>

            {/* Public Literacy Summary */}
            <LiteracySummaryCard
              summary={result.executive_summary}
              judolScore={result.judol_risk_score}
              keywords={result.judol_keywords_found}
            />

            {/* Word Frequencies */}
            <WordFrequencyList words={result.word_frequencies} />

            {/* Comments Sample Table */}
            {result.comments_sample && <CommentsTable comments={result.comments_sample} />}
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className="pt-6 border-t border-border/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Riwayat Analisis Terbaru
                </h3>
              </div>
              <button
                onClick={fetchHistory}
                disabled={loadingHistory}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${loadingHistory ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setUrl(item.video_id.startsWith('http') ? item.video_id : `https://youtube.com/watch?v=${item.video_id}`);
                    handleAnalyze(undefined, `https://youtube.com/watch?v=${item.video_id}`);
                  }}
                  className="p-3.5 rounded-xl border border-border/60 bg-card/40 hover:bg-card hover:border-primary/40 cursor-pointer transition-all flex flex-col justify-between gap-2"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold line-clamp-1">{item.video_title || item.video_id}</h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{item.channel_name || 'YouTube'}</p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border/40">
                    <span className="text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        item.judol_risk_score >= 40
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : item.judol_risk_score >= 15
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}
                    >
                      {Math.round(item.judol_risk_score)}% Judol Risk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        <p>Inisiatif Literasi Keuangan & Perlindungan Ruang Siber Indonesia • 100% Free Open Architecture</p>
      </footer>
    </div>
  );
}
