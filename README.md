# Suara Netizen

Layanan untuk membaca sentimen, frekuensi kata, dan indikasi pola promosi atau pengulangan dalam komentar YouTube dan balasan X (Twitter). Hasil membantu memahami percakapan; tidak membuktikan identitas akun, kebenaran sebuah klaim, atau tindakan penulis komentar.

## Antarmuka

- Landing page hitam-putih dengan tipografi Bricolage Grotesque dan ilustrasi telapak lima jari **STOP HOAKS**.
- Input video YouTube/Shorts dan postingan X publik, dengan validasi tautan, status proses, dan pesan kesalahan.
- Tiga contoh ilustratif: percakapan biasa, indikasi promosi judol, dan utas X. Contoh tidak dikirim ke layanan eksternal atau disimpan sebagai pemindaian.
- Dashboard menampilkan pie penanda teks, batang sentimen pemindaian, dan pita kategori tautan secara bersamaan. Hover/fokus memperlihatkan rincian; klik atau Enter/Space menyaring komentar teratas tanpa menyembunyikan grafik lain. Setiap grafik menyebutkan basis datanya: seluruh pemindaian atau cuplikan komentar.
- Komentar teratas tersedia di samping dashboard pada desktop, dengan pencarian, filter, urutan berdasarkan metadata yang tersedia, dan pilihan menampilkan seluruh cuplikan.
- Delapan kata pratinjau muncul berurutan saat masuk layar: durasi 600 ms per kata, jeda mulai 700 ms. Animasi scroll berdurasi 1.400 ms. Reduced motion menampilkan isi langsung tanpa gerakan atau penundaan.
- Peta kata hasil analisis, tampilan per kategori, batang frekuensi, tabel lengkap, dan unduhan PNG tetap tersedia. Kata yang tidak muat di gambar tetap ada di tabel.
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

Backend memindai hingga 1.000 komentar tingkat atas YouTube atau balasan yang tersedia dari API pencarian terbaru X (jendela tujuh hari). Cuplikan hingga 30 komentar diurutkan berdasarkan jumlah suka yang tersedia dalam sampel, bukan klaim peringkat seluruh platform. Nilai suka nol dibedakan dari metadata yang tidak tersedia. API X memakai `TWITTER_BEARER_TOKEN` atau `X_BEARER_TOKEN`; YouTube memakai `YOUTUBE_API_KEY` di lingkungan server.

Laporan cache mengambil kembali komentar yang benar-benar tersimpan di tabel `comments`. Arsip lama tidak menyimpan ID/permalink sumber, waktu publikasi, jumlah suka, atau urutan peringkat; antarmuka tidak mengarang metadata tersebut. Cache tanpa komentar mengambil kembali sumber. Bila sumber tidak berhasil diperoleh, respons demonstrasi diberi `source: demo`, catatan data sintetis, dan tidak disimpan sebagai data live.

Repository: https://github.com/wildanmkhdev/Suara-Netizen

Website: https://suara-netizen.vercel.app

Paket gratis layanan hosting/API tetap mengikuti kuota dan ketentuan masing-masing penyedia, bukan jaminan biaya nol tanpa batas.

## Aset

Foto tangan memegang telepon: **Man-person-smartphone-technology (24029613340)**, www.Pixel.la Free Stock Photos, [Wikimedia Commons](https://commons.wikimedia.org/w/index.php?curid=51440745), [CC0](https://creativecommons.org/publicdomain/zero/1.0/). Versi lokal di `public/images/literasi-digital.webp`; kredit ditampilkan di footer. Ilustrasi laporan dan grafik berasal dari contoh percakapan yang diberi label ilustratif.

Ilustrasi telapak tangan monokrom dibuat khusus untuk banner; aset lokal `public/images/stop-hoaks.svg`, dengan lettering yang mengikuti font halaman. Tidak memakai gambar eksternal baru.
