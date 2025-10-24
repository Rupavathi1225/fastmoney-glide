import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

interface WebResult {
  id: string;
  name: string;
  link: string | null;
  logo_url: string | null;
  title: string;
  description: string;
  type: string;
  display_order: number;
}

interface CategoryInfo {
  title: string;
  description: string;
}

const WebResult = () => {
  const [results, setResults] = useState<WebResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const resultsPerPage = 10;

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("web_results")
      .select("*")
      .order("display_order", { ascending: true });

    if (data && !error) {
      setResults(data);
    }
    setLoading(false);
  };

  const handleResultClick = (result: WebResult) => {
    if (result.link) {
      window.open(result.link, "_blank");
    }
  };

  const filteredResults = results.filter(
    (result) =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredResult = filteredResults.find((r) => r.type === "sponsored");
  const organicResults = filteredResults.filter((r) => r.type === "organic");

  const totalPages = Math.ceil(organicResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const paginatedResults = organicResults.slice(startIndex, startIndex + resultsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(215,45%,8%)] to-[hsl(220,40%,12%)] flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(215,45%,8%)] to-[hsl(220,40%,12%)] font-inter">
      {/* Header */}
      <header className="border-b border-primary/20 bg-secondary/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">W</span>
              </div>
              <span className="text-foreground font-semibold text-lg">
                Web Results
              </span>
            </div>
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="pl-10 bg-input border-primary/30 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Featured Result */}
        {featuredResult && (
          <Card
            onClick={() => handleResultClick(featuredResult)}
            className="mb-6 p-6 bg-gradient-to-r from-[hsl(220,60%,25%)] to-[hsl(220,50%,20%)] border-2 border-primary/40 hover:border-primary cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_hsl(180_100%_50%/0.3)]"
          >
            <div className="flex items-start gap-4">
              {featuredResult.logo_url && (
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <img
                    src={featuredResult.logo_url}
                    alt={featuredResult.name}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-primary font-medium">{featuredResult.name}</span>
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    Sponsored
                  </Badge>
                </div>
                {featuredResult.link && (
                  <p className="text-sm text-primary/70 mb-1 truncate">{featuredResult.link}</p>
                )}
                <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                  {featuredResult.title}
                  <ExternalLink className="w-4 h-4" />
                </h2>
                <p className="text-muted-foreground">{featuredResult.description}</p>
                {featuredResult.link && (
                  <Button
                    variant="outline"
                    className="mt-4 border-primary/50 hover:bg-primary/10"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Organic Results */}
        <div className="mb-6">
          <h3 className="text-sm text-muted-foreground mb-4">Web Results</h3>
          <div className="space-y-4">
            {paginatedResults.map((result) => (
              <Card
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="p-4 bg-card border-2 border-primary/20 hover:border-primary cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_hsl(180_100%_50%/0.2)]"
              >
                <div className="flex items-start gap-4">
                  {result.logo_url && (
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <img
                        src={result.logo_url}
                        alt={result.name}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-muted-foreground">{result.name}</span>
                    </div>
                    {result.link && (
                      <p className="text-xs text-primary/70 mb-1 truncate">{result.link}</p>
                    )}
                    <h3 className="text-lg font-semibold text-primary hover:underline mb-1 flex items-center gap-2">
                      {result.title}
                      {result.link && <ExternalLink className="w-3 h-3" />}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {result.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-primary/30 hover:bg-primary/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className={
                  currentPage === page
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "border-primary/30 hover:bg-primary/10"
                }
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-primary/30 hover:bg-primary/10"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No results found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WebResult;
