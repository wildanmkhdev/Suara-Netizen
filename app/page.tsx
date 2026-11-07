'use client';

import React, { useState, useEffect } from 'react';
import { JudolThreatGauge } from '@/components/JudolThreatGauge';
import { SentimentChart } from '@/components/SentimentChart';
import { SentimentWordCloud } from '@/components/SentimentWordCloud';
import { WordFrequencyItem } from '@/lib/judol-keywords';
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
  CheckCircle2,
  TrendingUp,
  Cpu,
  Database,
  ArrowRight,
  ShieldAlert,
  BarChart3,
  Bot,
  MessageSquare,
  Eye,
  Lock,
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
  word_frequencies: WordFrequencyItem[];
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
      fetchHistory();

      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('hasil-analisis')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kegagalan koneksi';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const loadDemo = (sampleUrl: string) => {
    setUrl(sampleUrl);
    handleAnalyze(undefined, sampleUrl);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      {/* 1. Header & Navigation */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center text-primary shadow-sm group-hover:border-primary/60 transition-all">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-foreground">
                  Suara-Netizen
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  AI v1.0
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Radar Sentimen & Filter Manipulasi Digital
              </p>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-medium text-muted-foreground">
            <a href="#analisis" className="hover:text-foreground transition-colors">
              Pindai Video
            </a>
            <a href="#fitur" className="hover:text-foreground transition-colors">
              Fitur Utama
            </a>
            <a href="#literasi" className="hover:text-foreground transition-colors">
              Krisis Literasi
            </a>
            <a href="#teknologi" className="hover:text-foreground transition-colors">
              Arsitektur Sistem
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Aktif
            </span>
            <a
              href="#analisis"
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs transition-all hover:opacity-90 shadow-sm shadow-primary/25"
            >
              Mulai Analisis
            </a>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Glow Mesh Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-muted/60 border border-primary/25 text-primary shadow-sm backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            Inisiatif Kecerdasan Buatan Terbuka • Perlindungan Netizen Indonesia
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Dengarkan Suara Netizen Asli,{' '}
            <span className="bg-gradient-to-r from-primary via-sky-300 to-teal-300 bg-clip-text text-transparent">
              Saring Bising Sindikat Bot & Judol
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Platform AI pertama di Indonesia yang mengurai sentimen percakapan publik, membedah opini organik, dan melacak serbuan bot promosi judi online di kolom komentar media sosial secara real-time.
          </p>

          {/* Interactive URL Search Box */}
          <div id="analisis" className="max-w-3xl mx-auto pt-4 scroll-mt-24">
            <form
              onSubmit={(e) => handleAnalyze(e)}
              className="p-2 sm:p-2.5 rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-xl shadow-2xl shadow-primary/10 flex flex-col sm:flex-row gap-2 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
            >
              <div className="relative flex-1 flex items-center">
                <Video className="w-5 h-5 absolute left-3.5 text-primary" />
                <input
                  type="text"
                  placeholder="Tempel tautan video YouTube (misal: https://youtube.com/watch?v=...)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-transparent pl-11 pr-4 py-3 text-sm outline-none placeholder:text-muted-foreground/60 text-foreground font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="px-7 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/30"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Membedah Data...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Pindai Sentimen
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground/80">Coba Analisis Cepat:</span>
              <button
                type="button"
                onClick={() => loadDemo('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
                className="px-2.5 py-1 rounded-lg border border-border/70 hover:border-primary/50 bg-card/40 hover:bg-card text-[11px] font-mono text-primary transition-all flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3 text-red-400" />
                Sampel Kontaminasi Judol
              </button>
              <button
                type="button"
                onClick={() => loadDemo('https://www.youtube.com/watch?v=kJQP7kiw5Fk')}
                className="px-2.5 py-1 rounded-lg border border-border/70 hover:border-primary/50 bg-card/40 hover:bg-card text-[11px] font-mono text-emerald-400 transition-all flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" />
                Sampel Diskusi Organik
              </button>
            </div>
          </div>

          {/* Social Proof Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-border/40">
            <div className="p-3.5 rounded-xl bg-card/40 border border-border/50 text-center">
              <p className="text-xl sm:text-2xl font-extrabold text-foreground">100K+</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Komentar Terpindai</p>
            </div>
            <div className="p-3.5 rounded-xl bg-card/40 border border-border/50 text-center">
              <p className="text-xl sm:text-2xl font-extrabold text-red-400">40+</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Pola Samaran Judol</p>
            </div>
            <div className="p-3.5 rounded-xl bg-card/40 border border-border/50 text-center">
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-400">&lt; 3 Detik</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Inferensi Cepat Llama-70B</p>
            </div>
            <div className="p-3.5 rounded-xl bg-card/40 border border-border/50 text-center">
              <p className="text-xl sm:text-2xl font-extrabold text-primary">Rp 0</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Bebas Akses Publik</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Error & Loading Feedback */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 w-full">
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="leading-relaxed font-medium">{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="max-w-4xl mx-auto px-4 w-full">
          <div className="p-10 rounded-2xl border border-primary/30 bg-card/50 backdrop-blur text-center space-y-4 animate-pulse">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary animate-spin">
              <RefreshCw className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-foreground">
                Membedah Komentar & Menganalisis Pola Bahasa
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                Menghubungkan YouTube Data API ➔ Memfilter pola teks tersembunyi ➔ Mengirim batch komentar ke mesin nalar Llama-3.3-70B di Groq Cloud...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Active Analysis Results Workspace */}
      {result && !loading && (
        <section id="hasil-analisis" className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-10 space-y-8 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Hasil Pemindaian Real-Time
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                Laporan Integritas Diskusi Publik
              </h2>
            </div>
            <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-3 py-1 rounded-lg border border-border">
              ID: {result.video_id}
            </span>
          </div>

          {/* Video Overview Card */}
          <div className="p-5 rounded-2xl border bg-card/70 border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              {result.thumbnail_url ? (
                <img
                  src={result.thumbnail_url}
                  alt={result.video_title || 'Thumbnail'}
                  className="w-24 h-16 object-cover rounded-xl border border-border/80 shadow-md shrink-0"
                />
              ) : (
                <div className="w-24 h-16 bg-muted/50 rounded-xl flex items-center justify-center text-muted-foreground shrink-0">
                  <Video className="w-7 h-7" />
                </div>
              )}
              <div>
                <h3 className="text-base font-bold line-clamp-1 text-foreground">{result.video_title}</h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                  <span>{result.channel_name}</span>
                  <span>•</span>
                  <span className="font-semibold text-primary">{result.total_comments_scanned} Komentar Terpindai</span>
                </p>
              </div>
            </div>

            <a
              href={result.video_url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold inline-flex items-center gap-1.5 transition-all self-end sm:self-auto"
            >
              Lihat di YouTube
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Core Risk Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <JudolThreatGauge score={result.judol_risk_score} />
            <SentimentChart distribution={result.sentiment_distribution} />
          </div>

          {/* Public Literacy Synthesis Card */}
          <LiteracySummaryCard
            summary={result.executive_summary}
            judolScore={result.judol_risk_score}
            keywords={result.judol_keywords_found}
          />

          {/* Keyword Analytics & Word Cloud */}
          {/* Advanced Archimedean Word Cloud & Sentiment Split */}
          <SentimentWordCloud words={result.word_frequencies} />

          {/* Comment Stream Samples */}
          {result.comments_sample && <CommentsTable comments={result.comments_sample} />}
        </section>
      )}

      {/* 5. Bento Grid: Fitur Unggulan (#fitur) */}
      <section id="fitur" className="py-20 border-t border-border/40 bg-card/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Kecerdasan Buatan Terpadu
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Dirancang untuk Menjaga Kualitas Ruang Digital
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Memadukan NLP tingkat tinggi, model bahasa 70 miliar parameter, dan detektor pola lokal untuk menghadirkan transparansi utuh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Large */}
            <div className="md:col-span-2 p-8 rounded-3xl border border-border/70 bg-gradient-to-br from-card to-card/40 relative overflow-hidden flex flex-col justify-between group hover:border-primary/50 transition-all">
              <div className="space-y-4 max-w-lg z-10">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  Radar Penyingkap Sindikat Bot & Promosi Judol
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Sindikat judi online mengerahkan ribuan akun robotik terorganisir untuk membanjiri video viral. Suara-Netizen mendeteksi 40+ variasi pola kata samaran (*gacor, zeus, depo, maxwin, link bio*) yang sering luput dari penglihatan biasa.
                </p>
              </div>
              <div className="pt-6 flex flex-wrap gap-2 text-[11px] font-mono z-10">
                <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
                  pola: rtp live
                </span>
                <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
                  pola: modal receh
                </span>
                <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
                  pola: wa.me/xxx
                </span>
                <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
                  pola: garansi kekalahan
                </span>
              </div>
            </div>

            {/* Bento Card 2: Deep NLP */}
            <div className="p-8 rounded-3xl border border-border/70 bg-card/60 flex flex-col justify-between space-y-4 hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Paham Sarkasme Netizen</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ditenagai Llama-3.3-70B, sistem tidak tertipu oleh kalimat sarkas seperti *&quot;Hebat banget nih bikin tabungan ludes&quot;*. AI paham konteks emosional asli masyarakat.
                </p>
              </div>
              <div className="pt-2 text-xs font-semibold text-primary flex items-center gap-1">
                Akurasi Nalar Semantik <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Bento Card 3: Word Cloud */}
            <div className="p-8 rounded-3xl border border-border/70 bg-card/60 flex flex-col justify-between space-y-4 hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Visualisasi Topik & Frekuensi</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Menyajikan kata-kata yang paling dominan diperbincangkan. Istilah mencurigakan otomatis diberi kode warna merah mencolok untuk kewaspadaan instan.
                </p>
              </div>
              <div className="pt-2 text-xs font-semibold text-teal-400 flex items-center gap-1">
                Pemetaan Topik Otomatis <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Bento Card 4: Database Lineage */}
            <div className="md:col-span-2 p-8 rounded-3xl border border-border/70 bg-card/60 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-primary/50 transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Penyimpanan Terindeks & Vector Search (pgvector)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                  Setiap pemindaian tersimpan secara aman di database PostgreSQL Supabase dengan indeks vektor HNSW untuk melacak kesamaan pola bot antar-video secara lintas kanal.
                </p>
              </div>
              <div className="shrink-0 p-4 rounded-2xl bg-muted/40 border border-border text-center space-y-1">
                <span className="text-xs text-muted-foreground font-mono">Status Mesin Data</span>
                <p className="text-sm font-extrabold text-emerald-400">PostgreSQL 17 + pgvector</p>
                <p className="text-[10px] text-muted-foreground">Region: Singapore (Low Latency)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Edukasi: 4 Modus Utama Sindikat Judol (#literasi) */}
      <section id="literasi" className="py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Edukasi & Kewaspadaan Nasional
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Kenali 4 Modus Sindikat Membajak Komentar
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Judi online menghabiskan ratusan triliun uang rakyat melalui jebakan psikologis di ruang percakapan media sosial. Jangan pernah tergiur pola-pola ini.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-border/70 bg-card/40 space-y-3">
              <span className="text-xs font-bold text-red-400 font-mono">01. Modus Admin Bocoran</span>
              <h4 className="text-sm font-bold">Mengaku Punya Orang Dalam</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Akun bot mengklaim mendapat pola gacor dari &quot;admin jarwo&quot; atau &quot;admin riki&quot; untuk meyakinkan korban bahwa kemenangan dapat diatur.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/70 bg-card/40 space-y-3">
              <span className="text-xs font-bold text-amber-400 font-mono">02. Testimoni Kemenangan Palsu</span>
              <h4 className="text-sm font-bold">Kisah Sukses Fiktif</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Rangkaian komentar bot yang saling sahut menceritakan bagaimana mereka melunasi hutang dan menang puluhan juta dari modal receh 25 ribu rupiah.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/70 bg-card/40 space-y-3">
              <span className="text-xs font-bold text-sky-400 font-mono">03. Penyelubungan Tautan Bio</span>
              <h4 className="text-sm font-bold">Menghindari Filter URL YouTube</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Karena YouTube melarang link langsung di komentar, mereka memakai frasa &quot;cek bio profil&quot; atau menaruh link pendek (bit.ly/wa.me) di deskripsi profil bot.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/70 bg-card/40 space-y-3">
              <span className="text-xs font-bold text-emerald-400 font-mono">04. Skema Garansi Kekalahan</span>
              <h4 className="text-sm font-bold">Jaminan Modal Kembali</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Iming-iming bonus deposit 100% atau garansi modal kembali jika rungkad, yang sebenarnya mengunci saldo korban dengan syarat turnover mustahil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Arsitektur Terbuka (#teknologi) */}
      <section id="teknologi" className="py-20 border-t border-border/40 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              100% Free Production Stack
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Arsitektur Modern Tanpa Biaya Server
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Didesain dengan efisiensi tinggi memanfaatkan serverless edge compute dan model inference canggih tanpa beban biaya operasional.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl border border-border/60 bg-card/60 space-y-2">
              <span className="text-[10px] font-mono text-primary uppercase">Frontend & API</span>
              <h4 className="text-sm font-bold text-foreground">Next.js 15 (App Router)</h4>
              <p className="text-[11px] text-muted-foreground">Hosting global di Vercel Edge Network bersertifikat SSL otomatis.</p>
            </div>

            <div className="p-4 rounded-xl border border-border/60 bg-card/60 space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 uppercase">Database & Vektor</span>
              <h4 className="text-sm font-bold text-foreground">Supabase PostgreSQL 17</h4>
              <p className="text-[11px] text-muted-foreground">Dilengkapi pgvector untuk pencarian kemiripan bot dan caching instan.</p>
            </div>

            <div className="p-4 rounded-xl border border-border/60 bg-card/60 space-y-2">
              <span className="text-[10px] font-mono text-purple-400 uppercase">AI Reasoning Core</span>
              <h4 className="text-sm font-bold text-foreground">Llama-3.3-70B / Grok</h4>
              <p className="text-[11px] text-muted-foreground">Inferensi kilat 300+ token/detik melalui akselerator Groq LPU.</p>
            </div>

            <div className="p-4 rounded-xl border border-border/60 bg-card/60 space-y-2">
              <span className="text-[10px] font-mono text-red-400 uppercase">Data Ingestion</span>
              <h4 className="text-sm font-bold text-foreground">YouTube Data API v3</h4>
              <p className="text-[11px] text-muted-foreground">Ekstraksi ratusan komentar resmi dengan batas kuota 10.000 unit/hari.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Recent Analyses History */}
      {history.length > 0 && (
        <section className="py-16 border-t border-border/40 max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Arsip Pemindaian Terkini Publik
              </h3>
            </div>
            <button
              onClick={fetchHistory}
              disabled={loadingHistory}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-medium transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
              Segarkan Riwayat
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  const target = item.video_id.startsWith('http')
                    ? item.video_id
                    : `https://youtube.com/watch?v=${item.video_id}`;
                  setUrl(target);
                  handleAnalyze(undefined, target);
                }}
                className="p-4 rounded-2xl border border-border/60 bg-card/40 hover:bg-card hover:border-primary/50 cursor-pointer transition-all flex flex-col justify-between gap-3 shadow-sm hover:shadow-md"
              >
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold line-clamp-2 leading-relaxed text-foreground">
                    {item.video_title || item.video_id}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{item.channel_name || 'YouTube'}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-3 border-t border-border/40">
                  <span className="text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      item.judol_risk_score >= 40
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                        : item.judol_risk_score >= 15
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {Math.round(item.judol_risk_score)}% Risiko Judol
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. Footer */}
      <footer className="border-t border-border/40 py-10 bg-card/40 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-foreground">Suara-Netizen AI</span>
            <span>• Gerakan Terbuka Literasi Siber Indonesia</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/wildanmkhdev/Suara-Netizen"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <span>GitHub Repository</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a href="#analisis" className="hover:text-foreground transition-colors">
              Pindai Sekarang
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
