import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  backHref?: string;
  className?: string;
};

export function AdminPageHeader({
  title,
  description,
  actionLabel,
  actionHref,
  backHref,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="space-y-1">
        {backHref ? (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
        ) : null}
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? <p className="max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
      </div>

      {actionLabel && actionHref ? (
        <Button asChild className="w-full shrink-0 rounded-full sm:w-auto">
          <Link href={actionHref}>
            <Plus className="size-4" />
            {actionLabel}
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
