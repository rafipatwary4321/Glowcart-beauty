import Link from "next/link";
import {
  Droplets,
  Heart,
  Moon,
  Shield,
  Sparkles,
  Sun,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { EntityCardProps, SkinConcern } from "@/types";

const iconMap: Record<SkinConcern["icon"], LucideIcon> = {
  droplets: Droplets,
  sparkles: Sparkles,
  sun: Sun,
  heart: Heart,
  shield: Shield,
  moon: Moon,
};

export function SkinConcernCard({
  data,
  className,
}: EntityCardProps<SkinConcern>) {
  const Icon = iconMap[data.icon];

  return (
    <Link
      href={`/shop?concern=${data.slug}`}
      className={cn("block", className)}
    >
      <Card className="group h-full overflow-hidden rounded-2xl border-border/60 py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg">
        <div
          className={cn(
            "flex flex-col gap-4 bg-gradient-to-br p-5 sm:p-6",
            data.imageGradient
          )}
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-white/70 text-primary shadow-sm backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
            <Icon className="size-5" strokeWidth={1.75} />
          </span>
          <div className="space-y-1.5">
            <h3 className="font-heading text-lg font-medium text-foreground">
              {data.name}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {data.description}
            </p>
            <p className="pt-1 text-xs font-medium text-primary">
              Shop {data.productCount} solutions →
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
