-- Create web_results table
CREATE TABLE public.web_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.category_boxes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  link TEXT,
  logo_url TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'organic' CHECK (type IN ('organic', 'sponsored')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.web_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view web results" 
ON public.web_results 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage web results" 
ON public.web_results 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Add trigger for updated_at
CREATE TRIGGER update_web_results_updated_at
BEFORE UPDATE ON public.web_results
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample data
INSERT INTO public.web_results (category_id, name, link, logo_url, title, description, type, display_order)
SELECT 
  id,
  'example.com',
  'https://example.com',
  'https://example.com/favicon.ico',
  'Wellness Benefits Guide',
  'Complete guide to understanding the benefits of holistic wellness practices',
  'organic',
  1
FROM public.category_boxes
LIMIT 1;