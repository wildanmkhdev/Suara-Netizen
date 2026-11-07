import Image from 'next/image';
import { AnalyzerWorkspace } from '@/components/AnalyzerWorkspace';
import { MobileNav } from '@/components/MobileNav';
import { REPORT_EXAMPLES } from '@/lib/report-examples';
import styles from './page.module.css';

const sample = REPORT_EXAMPLES.discussion;
const promotion = REPORT_EXAMPLES.promotion;
const topWords = sample.word_frequencies.slice(0, 8);
const wordPreviewPositions = [[150, 55], [360, 55], [480, 65], [135, 115], [365, 118], [500, 145], [180, 185], [440, 194]] as const;

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a href="#top" aria-label="Suara Netizen, kembali ke awal" className={footer ? styles.footerBrand : styles.brand}>
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M4 5h19v14H12l-5 5v-5H4V5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M24 12h4v14h-6l-4 3v-3h-5v-4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 10h9M9 14h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span>Suara Netizen</span>
    </a>
  );
}

export default function Home() {
  return (
    <div id="top" className={styles.page}>
      <a className={styles.skipLink} href="#main">Lewati navigasi</a>
      <header className={styles.header}>
        <Brand />
        <nav className={styles.navigation} aria-label="Navigasi utama">
          <a href="#fitur">Fitur</a>
          <a href="#cara-kerja">Cara pakai</a>
          <a href="#bantuan">Bantuan</a>
        </nav>
        <a href="#pindai" className={styles.headerAction}>Coba analisis</a>
        <MobileNav />
      </header>
      <main id="main" tabIndex={-1} className={styles.main}>
        <AnalyzerWorkspace />

        <section id="fitur" className={styles.features} aria-labelledby="feature-title">
          <div className={styles.sectionIntro}>
            <h2 id="feature-title">Komentar ramai.<br />Gambaran lebih jelas.</h2>
            <p>Berhenti menebak dari satu komentar. Lihat pola percakapan, lalu baca kembali konteksnya.</p>
          </div>
          <div className={styles.featureContent}>
            <article className={styles.featureRow}>
              <div className={styles.featureCopy}>
                <h3>Sentimen percakapan</h3>
                <p>Lihat perkiraan porsi tanggapan positif, netral, dan negatif pada komentar yang diperiksa. Sebuah kritik bukan berarti spam.</p>
              </div>
              <figure className={styles.featureFigure}>
                <div className={styles.sentimentPreview} data-ui>
                  <span>Perkiraan sentimen</span>
                  <div className={styles.sentimentBars}>
                    {(['positif', 'netral', 'negatif'] as const).map((label) => (
                      <div className={styles.sentimentRow} key={label}>
                        <span>{label}</span>
                        <div className={styles.barTrack}><i className={styles[label]} style={{ width: `${sample.sentiment_distribution[label]}%` }} /></div>
                        <strong>{sample.sentiment_distribution[label]}%</strong>
                      </div>
                    ))}
                  </div>
                </div>
                <figcaption>Contoh dari {sample.total_comments_scanned} komentar ilustratif.</figcaption>
              </figure>
            </article>

            <article className={styles.featureRow}>
              <div className={styles.featureCopy}>
                <h3>Kata yang menonjol</h3>
                <p>Word cloud memperlihatkan kata yang paling sering muncul. Bandingkan kosakata dan lihat frekuensinya, lalu unduh gambarnya.</p>
              </div>
              <figure className={styles.featureFigure}>
                <div className={styles.wordsPreview} data-ui>
                  <svg viewBox="0 0 600 220" className={styles.wordPlot} role="img" aria-label="Contoh word cloud dari percakapan ilustratif">
                    {topWords.map((word, index) => {
                      const [x, y] = wordPreviewPositions[index];
                      return <text key={word.text} x={x} y={y} textAnchor="middle" aria-label={`${word.text}: ${word.value} kali`} fontSize={Math.min(40, 28 + word.value * 2)} fontWeight={500}>{word.text}</text>;
                    })}
                  </svg>
                </div>
                <figcaption>Ukuran kata mengikuti frekuensi dalam contoh percakapan.</figcaption>
              </figure>
            </article>

            <article className={styles.featureRow}>
              <div className={styles.featureCopy}>
                <h3>Indikasi promosi</h3>
                <p>Kenali ajakan promosi dan istilah yang perlu ditinjau, termasuk promosi judi online. Penanda komentar bukan vonis terhadap pemilik akun.</p>
              </div>
              <figure className={styles.featureFigure}>
                <div className={styles.promotionPreview} data-ui>
                  <p>{promotion.comments_sample?.[0].text}</p>
                  <div className={styles.keywordTags}>
                    {promotion.comments_sample?.[0].keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
                  </div>
                  <span className={styles.promotionNote}>Ajakan promosi ditandai untuk ditinjau</span>
                </div>
                <figcaption>Contoh ilustratif, tanpa tautan ke situs promosi.</figcaption>
              </figure>
            </article>

            <article className={styles.featureRow}>
              <div className={styles.featureCopy}>
                <h3>Selalu ada konteks</h3>
                <p>Kembali ke komentar sumber sebelum menyimpulkan. Pisahkan komentar yang terindikasi promosi dari percakapan lainnya tanpa mengabaikan isinya.</p>
              </div>
              <figure className={styles.featureFigure}>
                <div className={styles.contextPreview} data-ui>
                  <p>“{sample.comments_sample?.[9].text}”</p>
                  <span>Kritik terhadap konten. Tidak ditandai sebagai promosi dalam contoh ini.</span>
                </div>
                <figcaption>Sentimen dan indikasi promosi dibaca terpisah.</figcaption>
              </figure>
            </article>
          </div>
        </section>

        <section id="edukasi" className={styles.literacy} aria-labelledby="literacy-title">
          <figure className={styles.literacyPhoto}>
            <Image src="/images/literasi-digital.webp" width={1280} height={854} unoptimized loading="lazy" alt="Tangan memegang telepon untuk membaca informasi digital" />
          </figure>
          <div className={styles.literacyCopy}>
            <h2 id="literacy-title">Baca kritis.<br />Jaga nalar.</h2>
            <p>Ramainya komentar tidak otomatis membuat sebuah informasi benar. Promosi bisa terdengar positif; kritik bisa datang dari pembaca yang peduli.</p>
            <ul>
              <li>Periksa sumber sebelum membagikan sebuah klaim.</li>
              <li>Tinjau ajakan membuka tautan atau memberi data pribadi.</li>
              <li>Baca konteks, bukan hanya kata yang ditandai.</li>
            </ul>
            <a href="#pindai" className={styles.textAction}>Mulai dengan satu video</a>
          </div>
        </section>

        <section id="cara-kerja" className={styles.howTo} aria-labelledby="how-title">
          <h2 id="how-title">Mulai dari<br />satu tautan.</h2>
          <ol>
            <li><h3>Salin tautan video</h3><p>Gunakan tombol Bagikan di YouTube. Video harus dapat diakses publik dan memiliki komentar.</p></li>
            <li><h3>Jalankan analisis</h3><p>Tempel tautan pada kolom di atas. Laporan disusun dari komentar yang berhasil diperiksa.</p></li>
            <li><h3>Baca dan bandingkan</h3><p>Lihat sentimen, kata yang menonjol, dan indikasi promosi. Buka sampel komentar untuk memahami konteksnya.</p></li>
          </ol>
        </section>

        <section id="bantuan" className={styles.faq} aria-labelledby="faq-title">
          <h2 id="faq-title">Hal yang perlu<br />diketahui.</h2>
          <dl>
            <div><dt>Platform apa yang didukung?</dt><dd>Saat ini analisis tautan mendukung video YouTube dan YouTube Shorts. Postingan dari platform lain belum dapat dianalisis.</dd></div>
            <div><dt>Apakah hasilnya pasti benar?</dt><dd>Tidak. Hasil bersifat indikatif dan hanya mewakili komentar yang diperiksa. Gunakan laporan untuk membantu membaca, bukan sebagai bukti akun bot, buzzer, atau pelaku judi.</dd></div>
            <div><dt>Perlu masuk akun?</dt><dd>Tidak perlu masuk akun untuk menggunakan kolom analisis. Cukup masukkan tautan video publik, tanpa menyertakan informasi pribadi.</dd></div>
            <div><dt>Bisa mengunduh hasil?</dt><dd>Gambar word cloud dapat diunduh sebagai PNG dari laporan. Grafik frekuensi membantu membaca angka di balik kata yang ditampilkan.</dd></div>
          </dl>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <Brand footer />
          <p>Memahami percakapan.<br />Menjaga nalar di ruang digital.</p>
          <a href="#pindai" className={styles.footerAction}>Coba analisis</a>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 Suara Netizen</span>
          <span>Foto: <a href="https://commons.wikimedia.org/w/index.php?curid=51440745" target="_blank" rel="noopener noreferrer">Pixel.la</a>, <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer">CC0</a>.</span>
          <a href="#top">Kembali ke atas</a>
        </div>
      </footer>
    </div>
  );
}
