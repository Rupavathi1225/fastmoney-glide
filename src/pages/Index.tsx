import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { CategoryBox } from "@/components/CategoryBox";
import { CategoryDetailModal } from "@/components/CategoryDetailModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CategoryBox {
  id: string;
  title: string;
  description: string;
  order_index: number;
}

interface HomepageContent {
  heading: string;
  paragraph: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CategoryBox | null>(null);
  const [categories, setCategories] = useState<CategoryBox[]>([]);
  const [content, setContent] = useState<HomepageContent>({
    heading: "Five Ways to Make the Transition from High School to College Easy",
    paragraph: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
    fetchCategories();
  }, []);

  const fetchContent = async () => {
    console.log("Fetching homepage content...");
    const { data, error } = await supabase
      .from("homepage_content")
      .select("*")
      .limit(1)
      .single();

    console.log("Homepage content result:", { data, error });

    if (error) {
      console.error("Error loading content:", error);
      toast({
        title: "Error loading content",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      console.log("Setting content:", data);
      setContent({
        heading: data.heading,
        paragraph: data.paragraph,
      });
    }
  };

  const fetchCategories = async () => {
    console.log("Fetching categories...");
    const { data, error } = await supabase
      .from("category_boxes")
      .select("*")
      .order("order_index");

    console.log("Categories result:", { data, error });

    if (error) {
      console.error("Error loading categories:", error);
      toast({
        title: "Error loading categories",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      console.log("Setting categories:", data);
      setCategories(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(215,45%,8%)] to-[hsl(220,40%,12%)] font-inter">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-16 animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold text-foreground">FastMoney</h2>
            <p className="text-sm text-muted-foreground"></p>
          </div>
          <button className="p-2 hover:bg-secondary/50 rounded-lg transition-colors">
            <Search className="w-6 h-6 text-primary" />
          </button>
        </header>

        {/* Main Content */}
        <main className="space-y-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            {content.heading}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">
            {content.paragraph}
          </p>

          {/* Related Categories */}
          <div className="pt-8">
            <div className="inline-block bg-secondary/80 px-4 py-2 rounded-lg mb-6">
              <span className="text-sm font-medium text-muted-foreground">
                Related categories
              </span>
            </div>

            <div className="space-y-4">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <CategoryBox
                    id={category.id}
                    title={category.title}
                    onClick={() => navigate('/webresult')}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-primary/20 text-center text-sm text-muted-foreground">
          <p>© 2025 FastMoney. Simplify your financial journey.</p>
        </footer>
      </div>

      {/* Detail Modal */}
      {selectedCategory && (
        <CategoryDetailModal
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          title={selectedCategory.title}
          description={selectedCategory.description}
        />
      )}
    </div>
  );
};

export default Index;
