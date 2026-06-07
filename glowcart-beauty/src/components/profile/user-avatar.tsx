import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name?: string | null;
  image?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
};

function getInitials(name?: string | null): string {
  if (!name) return "GC";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "GC";
}

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-9 text-sm",
  lg: "size-16 text-xl",
} as const;

export function UserAvatar({ name, image, className, size = "md" }: UserAvatarProps) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name ?? "User avatar"}
        className={cn(
          "rounded-full object-cover ring-1 ring-border/60",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "flex items-center justify-center rounded-full bg-primary/10 font-medium text-primary ring-1 ring-primary/20",
        sizeClasses[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
