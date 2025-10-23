import { ChevronRight } from "lucide-react";
import { Card } from "./ui/card";

interface CategoryBoxProps {
  title: string;
  onClick: () => void;
}

export const CategoryBox = ({ title, onClick }: CategoryBoxProps) => {
  return (
    <Card
      onClick={onClick}
      className="group relative overflow-hidden bg-secondary/50 backdrop-blur-sm border-2 border-primary/30 hover:border-primary hover:shadow-[0_0_30px_hsl(180_100%_50%/0.4)] transition-all duration-300 cursor-pointer p-6 rounded-2xl"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <ChevronRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" />
      </div>
    </Card>
  );
};
