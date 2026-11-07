import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({
        configured: false,
        message: 'Supabase belum dikonfigurasi. Masukkan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di .env.local.',
        data: [],
      });
    }

    const { data, error } = await supabaseAdmin
      .from('analyses')
      .select('id, video_id, video_title, channel_name, thumbnail_url, judol_risk_score, sentiment_distribution, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      configured: true,
      data: data || [],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengambil riwayat analisis';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
