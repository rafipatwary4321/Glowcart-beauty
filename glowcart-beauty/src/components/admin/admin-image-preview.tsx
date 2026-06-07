import Image from "next/image";

import { cn } from "@/lib/utils";

type AdminImagePreviewProps = {
  imageUrl?: string;
  imageGradient?: string;
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "size-10 rounded-lg",
  md: "size-12 rounded-lg",
  lg: "size-16 rounded-xl",
} as const;

export function AdminImagePreview({
  imageUrl,
  imageGradient = "from-rose-100 to-pink-50",
  alt,
  className,
  size = "md",
}: AdminImagePreviewProps) {
  if (imageUrl) {
    return (
      <div className={cn("relative overflow-hidden bg-muted", sizeClasses[size], className)}>
        <Image src={imageUrl} alt={alt} fill className="object-cover" sizes="64px" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-gradient-to-br",
        imageGradient,
        sizeClasses[size],
        className
      )}
      aria-hidden
    />
  );
}
