import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Save } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface CategoryBox {
  id: string;
  title: string;
  description: string;
  order_index: number;
}

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heading, setHeading] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [categories, setCategories] = useState<CategoryBox[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (!session) {
        navigate("/auth");
        return;
      }

      await fetchContent();
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    checkAuth();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchContent = async () => {
    const [contentResult, categoriesResult] = await Promise.all([
      supabase.from("homepage_content").select("*").single(),
      supabase.from("category_boxes").select("*").order("order_index"),
    ]);

    if (contentResult.data) {
      setHeading(contentResult.data.heading);
      setParagraph(contentResult.data.paragraph);
    }

    if (categoriesResult.data) {
      setCategories(categoriesResult.data);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // Update homepage content
      const { error: contentError } = await supabase
        .from("homepage_content")
        .update({
          heading,
          paragraph,
        })
        .eq("id", (await supabase.from("homepage_content").select("id").single()).data?.id);

      if (contentError) throw contentError;

      // Update categories
      for (const category of categories) {
        const { error } = await supabase
          .from("category_boxes")
          .update({
            title: category.title,
            description: category.description,
          })
          .eq("id", category.id);

        if (error) throw error;
      }

      toast({
        title: "Success!",
        description: "Content updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const updateCategory = (id: string, field: "title" | "description", value: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, [field]: value } : cat))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(215,45%,8%)] to-[hsl(220,40%,12%)] flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(215,45%,8%)] to-[hsl(220,40%,12%)] font-inter">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">Manage FastMoney content</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-primary/50 hover:bg-primary/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Homepage Content */}
        <Card className="mb-6 bg-card border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="text-foreground">Homepage Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heading">Main Heading</Label>
              <Input
                id="heading"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="bg-input border-primary/30 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paragraph">Paragraph</Label>
              <Textarea
                id="paragraph"
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
                rows={4}
                className="bg-input border-primary/30 focus:border-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Boxes */}
        <Card className="mb-6 bg-card border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="text-foreground">Category Boxes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {categories.map((category, index) => (
              <div key={category.id} className="space-y-3 p-4 bg-secondary/30 rounded-lg">
                <h3 className="text-sm font-semibold text-primary">
                  Box {index + 1}
                </h3>
                <div className="space-y-2">
                  <Label htmlFor={`title-${category.id}`}>Title</Label>
                  <Input
                    id={`title-${category.id}`}
                    value={category.title}
                    onChange={(e) =>
                      updateCategory(category.id, "title", e.target.value)
                    }
                    className="bg-input border-primary/30 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`desc-${category.id}`}>Description</Label>
                  <Textarea
                    id={`desc-${category.id}`}
                    value={category.description}
                    onChange={(e) =>
                      updateCategory(category.id, "description", e.target.value)
                    }
                    rows={2}
                    className="bg-input border-primary/30 focus:border-primary"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
