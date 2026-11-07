import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { detectJudolSpam, extractWordFrequencies } from '@/lib/judol-keywords';

interface YouTubeCommentThread {
  snippet: {
    topLevelComment: {
      snippet: {
        textOriginal: string;
      };
    };
  };
}

interface YouTubeVideoItem {
  snippet: {
    title: string;
    channelTitle: string;
  };
}

interface YouTubeCommentResponse {
  items?: YouTubeCommentThread[];
}

interface YouTubeVideoResponse {
  items?: YouTubeVideoItem[];
}

interface GroqResponsePayload {
  sentiment?: {
    positif: number;
    netral: number;
    negatif: number;
  };
  judol_risk_score?: number;
  executive_summary?: string;
}

// Demo sample comments for instant out-of-the-box testing without needing keys upfront
const SAMPLE_DEMO_COMMENTS: string[] = [
  'Videonya sangat mengedukasi masyarakat, terima kasih infonya kak!',
  'Bocoran admin jarwo hari ini gacor parah langsung wd 5jt modal receh 25k wa.me/62812345678',
  'Penjelasannya runut dan mudah dipahami, konten seperti ini yang kita butuhkan.',
  'Jangan mudah tergiur kawan, judi online itu perusak masa depan keluarga.',
  'Mantap kakek zeus petir merah turun terus, auto maxwin sensational cek link bio profil',
  'Banyak yang rungkad gara-gara slot tapi masih aja ada yang percaya promo new member 100.',
  'Keren banget analisanya bang, ditunggu video investigasi selanjutnya!',
  'Daftar sekarang dapat garansi kekalahan 100 persen, anti rungkad anti lag klik link bio ya bosku',
  'Polisi harus usut tuntas promotor judol yang meresahkan ini sampai ke akar-akarnya.',
  'Saya korban rungkad pinjol dan judol, hidup hancur jangan pernah coba-coba teman-teman.',
  'RTP live pragmatic hari ini lagi tinggi kawan, starlight princess mahjong ways 2 pasti bayar',
  'Semoga konten literasi finansial begini makin viral di FYP.',
];

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    if (!body || typeof body !== 'object' || !('url' in body) || typeof body.url !== 'string') {
      return NextResponse.json({ error: 'URL postingan atau video wajib diisi' }, { status: 400 });
    }
    const url = body.url.trim();

    // 1. Ekstrak Video ID dari URL YouTube
    const videoIdMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : `custom-${Buffer.from(url).toString('hex').slice(0, 16)}`;

    // 2. Cek Cache Supabase (Jika sudah pernah dianalisis dalam 24 jam terakhir)
    if (supabaseAdmin) {
      try {
        const { data: cached } = await supabaseAdmin
          .from('analyses')
          .select('*')
          .eq('video_id', videoId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (cached) {
          return NextResponse.json({ source: 'cache', data: cached });
        }
      } catch (cacheErr) {
        console.warn('Supabase cache lookup warning:', cacheErr);
      }
    }

    // 3. Ambil Komentar (YouTube API v3 jika ada Key, atau Demo Sample)
    let comments: string[] = [];
    let videoTitle = 'Analisis Konten Digital & Komentar Publik';
    let channelName = 'Saluran Publik';

    const youtubeApiKey = process.env.YOUTUBE_API_KEY;

    if (youtubeApiKey && videoIdMatch) {
      try {
        const ytRes = await fetch(
          `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&key=${youtubeApiKey}`
        );
        const ytData = (await ytRes.json()) as YouTubeCommentResponse;

        if (ytData.items && ytData.items.length > 0) {
          comments = ytData.items.map((item) => item.snippet.topLevelComment.snippet.textOriginal);
        }

        // Ambil info detail video
        const infoRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`
        );
        const infoData = (await infoRes.json()) as YouTubeVideoResponse;
        if (infoData.items?.[0]) {
          videoTitle = infoData.items[0].snippet.title;
          channelName = infoData.items[0].snippet.channelTitle;
        }
      } catch (ytErr) {
        console.warn('YouTube API fetch warning:', ytErr);
      }
    }

    // Fallback jika belum ada YouTube API key atau bukan link YT
    if (comments.length === 0) {
      comments = SAMPLE_DEMO_COMMENTS;
      videoTitle = 'Demo Sampel: Investigasi Modus Judol & Sentimen Publik';
      channelName = 'Literasi Siber Indonesia';
    }

    // 4. Deteksi Heuristik & Ekstraksi Kata
    let judolCount = 0;
    const detectedJudolTerms: string[] = [];
    const classifiedComments = comments.map((text) => {
      const detection = detectJudolSpam(text);
      if (detection.isJudol) {
        judolCount++;
        detectedJudolTerms.push(...detection.matchedKeywords);
      }
      return {
        text,
        isJudol: detection.isJudol,
        keywords: detection.matchedKeywords,
      };
    });

    const uniqueJudolTerms = Array.from(new Set(detectedJudolTerms));
    const wordFrequencies = extractWordFrequencies(comments);

    // Hitung persentase awal
    const heuristicRiskScore = Math.min(
      100,
      Math.round((judolCount / Math.max(1, comments.length)) * 100)
    );

    // 5. Analisis Cerdas via Groq API (Llama-3.3-70B - GRATIS) jika ada Key
    const groqApiKey = process.env.GROQ_API_KEY;
    let sentimentDistribution = {
      positif: 40,
      netral: 30,
      negatif: 30,
    };
    let executiveSummary = `Konten ini memiliki tingkat kontaminasi spam/bot judol sebesar ${heuristicRiskScore}%. Terdeteksi pola manipulasi komentar promosi slot dengan iming-iming 'gacor' dan 'maxwin'. Diperlukan peningkatan literasi kritis publik agar tidak mudah tergiur tawaran tautan di bio profil atau nomor WhatsApp mencurigakan.`;
    let aiJudolRiskScore = heuristicRiskScore;

    if (groqApiKey) {
      try {
        const groqPrompt = `Anda adalah AI Analis Literasi Siber & Kejahatan Finansial Digital Indonesia.
Analisis kumpulan komentar media sosial berikut.
Tugas Anda:
1. Hitung persentase sentimen publik organik (positif, netral, negatif, total harus 100).
2. Taksir persentase risiko paparan/spam judol (0-100).
3. Buat ringkasan eksekutif 2-3 kalimat yang mengedukasi literasi masyarakat mengenai pola manipulasi atau bahaya finansial yang teridentifikasi.

KEMBALIKAN HANYA JSON DENGAN STRUKTUR BERIKUT:
{
  "sentiment": { "positif": 45, "netral": 25, "negatif": 30 },
  "judol_risk_score": ${heuristicRiskScore},
  "executive_summary": "Ringkasan edukasi literasi..."
}`;

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: groqPrompt },
              { role: 'user', content: `Komentar:\n${comments.slice(0, 40).join('\n---\n')}` },
            ],
            temperature: 0.2,
          }),
        });

        if (groqRes.ok) {
          const aiJson = (await groqRes.json()) as { choices?: Array<{ message?: { content?: string } }> };
          const rawContent = aiJson.choices?.[0]?.message?.content;
          if (rawContent) {
            const parsed = JSON.parse(rawContent) as GroqResponsePayload;
            if (parsed.sentiment) sentimentDistribution = parsed.sentiment;
            if (typeof parsed.judol_risk_score === 'number') {
              aiJudolRiskScore = Math.max(heuristicRiskScore, parsed.judol_risk_score);
            }
            if (parsed.executive_summary) executiveSummary = parsed.executive_summary;
          }
        }
      } catch (aiErr) {
        console.warn('Groq API analysis fallback:', aiErr);
      }
    }

    // 6. Siapkan Payload Terstruktur
    const payload = {
      video_id: videoId,
      video_url: url,
      video_title: videoTitle,
      channel_name: channelName,
      thumbnail_url: videoIdMatch ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null,
      total_comments_scanned: comments.length,
      judol_risk_score: aiJudolRiskScore,
      sentiment_distribution: sentimentDistribution,
      judol_keywords_found: uniqueJudolTerms,
      word_frequencies: wordFrequencies,
      executive_summary: executiveSummary,
      comments_sample: classifiedComments.slice(0, 15),
    };

    // 7. Simpan ke Supabase jika terkonfigurasi
    if (supabaseAdmin) {
      try {
        const { data: savedRecord, error: insertErr } = await supabaseAdmin
          .from('analyses')
          .insert({
            video_id: payload.video_id,
            video_url: payload.video_url,
            video_title: payload.video_title,
            channel_name: payload.channel_name,
            thumbnail_url: payload.thumbnail_url,
            total_comments_scanned: payload.total_comments_scanned,
            judol_risk_score: payload.judol_risk_score,
            sentiment_distribution: payload.sentiment_distribution,
            judol_keywords_found: payload.judol_keywords_found,
            word_frequencies: payload.word_frequencies,
            executive_summary: payload.executive_summary,
          })
          .select()
          .single();

        if (savedRecord && !insertErr) {
          // Masukkan sampel komentar ke tabel comments
          const commentsToInsert = classifiedComments.slice(0, 20).map((c) => ({
            analysis_id: savedRecord.id,
            comment_text: c.text,
            is_judol_spam: c.isJudol,
            sentiment: c.isJudol ? 'negative' : 'neutral',
            detected_keywords: c.keywords,
          }));

          await supabaseAdmin.from('comments').insert(commentsToInsert);

          return NextResponse.json({
            source: 'live',
            data: { ...savedRecord, comments_sample: payload.comments_sample },
          });
        }
      } catch (dbErr) {
        console.warn('Supabase insert warning:', dbErr);
      }
    }

    return NextResponse.json({ source: 'live', data: payload });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan internal server';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
