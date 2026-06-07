import { PageSection } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterContent } from "@/data/newsletter";
import type { HomeSectionProps, NewsletterContent } from "@/types";

type NewsletterSectionProps = HomeSectionProps & {
  content?: NewsletterContent;
};

export function NewsletterSection({
  content = newsletterContent,
  className,
}: NewsletterSectionProps) {
  return (
    <PageSection id="newsletter" variant="default" className={className}>
      <div className="mx-auto max-w-2xl rounded-3xl border border-border/60 bg-gradient-to-br from-rose-50/80 via-white to-beige-50 px-6 py-12 text-center shadow-sm transition-shadow duration-300 hover:shadow-md sm:px-10 sm:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {content.eyebrow}
        </p>
        <h2 className="mt-3 font-heading text-2xl font-medium text-foreground sm:text-3xl">
          {content.title}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          {content.description}
        </p>
        <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            placeholder={content.placeholder}
            className="rounded-full border-border/60 bg-white"
            required
          />
          <Button type="submit" className="shrink-0 rounded-full px-6">
            {content.buttonLabel}
          </Button>
        </form>
        <p className="mt-4 text-xs text-muted-foreground">{content.disclaimer}</p>
      </div>
    </PageSection>
  );
}
