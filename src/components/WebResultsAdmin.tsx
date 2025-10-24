import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface WebResult {
  id: string;
  name: string;
  link: string | null;
  logo_url: string | null;
  title: string;
  description: string;
  display_order: number;
}

interface WebResultsAdminProps {
  webResults: WebResult[];
  onRefresh: () => void;
}

export const WebResultsAdmin = ({
  webResults,
  onRefresh,
}: WebResultsAdminProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<WebResult | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    logo_url: "",
    title: "",
    description: "",
    display_order: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      link: "",
      logo_url: "",
      title: "",
      description: "",
      display_order: 0,
    });
    setEditingResult(null);
  };

  const handleEdit = (result: WebResult) => {
    setEditingResult(result);
    setFormData({
      name: result.name,
      link: result.link || "",
      logo_url: result.logo_url || "",
      title: result.title,
      description: result.description,
      display_order: result.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("web_results").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Result deleted successfully",
      });
      onRefresh();
    }
  };

  const handleSubmit = async () => {
    const dataToSave = {
      ...formData,
      link: formData.link || null,
      logo_url: formData.logo_url || null,
    };

    if (editingResult) {
      const { error } = await supabase
        .from("web_results")
        .update(dataToSave)
        .eq("id", editingResult.id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Result updated successfully",
        });
        setIsDialogOpen(false);
        resetForm();
        onRefresh();
      }
    } else {
      const { error } = await supabase.from("web_results").insert(dataToSave);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Result created successfully",
        });
        setIsDialogOpen(false);
        resetForm();
        onRefresh();
      }
    }
  };

  return (
    <Card className="bg-card border-2 border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Web Results</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Result
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-2 border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingResult ? "Edit Result" : "Add New Result"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="example.com"
                  className="bg-input border-primary/30 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Link (Optional - if empty, stays on page)</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="https://example.com"
                  className="bg-input border-primary/30 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, logo_url: e.target.value })
                  }
                  placeholder="https://..."
                  className="bg-input border-primary/30 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="bg-input border-primary/30 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="bg-input border-primary/30 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-input border-primary/30 focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  className="border-primary/30 hover:bg-primary/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {editingResult ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-primary/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      {result.logo_url ? (
                        <img src={result.logo_url} alt={result.name} className="w-8 h-8 object-contain" />
                      ) : (
                        <div className="w-8 h-8 bg-primary/10 rounded" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{result.title}</TableCell>
                    <TableCell>{result.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {result.link || <span className="text-muted-foreground">No link</span>}
                    </TableCell>
                    <TableCell>{result.display_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(result)}
                          className="hover:bg-primary/10"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(result.id)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
