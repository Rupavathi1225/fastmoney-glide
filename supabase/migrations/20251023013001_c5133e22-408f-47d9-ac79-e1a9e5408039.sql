-- Create table for homepage content
CREATE TABLE public.homepage_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading TEXT NOT NULL DEFAULT 'Five Ways to Make the Transition from High School to College Easy',
  paragraph TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create table for category boxes
CREATE TABLE public.category_boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_boxes ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view homepage content"
  ON public.homepage_content
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view category boxes"
  ON public.category_boxes
  FOR SELECT
  USING (true);

-- Admin policies (will be checked via custom function)
CREATE POLICY "Authenticated users can update homepage content"
  ON public.homepage_content
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update category boxes"
  ON public.category_boxes
  FOR ALL
  TO authenticated
  USING (true);

-- Insert initial data
INSERT INTO public.homepage_content (paragraph) VALUES
('Transitioning to financial independence can be as exciting as it is challenging. With FastMoney, you can simplify your financial journey — from learning smart saving habits to mastering investments. These five FastMoney strategies will help you move from managing pocket money to managing real wealth effortlessly.');

INSERT INTO public.category_boxes (title, description, order_index) VALUES
('Budget Like a Pro', 'Learn how to create and stick to a simple, smart budget using FastMoney''s built-in tools.', 1),
('Smart Saving Plans', 'Set financial goals, automate savings, and watch your progress grow every month.', 2),
('Beginner Investments', 'Understand the basics of investing — from mutual funds to digital assets — safely and confidently.', 3),
('Credit & Loan Guidance', 'Get personalized tips on improving your credit score and managing student or personal loans.', 4),
('Track Expenses Intelligently', 'Analyze your spending patterns and make data-driven financial decisions using FastMoney insights.', 5);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER homepage_content_updated_at
  BEFORE UPDATE ON public.homepage_content
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER category_boxes_updated_at
  BEFORE UPDATE ON public.category_boxes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();