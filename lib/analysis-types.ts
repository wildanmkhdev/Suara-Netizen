import { z } from 'zod';

const percentage = z.number().finite().min(0).max(100);

export const WordFrequencySchema = z.object({
  text: z.string(),
  value: z.number().finite().nonnegative(),
  type: z.enum(['judol', 'normal']),
  category: z.enum(['positif', 'negatif', 'judol', 'netral']).optional(),
});

export const ClassifiedCommentSchema = z.object({
  text: z.string(),
  isJudol: z.boolean(),
  isBuzzer: z.boolean().optional(),
  buzzerReason: z.string().optional(),
  keywords: z.array(z.string()),
});

export const BuzzerStatsSchema = z.object({
  buzzer_percentage: percentage,
  buzzer_count: z.number().int().nonnegative(),
  duplicate_clusters_count: z.number().int().nonnegative(),
  top_templates: z
    .array(
      z.object({
        template: z.string(),
        count: z.number().int().nonnegative(),
      })
    )
    .optional(),
});

export const ExecutiveSummaryStructuredSchema = z.object({
  overview: z.string(),
  sentiment_analysis: z.string(),
  buzzer_analysis: z.string(),
  solutions: z.array(z.string()),
});

export const AnalysisResultSchema = z.object({
  video_id: z.string(),
  video_url: z.string(),
  video_title: z.string().optional(),
  channel_name: z.string().optional(),
  thumbnail_url: z.string().nullable().optional(),
  platform: z.enum(['youtube', 'x']).optional(),
  sample_note: z.string().optional(),
  total_comments_scanned: z.number().int().nonnegative(),
  judol_risk_score: percentage,
  sentiment_distribution: z.object({
    positif: percentage,
    netral: percentage,
    negatif: percentage,
  }),
  buzzer_stats: BuzzerStatsSchema.optional(),
  judol_keywords_found: z.array(z.string()),
  word_frequencies: z.array(WordFrequencySchema),
  executive_summary: z.string(),
  executive_summary_structured: ExecutiveSummaryStructuredSchema.optional(),
  comments_sample: z.array(ClassifiedCommentSchema).optional(),
});

const AnalysisResponseSchema = z.object({
  data: AnalysisResultSchema,
  source: z.string().optional(),
});

export type ClassifiedComment = z.infer<typeof ClassifiedCommentSchema>;
export type BuzzerStats = z.infer<typeof BuzzerStatsSchema>;
export type ExecutiveSummaryStructured = z.infer<typeof ExecutiveSummaryStructuredSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export type ExampleKind = 'promotion' | 'discussion' | 'x-thread';

export function parseAnalysisResponse(value: unknown): { data: AnalysisResult; cached: boolean } {
  const result = AnalysisResponseSchema.safeParse(value);
  if (!result.success) {
    throw new Error('Laporan belum dapat ditampilkan. Coba analisis kembali.');
  }
  return { data: result.data.data, cached: result.data.source === 'cache' };
}

export function responseError(value: unknown): string {
  const result = z.object({ error: z.string() }).safeParse(value);
  return result.success
    ? result.data.error
    : 'Komentar belum berhasil diambil. Periksa tautan dan coba kembali.';
}
