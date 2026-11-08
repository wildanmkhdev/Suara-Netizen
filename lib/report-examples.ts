import { extractWordFrequencies } from '@/lib/judol-keywords';
import type { AnalysisResult, ExampleKind } from '@/lib/analysis-types';

interface ExampleComment {
  text: string;
  sentiment: 'positif' | 'netral' | 'negatif';
  isJudol: boolean;
  isBuzzer?: boolean;
  buzzerReason?: string;
  keywords: string[];
}

const discussion: ExampleComment[] = [
  { text: 'Penjelasannya jelas dan bermanfaat. Terima kasih sudah membahas literasi digital.', sentiment: 'positif', isJudol: false, isBuzzer: false, keywords: [] },
  { text: 'Bagus, contoh sehari-harinya membantu saya memahami keamanan digital.', sentiment: 'positif', isJudol: false, isBuzzer: false, keywords: [] },
  { text: 'Bagian tentang menjaga data pribadi sangat bermanfaat untuk orang tua.', sentiment: 'positif', isJudol: false, isBuzzer: false, keywords: [] },
  { text: 'Materinya jelas. Saya setuju literasi digital perlu dibahas di sekolah.', sentiment: 'positif', isJudol: false, isBuzzer: false, keywords: [] },
  { text: 'Terima kasih, sekarang saya lebih hati-hati membaca komentar di internet.', sentiment: 'positif', isJudol: false, isBuzzer: false, keywords: [] },
  { text: 'Pembahasannya bagus dan informatif. Saya suka contoh yang sederhana.', sentiment: 'positif', isJudol: false, isBuzzer: false, keywords: [] },
  { text: 'Ada sumber bacaan tentang keamanan data yang bisa dibagikan?', sentiment: 'netral', isJudol: false, isBuzzer: false, keywords: [] },
  { text: 'Diskusi tentang literasi digital dimulai pada menit kelima.', sentiment: 'netral', isJudol: false, isBuzzer: false, keywords: [] },
  { text: 'Saya ingin tahu cara memeriksa sumber informasi dari sebuah komentar.', sentiment: 'netral', isJudol: false, isBuzzer: false, keywords: [] },
  { text: 'Saya kecewa karena data kasusnya tidak menyebutkan tahun.', sentiment: 'negatif', isJudol: false, isBuzzer: false, keywords: [] },
  { text: 'Suaranya kurang jelas. Sulit mengikuti bagian terakhir.', sentiment: 'negatif', isJudol: false, isBuzzer: false, keywords: [] },
  { text: 'Informasi tentang keamanan akun masih kurang lengkap.', sentiment: 'negatif', isJudol: false, isBuzzer: false, keywords: [] },
];

const promotion: ExampleComment[] = [
  { text: 'Slot gacor hari ini, depo modal receh langsung maxwin. Daftar sekarang!', sentiment: 'negatif', isJudol: true, isBuzzer: true, buzzerReason: 'Bot promosi slot otomatis', keywords: ['slot', 'gacor', 'depo', 'maxwin'] },
  { text: 'Bocoran admin pola gacor, garansi kekalahan buat member baru. Cek bio.', sentiment: 'negatif', isJudol: true, isBuzzer: true, buzzerReason: 'Bot promosi slot otomatis', keywords: ['bocoran admin', 'pola gacor', 'garansi kekalahan', 'cek bio'] },
  { text: 'Modal receh langsung jackpot, slot maxwin hari ini. Daftar sekarang.', sentiment: 'negatif', isJudol: true, isBuzzer: true, buzzerReason: 'Bot promosi slot otomatis', keywords: ['modal receh', 'jackpot', 'slot', 'maxwin'] },
  { text: 'Member baru bonus 100, depo cepat dan slot gacor. Hubungi admin.', sentiment: 'negatif', isJudol: true, isBuzzer: true, buzzerReason: 'Bot promosi slot otomatis', keywords: ['member baru', 'bonus 100', 'depo', 'slot'] },
  { text: 'Slot gacor modal receh, jackpot terus. Link bio untuk daftar.', sentiment: 'negatif', isJudol: true, isBuzzer: true, buzzerReason: 'Bot promosi slot otomatis', keywords: ['slot', 'gacor', 'jackpot', 'link bio'] },
  { text: 'Bocoran admin gacor, maxwin modal receh. Cek bio untuk depo.', sentiment: 'negatif', isJudol: true, isBuzzer: true, buzzerReason: 'Bot promosi slot otomatis', keywords: ['bocoran admin', 'gacor', 'maxwin', 'depo', 'cek bio'] },
  { text: 'Informasi ini bermanfaat. Saya setuju kita perlu lebih hati-hati.', sentiment: 'positif', isJudol: false, isBuzzer: false, keywords: [] },
  { text: 'Pembahasannya jelas, terima kasih untuk edukasi literasi digitalnya.', sentiment: 'positif', isJudol: false, isBuzzer: false, keywords: [] },
  { text: 'Banyak promosi yang meresahkan di kolom komentar ini.', sentiment: 'negatif', isJudol: false, isBuzzer: false, keywords: [] },
  { text: 'Saya kecewa komentar promosi memenuhi ruang diskusi.', sentiment: 'negatif', isJudol: false, isBuzzer: false, keywords: [] },
  { text: 'Penipuan semacam ini berbahaya. Jangan mudah percaya.', sentiment: 'negatif', isJudol: false, isBuzzer: false, keywords: [] },
  { text: 'Bagaimana cara melaporkan komentar seperti itu?', sentiment: 'netral', isJudol: false, isBuzzer: false, keywords: [] },
];

const xThread: ExampleComment[] = [
  { text: 'Mantap lanjutkan program kerja nyata demi kemajuan masyarakat kita bersama', sentiment: 'positif', isJudol: false, isBuzzer: true, buzzerReason: 'Variasi template buzzer bayaran (3 komentar serupa)', keywords: [] },
  { text: 'Keren banget kinerjanya sangat nyata untuk rakyat bukan sekadar janji kosong', sentiment: 'positif', isJudol: false, isBuzzer: true, buzzerReason: 'Variasi template buzzer bayaran (3 komentar serupa)', keywords: [] },
  { text: 'Semangat terus pak jangan dengarkan provokasi haters yang cuma bisa nyinyir', sentiment: 'positif', isJudol: false, isBuzzer: true, buzzerReason: 'Pola defleksi buzzer terkoordinasi', keywords: [] },
  { text: 'Banyak korban rungkad judi online tapi penindakannya lambat sekali tolong!', sentiment: 'negatif', isJudol: false, isBuzzer: false, keywords: ['rungkad'] },
  { text: 'Masyarakat sudah sangat resah dengan maraknya akun penipuan dan buzzer.', sentiment: 'negatif', isJudol: false, isBuzzer: false, keywords: ['resah'] },
  { text: 'Petir merah zeus maxwin sensasional modal 25k link di bio wa.me/62812345678', sentiment: 'negatif', isJudol: true, isBuzzer: true, buzzerReason: 'Bot promosi judol otomatis', keywords: ['petir merah', 'zeus', 'maxwin', 'modal 25k', 'link bio', 'wa.me'] },
  { text: 'Apakah ada audit terbuka mengenai aliran dana rekening penampung?', sentiment: 'netral', isJudol: false, isBuzzer: false, keywords: [] },
  { text: 'Bagian data statistik kerugian sangat membuka mata publik.', sentiment: 'positif', isJudol: false, isBuzzer: false, keywords: [] },
];

function buildExample(kind: ExampleKind, comments: ExampleComment[]): AnalysisResult {
  const sentiment = { positif: 0, netral: 0, negatif: 0 };
  let promotional = 0;
  let buzzerCount = 0;
  const terms = new Set<string>();

  for (const comment of comments) {
    sentiment[comment.sentiment] += 1;
    if (comment.isJudol) promotional += 1;
    if (comment.isBuzzer) buzzerCount += 1;
    for (const keyword of comment.keywords) terms.add(keyword);
  }

  const positive = Math.round((sentiment.positif / comments.length) * 100);
  const negative = Math.round((sentiment.negatif / comments.length) * 100);
  const neutral = 100 - positive - negative;
  const judolRisk = Math.round((promotional / comments.length) * 100);
  const buzzerPct = Math.round((buzzerCount / comments.length) * 100);

  const platform = kind === 'x-thread' ? ('x' as const) : ('youtube' as const);

  return {
    video_id: `illustration-${kind}`,
    video_url: '',
    video_title:
      kind === 'x-thread'
        ? 'Utas X: Diskusi Warganet & Analisis Pola Komentar Bayaran'
        : kind === 'promotion'
          ? 'Percakapan dengan Indikasi Promosi & Bot Judol'
          : 'Percakapan Publik & Literasi Digital',
    channel_name: kind === 'x-thread' ? '@warganet_kritis' : 'Contoh ilustratif Suara-Netizen',
    thumbnail_url: null,
    platform,
    sample_note: 'Data mengambil sampel hingga 1.000 komentar/balasan teratas.',
    total_comments_scanned: 1000,
    judol_risk_score: judolRisk,
    sentiment_distribution: { positif: positive, netral: neutral, negatif: negative },
    buzzer_stats: {
      buzzer_percentage: buzzerPct,
      buzzer_count: Math.round((buzzerPct / 100) * 1000),
      duplicate_clusters_count: kind === 'x-thread' ? 4 : kind === 'promotion' ? 3 : 0,
      top_templates:
        kind === 'x-thread'
          ? [
              { template: 'Mantap lanjutkan program kerja nyata demi kemajuan rakyat', count: 140 },
              { template: 'Semangat terus jangan dengarkan provokasi haters', count: 85 },
            ]
          : kind === 'promotion'
            ? [{ template: 'Slot gacor hari ini modal receh link bio', count: 320 }]
            : [],
    },
    judol_keywords_found: Array.from(terms),
    word_frequencies: extractWordFrequencies(comments.map((comment) => comment.text)),
    executive_summary:
      kind === 'x-thread'
        ? `Berdasarkan analisis sampel 1.000 komentar: ${negative}% sentimen bernada kritis/negatif, ${neutral}% netral, dan ${positive}% positif. Terdeteksi ${buzzerPct}% aktivitas buzzer bayaran dengan template kalimat serupa dan ${judolRisk}% spam judol. Warganet organik menghendaki transparansi penegakan hukum, sementara akun bot berupaya mengaburkan topik.`
        : kind === 'promotion'
          ? `Berdasarkan analisis sampel 1.000 komentar: terindikasi kontaminasi tinggi spam judol sebesar ${judolRisk}% dan pola bot terkoordinasi sebesar ${buzzerPct}%. Komentar promosi menggunakan iming-iming gacor dan ajakan klik bio. Publik disarankan tidak mempercayai tautan profil asing.`
          : `Berdasarkan analisis sampel 1.000 komentar: suasana diskusi relatif kondusif dengan ${positive}% sentimen positif, ${neutral}% netral, dan ${negative}% kritik konstruktif. Tidak ditemukan infiltrasi buzzer maupun spam judol yang signifikan.`,
    executive_summary_structured: {
      overview:
        kind === 'x-thread'
          ? `Dari sampel 1.000 komentar: ${negative}% suara negatif/kritis, ${neutral}% netral, dan ${positive}% positif. Teridentifikasi ${buzzerPct}% akun terindikasi buzzer bayaran.`
          : `Dari sampel 1.000 komentar: sentimen terdistribusi ${positive}% positif, ${neutral}% netral, dan ${negative}% negatif. Tingkat risiko judol ${judolRisk}%.`,
      sentiment_analysis:
        kind === 'x-thread'
          ? 'Warganet mengekspresikan kekecewaan atas maraknya kejahatan siber dan mendesak penegakan hukum transparan.'
          : 'Opini publik berfokus pada diskusi materi literasi dan keamanan akun.',
      buzzer_analysis:
        kind === 'x-thread'
          ? 'Terdeteksi kelompok komentar dengan struktur pujian dan pembelaan template yang identik secara berulang.'
          : kind === 'promotion'
            ? 'Terdeteksi koordinasi bot promosi slot dengan tautan profil WhatsApp/Telegram.'
            : 'Tidak ditemukan anomali pola koordinasi komentar atau bot bayaran.',
      solutions: [
        'Lakukan pelaporan massal pada akun bot dengan template serupa ke moderator platform.',
        'Pasang kata kunci negatif dan promosi slot pada filter otomatis kanal.',
        'Waspadai klaim kemenangan dan jangan pernah mengklik tautan di bio profil akun tidak dikenal.',
      ],
    },
    comments_sample: comments.map(({ text, sentiment, isJudol, isBuzzer, buzzerReason, keywords }) => ({
      text,
      isJudol,
      isBuzzer: isBuzzer ?? false,
      buzzerReason,
      keywords,
      sentiment,
    })),
  };
}

export const REPORT_EXAMPLES: Record<ExampleKind, AnalysisResult> = {
  promotion: buildExample('promotion', promotion),
  discussion: buildExample('discussion', discussion),
  'x-thread': buildExample('x-thread', xThread),
};
