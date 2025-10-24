-- Make category_id nullable in web_results table
ALTER TABLE public.web_results 
ALTER COLUMN category_id DROP NOT NULL;