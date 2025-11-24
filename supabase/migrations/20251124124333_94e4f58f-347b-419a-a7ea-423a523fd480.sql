-- Create table for storing code snippets
CREATE TABLE public.code_snippets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled Snippet',
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  output TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.code_snippets ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read public snippets
CREATE POLICY "Public snippets are viewable by everyone"
ON public.code_snippets
FOR SELECT
USING (is_public = true);

-- Allow anyone to insert snippets (public compiler)
CREATE POLICY "Anyone can create snippets"
ON public.code_snippets
FOR INSERT
WITH CHECK (true);

-- Allow anyone to update their snippets (we'll use id-based access)
CREATE POLICY "Anyone can update snippets"
ON public.code_snippets
FOR UPDATE
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_code_snippets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_code_snippets_updated_at
BEFORE UPDATE ON public.code_snippets
FOR EACH ROW
EXECUTE FUNCTION public.update_code_snippets_updated_at();