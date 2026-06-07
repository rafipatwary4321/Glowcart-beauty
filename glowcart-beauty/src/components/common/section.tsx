import { Container } from "@/components/common/container";
import { cn } from "@/lib/utils";

export type SectionVariant = "default" | "muted" | "white" | "gradient";

const variantStyles: Record<SectionVariant, string> = {
  default: "bg-background",
  muted: "bg-beige-50/60",
  white: "bg-white",
  gradient: "bg-gradient-to-b from-white to-beige-50/80",
};

export type PageSectionProps = {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
  variant?: SectionVariant;
  spacing?: "default" | "compact" | "none";
};

const spacingStyles = {
  default: "py-14 sm:py-16 lg:py-20",
  compact: "py-8 sm:py-10",
  none: "",
};

export function PageSection({
  children,
  id,
  className,
  containerClassName,
  variant = "default",
  spacing = "default",
}: PageSectionProps) {
  return (
    <section
      id={id}
      className={cn(spacingStyles[spacing], variantStyles[variant], className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
