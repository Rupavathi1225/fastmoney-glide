import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { X } from "lucide-react";

interface CategoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export const CategoryDetailModal = ({
  isOpen,
  onClose,
  title,
  description,
}: CategoryDetailModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-2 border-primary/50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center justify-between">
            {title}
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-muted-foreground leading-relaxed text-lg">
            {description}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
