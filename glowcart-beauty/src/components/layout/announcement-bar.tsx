"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { announcements } from "@/data/announcements";
import { cn } from "@/lib/utils";

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % announcements.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + announcements.length) % announcements.length);
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [dismissed, next]);

  if (dismissed) return null;

  const announcement = announcements[current];

  return (
    <div className="relative bg-foreground text-background">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-2 px-10 sm:px-12">
        <button
          type="button"
          onClick={prev}
          className="absolute left-2 flex size-6 items-center justify-center rounded-full text-background/70 transition-colors hover:bg-background/10 hover:text-background sm:left-4"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="size-3.5" />
        </button>

        <p className="truncate text-center text-xs font-medium sm:text-sm">
          {announcement.message}
          {announcement.href && announcement.linkLabel && (
            <>
              {" — "}
              <Link
                href={announcement.href}
                className="underline underline-offset-2 transition-opacity hover:opacity-80"
              >
                {announcement.linkLabel}
              </Link>
            </>
          )}
        </p>

        <button
          type="button"
          onClick={next}
          className="absolute right-8 flex size-6 items-center justify-center rounded-full text-background/70 transition-colors hover:bg-background/10 hover:text-background sm:right-10"
          aria-label="Next announcement"
        >
          <ChevronRight className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className={cn(
            "absolute right-2 flex size-6 items-center justify-center rounded-full",
            "text-background/70 transition-colors hover:bg-background/10 hover:text-background sm:right-4"
          )}
          aria-label="Dismiss announcements"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
