import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "View all",
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:flex-col sm:items-center",
        className
      )}
    >
      <div className={cn("space-y-2", align === "center" && "max-w-2xl")}>
        <h2 className="font-heading text-2xl font-medium tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
