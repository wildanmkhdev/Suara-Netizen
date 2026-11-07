# Suara Netizen

Layanan untuk membaca sentimen, frekuensi kata, dan indikasi promosi dalam komentar YouTube. Hasil membantu memahami percakapan; tidak membuktikan identitas akun, kebenaran sebuah klaim, atau tindakan penulis komentar.

## Antarmuka

- Landing page putih dengan tipografi Bricolage Grotesque, informasi fitur, cara pakai, dan bantuan.
- Input video YouTube dan Shorts publik, dengan label, validasi tautan, serta status proses dan kesalahan.
- Dua contoh ilustratif: indikasi promosi dan percakapan biasa. Contoh tidak dikirim ke layanan eksternal atau disimpan sebagai pemindaian video.
- Perkiraan sentimen, penanda promosi, ringkasan, serta filter sampel komentar.
- Peta kata, tampilan per kategori, batang frekuensi, tabel lengkap, dan unduhan PNG. Kata yang tidak muat di gambar tetap ada di tabel.
- Tidak ada feed arsip publik atau informasi model/infrastruktur di landing page.

Kategori kata berbeda dari sentimen kalimat. Data lama yang belum memiliki kategori ditampilkan sebagai **Belum dikategorikan**, bukan diasumsikan netral.

## Menjalankan proyek

```bash
bun install
bun run dev
```

Buka `http://localhost:3000`. Contoh ilustratif dapat digunakan tanpa kunci API. Untuk pemindaian video, gunakan konfigurasi lingkungan proyek yang sudah dipasang di `.env.local` atau lingkungan deployment. Jangan masukkan kunci rahasia ke source code atau Git.

```bash
bun run lint
bun run build
bun run start
```

## Styling

CSS Modules menangani gaya komponen; `app/globals.css` menyimpan token bersama. Tailwind diproses melalui `@tailwindcss/postcss` pada `postcss.config.mjs`.

Jangan menambahkan rule Turbopack yang mengubah semua `*.css` menjadi CSS global. Rule tersebut sebelumnya menghilangkan ekspor class dari `*.module.css`; build yang berhasil saja tidak membuktikan styling tampil. Periksa class dan computed style di browser.

## Data dan deployment

Skema database tetap berada di `supabase/migrations/`. Backend dan skema tidak diubah dalam remake frontend ini. Akurasi NLP dan autentikasi provider model bukan bagian dari verifikasi visual; hasil otomatis ditampilkan dengan peringatan bahwa hasil bersifat indikatif dan belum diverifikasi.

Laporan tersimpan lama mungkin tidak membawa sampel komentar atau kategori kata. Antarmuka menampilkan kondisi kosong tersebut secara eksplisit.

Repository: https://github.com/wildanmkhdev/Suara-Netizen

Website: https://suara-netizen.vercel.app

Paket gratis layanan hosting/API tetap mengikuti kuota dan ketentuan masing-masing penyedia, bukan jaminan biaya nol tanpa batas.

## Aset

Foto tangan memegang telepon: **Man-person-smartphone-technology (24029613340)**, www.Pixel.la Free Stock Photos, [Wikimedia Commons](https://commons.wikimedia.org/w/index.php?curid=51440745), [CC0](https://creativecommons.org/publicdomain/zero/1.0/). Versi lokal di `public/images/literasi-digital.webp`; kredit ditampilkan di footer. Ilustrasi laporan dan grafik berasal dari contoh percakapan yang diberi label ilustratif.
