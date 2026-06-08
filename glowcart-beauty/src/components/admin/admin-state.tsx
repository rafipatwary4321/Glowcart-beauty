import { AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminErrorStateProps = {
  message: string;
  onRetry?: () => void;
  className?: string;
};

export function AdminErrorState({ message, onRetry, className }: AdminErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center",
        className
      )}
    >
      <AlertCircle className="mb-3 size-8 text-destructive" aria-hidden />
      <p className="max-w-md text-sm text-destructive">{message}</p>
      {onRetry ? (
        <Button type="button" variant="outline" className="mt-4 rounded-full" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

type AdminLoadingStateProps = {
  message?: string;
  className?: string;
};

export function AdminLoadingState({ message = "Loading...", className }: AdminLoadingStateProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-card px-6 py-16 text-sm text-muted-foreground",
        className
      )}
    >
      <Loader2 className="size-4 animate-spin" aria-hidden />
      {message}
    </div>
  );
}

type AdminEmptyStateProps = {
  title: string;
  description?: string;
  className?: string;
};

export function AdminEmptyState({ title, description, className }: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border/60 bg-card px-6 py-12 text-center",
        className
      )}
    >
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
