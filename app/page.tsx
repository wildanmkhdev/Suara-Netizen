'use client';

import React, { useState } from 'react';
import { JudolThreatGauge } from '@/components/JudolThreatGauge';
import { SentimentChart } from '@/components/SentimentChart';
import { SentimentWordCloud } from '@/components/SentimentWordCloud';
import { LiteracySummaryCard } from '@/components/LiteracySummaryCard';
import { CommentsTable } from '@/components/CommentsTable';
import { WordFrequencyItem } from '@/lib/judol-keywords';
import {
  Search,
  Shield,
  Video,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  BarChart3,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
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

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

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
        throw new Error(resData.error || 'Gagal memproses analisis komentar');
      }

      setResult(resData.data);

      setTimeout(() => {
        document.getElementById('hasil-analisis')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kendala saat menghubungkan layanan';
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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Header & Navigasi */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-950">
                  Suara-Netizen
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Layanan Publik
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Analisis Sentimen & Deteksi Pola Komentar
              </p>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#fitur" className="hover:text-blue-600 transition-colors">
              Fitur Utama
            </a>
            <a href="#cara-kerja" className="hover:text-blue-600 transition-colors">
              Cara Kerja
            </a>
            <a href="#edukasi" className="hover:text-blue-600 transition-colors">
              Panduan Warga
            </a>
          </nav>

          <a
            href="#pindai"
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all shadow-sm"
          >
            Pindai Video
          </a>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-14 pb-16 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Inisiatif Literasi Informasi Digital Indonesia
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.2]">
            Ketahui Sentimen Asli Publik,{' '}
            <span className="text-blue-600">
              Saring Komentar Spam & Promosi
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Masukkan link video untuk melihat rangkuman sentimen masyarakat secara transparan, memetakan kata-kata yang paling sering dibicarakan, dan mendeteksi adanya serbuan komentar promosi atau penipuan.
          </p>

          {/* Form Pencarian & Input Link */}
          <div id="pindai" className="max-w-2xl mx-auto pt-2 scroll-mt-24">
            <form
              onSubmit={(e) => handleAnalyze(e)}
              className="p-2 rounded-2xl border-2 border-slate-300 bg-white shadow-lg flex flex-col sm:flex-row gap-2 transition-all focus-within:border-blue-600"
            >
              <div className="relative flex-1 flex items-center">
                <Video className="w-5 h-5 absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tempel tautan video YouTube di sini..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-transparent pl-11 pr-4 py-3 text-sm outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Analisis Sekarang
                  </>
                )}
              </button>
            </form>

            {/* Hanya 2 Contoh Sesuai Permintaan */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs">
              <span className="text-slate-500 font-medium">Uji Coba Langsung:</span>
              <button
                type="button"
                onClick={() => loadDemo('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
                className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50/80 hover:bg-red-100 text-red-700 font-semibold transition-all flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                1. Contoh Video Terindikasi Spam & Judol
              </button>
              <button
                type="button"
                onClick={() => loadDemo('https://www.youtube.com/watch?v=kJQP7kiw5Fk')}
                className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 font-semibold transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                2. Contoh Video Diskusi Wajar & Bersih
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Status Error & Loading */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 w-full pt-6">
          <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
            <p className="font-medium leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="max-w-4xl mx-auto px-4 w-full py-12">
          <div className="p-10 rounded-2xl border border-slate-200 bg-slate-50 text-center space-y-4 shadow-sm animate-pulse">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-blue-600 animate-spin">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">
                Sedang Membaca & Memetakan Komentar
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Mengambil data komentar publik, mengenali polaritas sentimen, menyaring kata-kata promosi tersembunyi, dan menyusun laporan visual...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Hasil Analisis Interaktif */}
      {result && !loading && (
        <section id="hasil-analisis" className="max-w-5xl mx-auto px-4 sm:px-6 w-full py-10 space-y-8 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Laporan Hasil Pemindaian
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                Ringkasan Tanggapan Komentar Publik
              </h2>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {result.total_comments_scanned} Komentar Diperiksa
            </span>
          </div>

          {/* Kartu Video Utama */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-4">
              {result.thumbnail_url ? (
                <img
                  src={result.thumbnail_url}
                  alt={result.video_title || 'Thumbnail'}
                  className="w-24 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-24 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                  <Video className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-950 line-clamp-1">
                  {result.video_title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Saluran: <span className="font-semibold text-slate-800">{result.channel_name}</span>
                </p>
              </div>
            </div>

            <a
              href={result.video_url}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 self-end sm:self-auto transition-colors"
            >
              Buka Video
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Grid Dua Kolom: Tingkat Risiko & Distribusi Sentimen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <JudolThreatGauge score={result.judol_risk_score} />
            <SentimentChart distribution={result.sentiment_distribution} />
          </div>

          {/* Kotak Ringkasan & Panduan */}
          <LiteracySummaryCard
            summary={result.executive_summary}
            judolScore={result.judol_risk_score}
            keywords={result.judol_keywords_found}
          />

          {/* Visualisasi Word Cloud Lengkap */}
          <SentimentWordCloud words={result.word_frequencies} />

          {/* Sampel Komentar Terperiksa */}
          {result.comments_sample && <CommentsTable comments={result.comments_sample} />}
        </section>
      )}

      {/* 5. Fitur Utama (#fitur) */}
      <section id="fitur" className="py-16 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Kemampuan Platform
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Fitur Lengkap untuk Memahami Komentar
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Dirancang dengan tampilan bersih dan informatif agar mudah digunakan oleh pelajar, orang tua, peneliti, dan masyarakat umum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-950">Analisis Sentimen Akurat</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Membedah polaritas komentar publik menjadi persentase Positif, Netral, dan Negatif. Mampu memahami gaya bahasa sehari-hari dan kalimat kiasan.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                <Filter className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-950">Pendeteksi Promosi & Judol</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mengenali pola teks promosi judi online, ajakan nomor WhatsApp tidak dikenal, serta link mencurigakan yang berulang kali memenuhi kolom komentar.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-950">Peta Kata & Diagram Batang</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menyajikan kata-kata yang paling sering disebut dalam bentuk Word Cloud interaktif, perbandingan kubu positif-negatif, serta grafik frekuensi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Cara Kerja Sederhana (#cara-kerja) */}
      <section id="cara-kerja" className="py-16 border-t border-slate-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Langkah Penggunaan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              3 Langkah Mudah Mendapatkan Laporan
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs inline-flex items-center justify-center">
                1
              </span>
              <h4 className="text-sm font-bold text-slate-900">Salin Link Video</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Salin tautan video YouTube apa pun yang ingin Anda ketahui opini publiknya.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs inline-flex items-center justify-center">
                2
              </span>
              <h4 className="text-sm font-bold text-slate-900">Tekan Analisis</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sistem akan memindai ratusan komentar dan mengelompokkan kata secara otomatis.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs inline-flex items-center justify-center">
                3
              </span>
              <h4 className="text-sm font-bold text-slate-900">Baca Hasil Transparan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lihat grafik sentimen, tingkat kebersihan komentar, dan unduh Word Cloud jika diperlukan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Panduan Literasi Publik (#edukasi) */}
      <section id="edukasi" className="py-16 border-t border-slate-100 bg-slate-50/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Edukasi Masyarakat
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Tips Menghindari Jebakan Komentar Palsu
            </h2>
            <p className="text-xs text-slate-600">
              Tingkatkan kehati-hatian saat berselancar di media sosial agar terhindar dari penipuan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-white flex items-start gap-3 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                ✓
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">Abaikan Klaim Modal Kecil Menang Banyak</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Komentar yang mengaku menang jutaan dari modal receh adalah akun buatan atau copy-paste untuk memancing korban.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white flex items-start gap-3 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                ✓
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">Jangan Klik Link Pendek di Bio</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ajakan seperti &quot;cek link di bio profil&quot; umumnya mengarah ke situs ilegal atau skema pencurian data pribadi.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white flex items-start gap-3 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                ✓
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">Waspada Nomor WhatsApp Anonim</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Penyebaran nomor kontak di kolom komentar video adalah trik menggiring korban ke percakapan pribadi tanpa filter keamanan platform.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white flex items-start gap-3 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                ✓
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">Perhatikan Kesamaan Pola Teks</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Jika beberapa akun berbeda menggunakan susunan kalimat dan kata-kata yang persis sama, itu adalah akun bot terkoordinasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer Bersih */}
      <footer className="border-t border-slate-200 py-10 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
              SN
            </div>
            <span className="font-bold text-slate-900">Suara-Netizen</span>
            <span>• Layanan Literasi Informasi & Analisis Opini Publik</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#pindai" className="hover:text-blue-600 transition-colors">
              Pindai Video
            </a>
            <a href="#fitur" className="hover:text-blue-600 transition-colors">
              Fitur
            </a>
            <a href="#edukasi" className="hover:text-blue-600 transition-colors">
              Edukasi
            </a>
            <a
              href="https://github.com/wildanmkhdev/Suara-Netizen"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition-colors inline-flex items-center gap-1"
            >
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
