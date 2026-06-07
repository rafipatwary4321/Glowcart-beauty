import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

type CategoryCardProps = {
  category: Category;
  className?: string;
};

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link href={`/shop/${category.slug}`} className={cn("block", className)}>
      <Card className="group overflow-hidden rounded-2xl border-border/60 py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[3/4]">
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br transition-transform duration-500 group-hover:scale-105",
              category.imageGradient
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="font-heading text-xl font-medium sm:text-2xl">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-white/80">
                  {category.productCount} products
                </p>
              </div>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors group-hover:bg-white/30">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
            <p className="mt-2 text-sm text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {category.description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
