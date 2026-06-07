import { Container } from "@/components/common/container";

type ContentPageProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  html: string;
};

export function ContentPage({ eyebrow, title, subtitle, html }: ContentPageProps) {
  return (
    <section className="bg-gradient-to-b from-rose-50/40 via-white to-beige-50/30 py-14 sm:py-16 lg:py-20">
      <Container className="max-w-3xl">
        <div className="mb-8 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          {subtitle ? <p className="text-sm text-muted-foreground sm:text-base">{subtitle}</p> : null}
        </div>
        <article
          className="prose prose-neutral max-w-none prose-headings:font-heading prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Container>
    </section>
  );
}
