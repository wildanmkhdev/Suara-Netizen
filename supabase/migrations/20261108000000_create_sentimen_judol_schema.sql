-- Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Table: analyses (Metadata & Aggregated Results of Social Media / YouTube Video Analysis)
CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id VARCHAR(64) NOT NULL,
    video_url TEXT NOT NULL,
    video_title TEXT,
    channel_name TEXT,
    thumbnail_url TEXT,
    total_comments_scanned INT NOT NULL DEFAULT 0,
    judol_risk_score FLOAT NOT NULL DEFAULT 0.0, -- Range: 0.00% to 100.00%
    sentiment_distribution JSONB NOT NULL DEFAULT '{"positif": 0, "netral": 0, "negatif": 0}'::jsonb,
    judol_keywords_found JSONB DEFAULT '[]'::jsonb,
    word_frequencies JSONB DEFAULT '[]'::jsonb,  -- Array of { text: string, value: number, type: 'judol' | 'normal' }
    executive_summary TEXT,                      -- AI-generated public literacy & scam awareness synthesis
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for instant cached lookup
CREATE INDEX IF NOT EXISTS idx_analyses_video_id ON public.analyses (video_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON public.analyses (created_at DESC);

-- 2. Table: comments (Raw and Classified Comments with Optional Semantic Embeddings)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
    author_name TEXT,
    comment_text TEXT NOT NULL,
    is_judol_spam BOOLEAN NOT NULL DEFAULT false,
    sentiment VARCHAR(20) NOT NULL DEFAULT 'neutral', -- 'positive', 'neutral', 'negative'
    detected_keywords TEXT[] DEFAULT '{}'::text[],
    embedding vector(384), -- MiniLM / BGE 384-dimensional vector embedding for semantic similarity
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comments_analysis_id ON public.comments (analysis_id);
CREATE INDEX IF NOT EXISTS idx_comments_is_judol ON public.comments (is_judol_spam);

-- Create HNSW Vector Index for sub-millisecond similarity search
CREATE INDEX IF NOT EXISTS idx_comments_embedding_hnsw 
ON public.comments 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 3. Stored Procedure: match_comments (Semantic Search for Judol Networks & Bot Echo Chambers)
CREATE OR REPLACE FUNCTION public.match_comments (
    query_embedding vector(384),
    match_threshold float,
    match_count int
)
RETURNS TABLE (
    id UUID,
    analysis_id UUID,
    author_name TEXT,
    comment_text TEXT,
    is_judol_spam BOOLEAN,
    sentiment VARCHAR(20),
    similarity float
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.analysis_id,
        c.author_name,
        c.comment_text,
        c.is_judol_spam,
        c.sentiment,
        1 - (c.embedding <=> query_embedding) AS similarity
    FROM public.comments c
    WHERE c.embedding IS NOT NULL 
      AND (1 - (c.embedding <=> query_embedding)) > match_threshold
    ORDER BY c.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Allow public read access (Anyone can view analyses and comments)
CREATE POLICY "Allow public read access on analyses" 
ON public.analyses FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public read access on comments" 
ON public.comments FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow service role full management access
CREATE POLICY "Allow service role full access on analyses" 
ON public.analyses FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow service role full access on comments" 
ON public.comments FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);
