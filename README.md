# 🛡️ SiberLiterasi AI — Sentimen & Deteksi Bot Judol

Platform analitik sentimen publik dan deteksi serbuan bot/afiliator judi online (judol) berbasis AI dengan **100% Free Production Architecture (Biaya Operasional Rp 0)** untuk memperkuat literasi digital masyarakat Indonesia.

---

## ⚡ Fitur Utama

- **Pendeteksi Kontaminasi Judol (0–100%):** Mengombinasikan filter regex pola teks gaul (*gacor*, *maxwin*, *depo*, *zeus*, *wa.me*) dan inferensi LLM Llama-3.3-70B.
- **Distribusi Sentimen Publik:** Pemetaan visual opini masyarakat (Positif, Netral, Negatif) menggunakan Recharts.
- **Word Cloud Interaktif:** Pelacakan kata kunci terpopuler dengan penandaan khusus merah untuk istilah sindikat judol.
- **Kartu Edukasi Literasi:** Ringkasan otomatis berisi saran pencegahan dan modus manipulasi yang terdeteksi.
- **Penyimpanan Terindeks & pgvector:** Database PostgreSQL di Supabase dengan ekstensi `pgvector` untuk pencarian kemiripan semantik bot.
- **Zero-Cost Out of the Box:** Aplikasi langsung dapat diuji coba dengan data demo bahkan sebelum Anda memasukkan API key!

---

## 🛠️ The 100% Free Production Stack

| Layer | Teknologi | Layanan / Provider | Biaya |
|---|---|---|---|
| **Frontend & API** | Next.js 15 (App Router) + Tailwind CSS + Lucide Icons | Vercel (Hobby Tier) | **Rp 0** |
| **Database & pgvector** | PostgreSQL + pgvector extension | Supabase (Free Tier, Singapore) | **Rp 0** |
| **Model AI Sentimen** | Llama-3.3-70B-Versatile (via Groq Cloud API) | Groq Cloud (Free Tier, 300+ token/s) | **Rp 0** |
| **Ekstraksi Komentar** | YouTube Data API v3 | Google Cloud Console (10.000 unit/hari) | **Rp 0** |

---

## 🚀 Panduan Memulai Cepat (Local Development)

### 1. Masuk ke Direktori Proyek
```bash
cd /home/wildan/sentimen-judol-analyzer
```

### 2. Konfigurasi Environment Variables
Salin berkas `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Buka `.env.local` dan masukkan kunci API gratis Anda:
```env
# 1. Supabase (Daftar gratis di https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."

# 2. Groq AI (Daftar 1-klik di https://console.groq.com/keys)
GROQ_API_KEY="gsk_..."

# 3. YouTube API (Aktifkan di https://console.cloud.google.com)
YOUTUBE_API_KEY="AIzaSy..."
```

*(Catatan: Jika kunci belum diisi, web tetap bisa jalan dalam mode Demo/Simulasi otomatis).*

### 3. Migrasi Database Supabase (pgvector)
Anda punya 2 opsi mudah:
- **Opsi A (Via Web Supabase):** Buka dashboard Supabase ➔ Menu **SQL Editor** ➔ Buka file `supabase/migrations/20261108000000_create_sentimen_judol_schema.sql` ➔ Copy dan klik **Run**.
- **Opsi B (Via Supabase CLI):**
  ```bash
  supabase link --project-ref your-project-id
  supabase db push
  ```

### 4. Jalankan Server Lokal
```bash
bun run dev
```
Buka browser di `http://localhost:3000`.

---

## 🚢 Panduan Deploy ke Production (Vercel)

1. Buat repository baru di GitHub dan push folder ini:
   ```bash
   git add .
   git commit -m "feat: initial production-ready siberliterasi AI"
   git remote add origin https://github.com/username/sentimen-judol-analyzer.git
   git push -u origin main
   ```
2. Buka [vercel.com](https://vercel.com) ➔ Klik **Add New Project** ➔ Pilih repository GitHub Anda.
3. Di bagian **Environment Variables**, masukkan 5 variabel dari `.env.local`.
4. Klik **Deploy**! Web siap diakses publik dengan SSL HTTPS gratis.
