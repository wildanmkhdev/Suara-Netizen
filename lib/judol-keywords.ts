/**
 * Kamus Komprehensif Kata Kunci & Pola Samaran Judi Online (Judol) Indonesia
 * Diperbarui dengan istilah gaul, homofon, dan pola manipulasi karakter umum.
 */

export const JUDOL_PATTERNS = [
  // Istilah Slot & Game
  'gacor',
  'maxwin',
  'sensational',
  'depo',
  'wd',
  'withdraw',
  'deposit',
  'slot',
  'zeus',
  'pragmatic',
  'olympus',
  'kakek zeus',
  'scatter',
  'petir merah',
  'starlight',
  'princess',
  'mahjong',
  'mahjong ways',
  'sweet bonanza',
  'pg soft',
  'habanero',
  'microgaming',
  'spadegaming',
  'joker123',

  // Istilah Bonus & Promosi Akun
  'new member',
  'member baru',
  'bonus 100',
  'bonus 50',
  'garansi kekalahan',
  'modal receh',
  'modal 10k',
  'modal 25k',
  'anti rungkad',
  'anti lag',
  'pasti bayar',
  'jackpot',
  'jp paus',
  'jp masal',
  'bocoran admin',
  'admin jarwo',
  'admin riki',
  'pola gacor',
  'rtp live',
  'rtp tertinggi',

  // Togel & Casino Tradisional
  'togel',
  'singapore',
  'hongkong',
  'sydney',
  'baccarat',
  'roulette',
  'sicbo',
  'sabung ayam',

  // Saluran Komunikasi & Link Bio
  'link bio',
  'cek bio',
  'klik bio',
  'bio profil',
  'wa\\.me',
  't\\.me',
  'whatsapp',
  'telegram',
  'hubungi admin',
  'daftar gratis',
  'daftar sekarang',
];

// Compiled Regular Expression for fast heuristic detection (case-insensitive)
export const JUDOL_REGEX = new RegExp(
  `\\b(${JUDOL_PATTERNS.join('|')})\\b`,
  'gi'
);

const STOP_WORDS: Record<string, true> = {
  dan: true, di: true, ke: true, dari: true, yang: true, ini: true, itu: true, untuk: true, pada: true, adalah: true,
  dengan: true, bisa: true, ada: true, tidak: true, tapi: true, sudah: true, juga: true, akan: true, saya: true,
  kamu: true, dia: true, kita: true, mereka: true, karena: true, kalau: true, mau: true, jadi: true, lagi: true,
  bang: true, mas: true, kak: true, ya: true, aja: true, sih: true, nih: true, dong: true, kan: true, lah: true, kok: true,
  the: true, is: true, a: true, in: true, of: true, to: true, for: true, and: true, or: true, it: true, you: true, i: true,
};

const POSITIVE_WORDS: Record<string, true> = {
  bagus: true, mantap: true, keren: true, edukasi: true, edukatif: true, terima: true, kasih: true,
  bermanfaat: true, hebat: true, setuju: true, cerdas: true, informatif: true, berkah: true, sukses: true,
  suka: true, cinta: true, rekomen: true, rekomendasi: true, salut: true, top: true, juara: true,
  membantu: true, benar: true, sepakat: true, semangat: true, terbaik: true, puas: true, senang: true,
  bersyukur: true, terimakasih: true, respect: true, inspirasi: true, jelas: true, runut: true,
};

const NEGATIVE_WORDS: Record<string, true> = {
  kecewa: true, rugi: true, rungkad: true, hancur: true, rusak: true, bohong: true, penipu: true,
  parah: true, nyesel: true, menyesal: true, stres: true, miskin: true, ludes: true, hutang: true,
  terjebak: true, sengsara: true, haram: true, tangkap: true, bahaya: true, bodoh: true, fitnah: true,
  buruk: true, jelek: true, jahat: true, tertipu: true, miris: true, korban: true, kapok: true,
  haramkan: true, manipulasi: true, resah: true, meresahkan: true, lapor: true, bajingan: true,
};

export interface WordFrequencyItem {
  text: string;
  value: number;
  type: 'judol' | 'normal';
  category: 'positif' | 'negatif' | 'judol' | 'netral';
}

/**
 * Mendeteksi apakah suatu teks mengandung pola judol dan kata kunci apa saja yang terdeteksi
 */
export function detectJudolSpam(text: string): { isJudol: boolean; matchedKeywords: string[] } {
  if (!text) return { isJudol: false, matchedKeywords: [] };

  const matches = text.match(JUDOL_REGEX) || [];
  const uniqueMatches = Array.from(new Set(matches.map((m) => m.toLowerCase())));

  return {
    isJudol: uniqueMatches.length > 0,
    matchedKeywords: uniqueMatches,
  };
}

/**
 * Menghitung frekuensi kata untuk Word Cloud & Sentiment Analytics
 */
export function extractWordFrequencies(comments: string[]): WordFrequencyItem[] {
  const freqMap: Record<string, { count: number; category: 'positif' | 'negatif' | 'judol' | 'netral' }> = {};

  comments.forEach((comment) => {
    // Normalisasi teks
    const cleaned = comment
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ');

    const words = cleaned.split(' ');

    words.forEach((w) => {
      if (w.length < 3 || STOP_WORDS[w] || /^\d+$/.test(w)) return;

      const isJudolKeyword = JUDOL_PATTERNS.some((p) => p.toLowerCase() === w);
      let cat: 'positif' | 'negatif' | 'judol' | 'netral' = 'netral';

      if (isJudolKeyword) {
        cat = 'judol';
      } else if (POSITIVE_WORDS[w]) {
        cat = 'positif';
      } else if (NEGATIVE_WORDS[w]) {
        cat = 'negatif';
      }

      if (!freqMap[w]) {
        freqMap[w] = { count: 0, category: cat };
      }
      freqMap[w].count += 1;
    });
  });

  return Object.entries(freqMap)
    .map(([text, data]) => ({
      text,
      value: data.count,
      type: data.category === 'judol' ? ('judol' as const) : ('normal' as const),
      category: data.category,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 50); // Ambil top 50 kata agar word cloud padat dan indah
}
