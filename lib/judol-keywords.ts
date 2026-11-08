/**
 * Kamus Komprehensif Kata Kunci & Pola Samaran Judi Online (Judol) Indonesia
 * Diperbarui dengan istilah gaul, homofon, provider, variasi slot, dan pola manipulasi karakter umum.
 */

export const JUDOL_PATTERNS = [
  // Istilah Slot & Game Terpopuler
  'gacor',
  'maxwin',
  'sensational',
  'depo',
  'wd',
  'withdraw',
  'deposit',
  'slot',
  'slot88',
  'slot gacor',
  'zeus',
  'pragmatic',
  'pragmatic play',
  'olympus',
  'gates of olympus',
  'gates of gatotkaca',
  'gatotkaca',
  'kakek zeus',
  'kakek cangkul',
  'petir merah',
  'petir x500',
  'perkalian 500x',
  'scatter',
  'scatter hitam',
  'scatter merah',
  'starlight',
  'starlight princess',
  'incess',
  'mahjong',
  'mahjong ways',
  'mahjong ways 2',
  'mahjong 3',
  'sweet bonanza',
  'sweet bonanza 1000',
  'sugar rush',
  'wild bandito',
  'spaceman',
  'aviatrix',
  'plinko',
  'koi gate',
  'pg soft',
  'habanero',
  'microgaming',
  'spadegaming',
  'joker123',

  // Istilah Bonus, Mekanik & Promosi Akun
  'new member',
  'member baru',
  'bonus 100',
  'bonus 50',
  'bonus new member',
  'garansi kekalahan',
  'garansi 100',
  'bebas ip',
  'bebas buyspin',
  'buy spin',
  'buyspin',
  'free spin',
  'freespin',
  'turnover',
  'to kecil',
  'to x3',
  'to 3x',
  'to x5',
  'rollover',
  'modal receh',
  'modal 5k',
  'modal 10k',
  'modal 20k',
  'modal 25k',
  'modal goceng',
  'anti rungkad',
  'anti lag',
  'anti banned',
  'pasti bayar',
  'pasti wd',
  'wd kilat',
  'pasti cair',
  'jackpot',
  'jp paus',
  'jp masal',
  'jp babon',
  'jp sensational',
  'bocoran admin',
  'admin jarwo',
  'admin riki',
  'bocoran orang dalam',
  'bocoran slot',
  'pola gacor',
  'pola slot',
  'pola rtp',
  'rtp live',
  'rtp tertinggi',
  'rtp jarwo',
  'freebet',
  'freebet tanpa deposit',
  'saldo gratis',
  'klaim bonus',
  'dana kaget judol',

  // Togel & Casino Tradisional
  'togel',
  'togel online',
  'toto macau',
  'live draw',
  'singapore pools',
  'hongkong pools',
  'sydney pools',
  'colok bebas',
  'colok naga',
  'baccarat',
  'roulette',
  'sicbo',
  'sabung ayam',
  'live casino',

  // Server Luar & Akun Khusus
  'server kamboja',
  'server thailand',
  'server rusia',
  'server vietnam',
  'server luar',
  'akun vvip',
  'akun pro jepang',
  'akun pro rusia',
  'id pro',
  'cheat slot',
  'apk gacor',
  'hack slot',
  'situs terpercaya',
  'agen resmi',
  'agen slot',
  'bandar judi',

  // Saluran Komunikasi, Tautan & Link Bio
  'link bio',
  'cek bio',
  'klik bio',
  'bio profil',
  'postingan tersemat',
  'pin komentar',
  'link gacor',
  'link alternatif',
  'daftar sekarang',
  'daftar gratis',
  'wa\\.me',
  't\\.me',
  'whatsapp',
  'telegram',
  'chat\\.whatsapp',
  'hubungi admin',
  'hubungi wa',
  'depo qris',
  'depo dana',
  'depo pulsa',
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
  sama: true, lebih: true, buat: true, sangat: true, orang: true, cuma: true, jangan: true, atau: true, harus: true,
  the: true, is: true, a: true, in: true, of: true, to: true, for: true, and: true, or: true, it: true, you: true, i: true,
};

const POSITIVE_WORDS: Record<string, true> = {
  bagus: true, mantap: true, keren: true, edukasi: true, edukatif: true, terima: true, kasih: true,
  bermanfaat: true, hebat: true, setuju: true, cerdas: true, informatif: true, berkah: true, sukses: true,
  suka: true, cinta: true, rekomen: true, rekomendasi: true, salut: true, top: true, juara: true,
  membantu: true, benar: true, sepakat: true, semangat: true, terbaik: true, puas: true, senang: true,
  bersyukur: true, terimakasih: true, respect: true, inspirasi: true, jelas: true, runut: true,
  apresiasi: true, transparan: true, solutif: true, teladan: true, membanggakan: true, berkelas: true,
  jujur: true, logis: true, objektif: true, mencerahkan: true, bernilai: true,
};

const NEGATIVE_WORDS: Record<string, true> = {
  kecewa: true, rugi: true, rungkad: true, rungkat: true, hancur: true, rusak: true, bohong: true, penipu: true,
  parah: true, nyesel: true, menyesal: true, stres: true, miskin: true, ludes: true, hutang: true, utang: true,
  terjebak: true, sengsara: true, haram: true, tangkap: true, bahaya: true, bodoh: true, fitnah: true,
  buruk: true, jelek: true, jahat: true, tertipu: true, miris: true, korban: true, kapok: true,
  haramkan: true, manipulasi: true, resah: true, meresahkan: true, lapor: true, bajingan: true,
  korupsi: true, manipulatif: true, zalim: true, pembodohan: true, pencitraan: true, buzzer: true,
  bayaran: true, hoax: true, hoaks: true, provokasi: true, bobrok: true, memalukan: true,
};

export interface WordFrequencyItem {
  text: string;
  value: number;
  type: 'judol' | 'normal';
  category?: 'positif' | 'negatif' | 'judol' | 'netral';
}

/**
 * Normalisasi leetspeak dan penghapusan separasi huruf sengaja (misal: s.l.o.t atau g_a_c_o_r)
 */
function normalizeObfuscatedSpelling(text: string): string {
  let s = text.toLowerCase();
  // De-obfuscate titik atau tanda strip antar huruf (misal: s.l.o.t -> slot)
  s = s.replace(/([a-z0-9])[\.\-_/\*]([a-z0-9])/gi, '$1$2');
  s = s.replace(/([a-z0-9])[\.\-_/\*]([a-z0-9])/gi, '$1$2');
  // Leetspeak dasar
  s = s.replace(/[@]/g, 'a')
       .replace(/[$]/g, 's')
       .replace(/[0]/g, 'o')
       .replace(/[1!|]/g, 'i')
       .replace(/[3]/g, 'e');
  return s;
}

/**
 * Mendeteksi apakah suatu teks mengandung pola judol dan kata kunci apa saja yang terdeteksi
 */
export function detectJudolSpam(text: string): { isJudol: boolean; matchedKeywords: string[] } {
  if (!text) return { isJudol: false, matchedKeywords: [] };

  const matches = text.match(JUDOL_REGEX) || [];
  const normalizedText = normalizeObfuscatedSpelling(text);
  const normalizedMatches = normalizedText.match(JUDOL_REGEX) || [];

  const combined = [...matches, ...normalizedMatches];
  const uniqueMatches = Array.from(new Set(combined.map((m) => m.toLowerCase())));

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
    .slice(0, 50);
}
