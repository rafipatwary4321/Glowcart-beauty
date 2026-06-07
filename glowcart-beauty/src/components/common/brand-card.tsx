import Link from "next/link";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Brand, EntityCardProps } from "@/types";

function getInitials(name: string): string {
  return name
    .split(/[\s&]+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function BrandCard({ data, className }: EntityCardProps<Brand>) {
  return (
    <Link href={`/products?brand=${data.slug}`} className={cn("block", className)}>
      <Card className="group flex h-full flex-col items-center justify-center gap-3 rounded-2xl border-border/60 bg-card py-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg">
        <div
          className={cn(
            "flex size-16 items-center justify-center rounded-full bg-gradient-to-br text-lg font-semibold text-foreground/80 transition-transform duration-300 group-hover:scale-105 sm:size-20 sm:text-xl",
            data.imageGradient
          )}
        >
          {getInitials(data.name)}
        </div>
        <div className="space-y-1 px-4 text-center">
          <h3 className="font-heading text-base font-medium text-foreground sm:text-lg">
            {data.name}
          </h3>
          <p className="text-xs text-muted-foreground">{data.tagline}</p>
          <p className="text-[11px] font-medium uppercase tracking-wider text-primary/80">
            {data.productCount} products
          </p>
        </div>
      </Card>
    </Link>
  );
}
