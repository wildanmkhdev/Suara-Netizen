import { extractWordFrequencies } from '@/lib/judol-keywords';
import type { AnalysisResult, ExampleKind } from '@/lib/analysis-types';

interface ExampleComment {
  text: string;
  sentiment: 'positif' | 'netral' | 'negatif';
  isJudol: boolean;
  keywords: string[];
}

const discussion: ExampleComment[] = [
  { text: 'Penjelasannya jelas dan bermanfaat. Terima kasih sudah membahas literasi digital.', sentiment: 'positif', isJudol: false, keywords: [] },
  { text: 'Bagus, contoh sehari-harinya membantu saya memahami keamanan digital.', sentiment: 'positif', isJudol: false, keywords: [] },
  { text: 'Bagian tentang menjaga data pribadi sangat bermanfaat untuk orang tua.', sentiment: 'positif', isJudol: false, keywords: [] },
  { text: 'Materinya jelas. Saya setuju literasi digital perlu dibahas di sekolah.', sentiment: 'positif', isJudol: false, keywords: [] },
  { text: 'Terima kasih, sekarang saya lebih hati-hati membaca komentar di internet.', sentiment: 'positif', isJudol: false, keywords: [] },
  { text: 'Pembahasannya bagus dan informatif. Saya suka contoh yang sederhana.', sentiment: 'positif', isJudol: false, keywords: [] },
  { text: 'Ada sumber bacaan tentang keamanan data yang bisa dibagikan?', sentiment: 'netral', isJudol: false, keywords: [] },
  { text: 'Diskusi tentang literasi digital dimulai pada menit kelima.', sentiment: 'netral', isJudol: false, keywords: [] },
  { text: 'Saya ingin tahu cara memeriksa sumber informasi dari sebuah komentar.', sentiment: 'netral', isJudol: false, keywords: [] },
  { text: 'Saya kecewa karena data kasusnya tidak menyebutkan tahun.', sentiment: 'negatif', isJudol: false, keywords: [] },
  { text: 'Suaranya kurang jelas. Sulit mengikuti bagian terakhir.', sentiment: 'negatif', isJudol: false, keywords: [] },
  { text: 'Informasi tentang keamanan akun masih kurang lengkap.', sentiment: 'negatif', isJudol: false, keywords: [] },
];

const promotion: ExampleComment[] = [
  { text: 'Slot gacor hari ini, depo modal receh langsung maxwin. Daftar sekarang!', sentiment: 'positif', isJudol: true, keywords: ['slot', 'gacor', 'depo', 'maxwin'] },
  { text: 'Bocoran admin pola gacor, garansi kekalahan buat member baru. Cek bio.', sentiment: 'positif', isJudol: true, keywords: ['bocoran admin', 'pola gacor', 'garansi kekalahan'] },
  { text: 'Modal receh langsung jackpot, slot maxwin hari ini. Daftar sekarang.', sentiment: 'positif', isJudol: true, keywords: ['modal receh', 'jackpot', 'slot', 'maxwin'] },
  { text: 'Member baru bonus 100, depo cepat dan slot gacor. Hubungi admin.', sentiment: 'positif', isJudol: true, keywords: ['member baru', 'depo', 'slot', 'hubungi admin'] },
  { text: 'Slot gacor modal receh, jackpot terus. Link bio untuk daftar.', sentiment: 'positif', isJudol: true, keywords: ['slot', 'gacor', 'jackpot', 'link bio'] },
  { text: 'Bocoran admin gacor, maxwin modal receh. Cek bio untuk depo.', sentiment: 'positif', isJudol: true, keywords: ['bocoran admin', 'gacor', 'maxwin', 'depo'] },
  { text: 'Informasi ini bermanfaat. Saya setuju kita perlu lebih hati-hati.', sentiment: 'positif', isJudol: false, keywords: [] },
  { text: 'Pembahasannya jelas, terima kasih untuk edukasi literasi digitalnya.', sentiment: 'positif', isJudol: false, keywords: [] },
  { text: 'Banyak promosi yang meresahkan di kolom komentar ini.', sentiment: 'negatif', isJudol: false, keywords: [] },
  { text: 'Saya kecewa komentar promosi memenuhi ruang diskusi.', sentiment: 'negatif', isJudol: false, keywords: [] },
  { text: 'Penipuan semacam ini berbahaya. Jangan mudah percaya.', sentiment: 'negatif', isJudol: false, keywords: [] },
  { text: 'Bagaimana cara melaporkan komentar seperti itu?', sentiment: 'netral', isJudol: false, keywords: [] },
];

function buildExample(kind: ExampleKind, comments: ExampleComment[]): AnalysisResult {
  const sentiment = { positif: 0, netral: 0, negatif: 0 };
  let promotional = 0;
  const terms = new Set<string>();
  for (const comment of comments) {
    sentiment[comment.sentiment] += 1;
    if (comment.isJudol) promotional += 1;
    for (const keyword of comment.keywords) terms.add(keyword);
  }
  const positive = Math.round((sentiment.positif / comments.length) * 100);
  const negative = Math.round((sentiment.negatif / comments.length) * 100);
  return {
    video_id: `illustration-${kind}`,
    video_url: '',
    video_title: kind === 'promotion' ? 'Percakapan dengan indikasi promosi' : 'Percakapan sehari-hari',
    channel_name: 'Contoh ilustratif Suara-Netizen',
    thumbnail_url: null,
    total_comments_scanned: comments.length,
    judol_risk_score: Math.round((promotional / comments.length) * 100),
    sentiment_distribution: { positif: positive, netral: 100 - positive - negative, negatif: negative },
    judol_keywords_found: Array.from(terms),
    word_frequencies: extractWordFrequencies(comments.map((comment) => comment.text)),
    executive_summary: kind === 'promotion'
      ? 'Contoh ini memperlihatkan promosi berulang dengan iming-iming kemenangan dan ajakan membuka profil. Komentar promosi dapat bernada positif; sentimen positif tidak sama dengan informasi yang dapat dipercaya.'
      : 'Contoh ini memuat apresiasi, pertanyaan, dan kritik terhadap konten literasi digital. Tidak ada komentar yang ditandai sebagai promosi dalam contoh ini. Kritik tetap bagian dari percakapan yang wajar.',
    comments_sample: comments.map(({ text, isJudol, keywords }) => ({ text, isJudol, keywords })),
  };
}

export const REPORT_EXAMPLES: Record<ExampleKind, AnalysisResult> = {
  promotion: buildExample('promotion', promotion),
  discussion: buildExample('discussion', discussion),
};
