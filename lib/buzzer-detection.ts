/**
 * Modul Deteksi Buzzer, Komentar Bayaran & Astroturfing Berpola Serupa
 * Menggunakan Centroid-based Semantic Clustering & Template Matching
 * untuk mendeteksi kesamaan makna kalimat, template terkoordinasi, dan buzzer bayaran.
 */

export const BUZZER_ASTROTURFING_PATTERNS = [
  // Pola Pujian Templat / Buzzer Narasi
  /lanjutkan\s+(program|kinerja|kepemimpinan|kebijakan|pembangunan)/i,
  /terbukti\s+nyata(\s+bukan\s+(sekadar|hanya)\s+janji)?/i,
  /kinerja\s+(sangat\s+)?nyata\s+untuk\s+(rakyat|masyarakat|bangsa)/i,
  /terima\s*kasih\s+(pak|bu|bapak|ibu)\s+[\w\s]{2,20}\s+(atas|sudah|telah)/i,
  /semangat\s+(pak|bu|bapak|ibu)\s+[\w\s]{2,20}\s+(jangan\s+dengarkan|tetap\s+fokus)/i,
  /mari\s+kita\s+dukung\s+(program|pemerintah|kebijakan)/i,
  /pemimpin\s+(terbaik|amanah|pilihan\s+rakyat)/i,

  // Pola Defleksi / Serangan Balik Terkoordinasi
  /jangan\s+(mudah\s+)?(terprovokasi|termakan|percaya)\s+(hoaks|isu|fitnah|berita\s+bohong)/i,
  /buzzer\s+sebelah\s+(mulai\s+)?(kepanasan|kebakaran\s+jenggot)/i,
  /cuma\s+bisa\s+nyinyir(\s+tanpa\s+bukti)?/i,
  /pihak\s+yang\s+(iri|dengki|membenci)/i,
  /akun\s+bodong\s+mulai\s+(berkeliaran|menyerang)/i,

  // Pola Bot / Komentar Bayaran Promosi Finansial / Spam Testimoni
  /awalnya\s+saya\s+(ragu|gak\s+percaya)\s+tapi\s+(setelah|pas)\s+(coba|depo|gabung)/i,
  /makasih\s+(admin|bang|kak)\s+[\w\s]{2,15}\s+berkat\s+(bocoran|link|arahannya|triknya)/i,
  /sudah\s+bukti(in)?\s+sendiri\s+(beneran|langsung)\s+(cair|wd|cuan)/i,
  /rekomendasi\s+banget\s+buat\s+yang\s+(mau|butuh)\s+(cuan|penghasilan|uang)\s+tambahan/i,
  /modal\s+(receh|\d+k|\d+rb)/i,
  /bocoran\s+(admin|slot|orang\s+dalam)/i,
  /(cek|klik|ada\s+di|di)\s+bio(\s+profil)?/i,
  /gacor|maxwin|sensational|petir\s+merah/i,
  /wa\.me|t\.me|chat\.whatsapp/i,
  /info\s+lengkap(nya)?\s+cek\s+(bio|postingan\s+tersemat)/i,
];

export interface BuzzerCluster {
  template: string;
  count: number;
  sampleVariations: string[];
}

export interface CommentBuzzerFlag {
  isBuzzer: boolean;
  similarityScore: number;
  reason?: string;
  clusterId?: number;
}

export interface BuzzerAnalysisResult {
  buzzerCount: number;
  buzzerPercentage: number;
  duplicateClustersCount: number;
  topClusters: BuzzerCluster[];
  commentFlags: CommentBuzzerFlag[];
}

const LEET_MAP: Record<string, string> = {
  '@': 'a',
  '4': 'a',
  '0': 'o',
  '1': 'i',
  '!': 'i',
  '|': 'i',
  '3': 'e',
  '5': 's',
  '$': 's',
  '7': 't',
  '+': 't',
  '8': 'b',
};

export function normalizeText(raw: string): string {
  if (!raw) return '';
  let str = raw.toLowerCase().trim();
  str = str.replace(/[@401!|35$7+8]/g, (char) => LEET_MAP[char] || char);
  str = str.replace(/https?:\/\/\S+/g, 'link_url');
  str = str.replace(/@\w+/g, 'user_mention');
  str = str.replace(/[^\w\s]/g, ' ');
  return str.replace(/\s+/g, ' ').trim();
}

function extractTokens(text: string): Set<string> {
  const words = text
    .split(' ')
    .filter((w) => w.length > 2 && !/^\d+$/.test(w));
  return new Set(words);
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  if (a.size === 0 || b.size === 0) return 0;

  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function isAstroturfingOrPromo(text: string): boolean {
  return BUZZER_ASTROTURFING_PATTERNS.some((p) => p.test(text));
}

/**
 * Deteksi komentar bayaran / buzzer astroturfing melalui:
 * 1. Centroid-based clustering (menghindari efek rantai transisi)
 * 2. Deteksi pola template astroturfing & spam bot terkoordinasi
 */
export function detectBuzzerAstroturfing(
  rawComments: string[],
  judolFlags?: boolean[]
): BuzzerAnalysisResult {
  const total = rawComments.length;
  if (total === 0) {
    return {
      buzzerCount: 0,
      buzzerPercentage: 0,
      duplicateClustersCount: 0,
      topClusters: [],
      commentFlags: [],
    };
  }

  const normalized = rawComments.map((c) => normalizeText(c));
  const tokensList = normalized.map((c) => extractTokens(c));

  // Inisialisasi bendera buzzer per komentar
  const flags: CommentBuzzerFlag[] = rawComments.map((_, idx) => {
    const original = rawComments[idx] || '';
    const norm = normalized[idx] || '';
    const matches = isAstroturfingOrPromo(original) || isAstroturfingOrPromo(norm);

    return {
      isBuzzer: matches,
      similarityScore: 0,
      reason: matches
        ? 'Pola kalimat terindikasi template astroturfing / promosi terkoordinasi'
        : undefined,
    };
  });

  // Centroid-based clustering untuk deteksi kemiripan semantik
  interface Cluster {
    centroidIdx: number;
    members: number[];
  }

  const clusters: Cluster[] = [];
  const CLUSTER_SIMILARITY_THRESHOLD = 0.72;

  for (let i = 0; i < total; i++) {
    const tok = tokensList[i];
    if (tok.size < 3 || normalized[i].length < 15) continue;

    let assigned = false;
    for (const cluster of clusters) {
      const centroidTok = tokensList[cluster.centroidIdx];
      const sim = jaccardSimilarity(tok, centroidTok);
      if (sim >= CLUSTER_SIMILARITY_THRESHOLD) {
        cluster.members.push(i);
        flags[i].similarityScore = Math.max(flags[i].similarityScore, sim);
        assigned = true;
        break;
      }
    }

    if (!assigned) {
      clusters.push({ centroidIdx: i, members: [i] });
    }
  }

  // Sebuah klaster diklasifikasikan sebagai buzzer klaster jika:
  // - Anggota >= 3 DAN cocok dengan pola astroturfing/promo, ATAU
  // - Anggota masif >= 8 pengulangan identik/near-identical
  const topClusters: BuzzerCluster[] = [];
  let clusterIdCounter = 1;

  for (const cluster of clusters) {
    const repComment = rawComments[cluster.centroidIdx];
    const normRep = normalized[cluster.centroidIdx];
    const hasPattern = isAstroturfingOrPromo(repComment) || isAstroturfingOrPromo(normRep);
    const isMassiveRepeat = cluster.members.length >= 8;

    if ((cluster.members.length >= 3 && hasPattern) || isMassiveRepeat) {
      const cid = clusterIdCounter++;
      const sampleVariations = cluster.members
        .slice(0, 3)
        .map((idx) => rawComments[idx]);

      topClusters.push({
        template: repComment,
        count: cluster.members.length,
        sampleVariations,
      });

      for (const memberIdx of cluster.members) {
        flags[memberIdx].isBuzzer = true;
        flags[memberIdx].clusterId = cid;
        flags[memberIdx].reason = flags[memberIdx].reason
          ? `${flags[memberIdx].reason} & variasi template berulang (${cluster.members.length} komentar serupa)`
          : `Variasi template berulang (${cluster.members.length} komentar serupa)`;
      }
    }
  }

  // Jika suatu komentar terdeteksi judol spam, beri tanda bot
  if (judolFlags && judolFlags.length === total) {
    for (let i = 0; i < total; i++) {
      if (judolFlags[i]) {
        flags[i].isBuzzer = true;
        if (!flags[i].reason) {
          flags[i].reason = 'Akun bot promosi judol otomatis';
        }
      }
    }
  }

  const buzzerCount = flags.filter((f) => f.isBuzzer).length;
  const buzzerPercentage = Math.round((buzzerCount / Math.max(1, total)) * 100);

  topClusters.sort((a, b) => b.count - a.count);

  return {
    buzzerCount,
    buzzerPercentage,
    duplicateClustersCount: topClusters.length,
    topClusters: topClusters.slice(0, 5),
    commentFlags: flags,
  };
}
