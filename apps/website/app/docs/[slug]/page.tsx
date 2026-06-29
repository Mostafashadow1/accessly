import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  docsPageSlugs,
  getDocsPage,
  getDocsPageNeighbors,
} from "@/data/docs-pages";
import { CodeBlock } from "@/components/ui/code-block";

type DocsRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return docsPageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: DocsRoutePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getDocsPage(slug);

  if (!page) {
    return {
      title: "Docs | Accessly",
    };
  }

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function DocsRoutePage({ params }: DocsRoutePageProps) {
  const { slug } = await params;
  const page = getDocsPage(slug);

  if (!page) notFound();

  const { previous, next } = getDocsPageNeighbors(slug);

  return (
    <article className="mx-auto w-full max-w-4xl">
      <header className="mb-10 border-b border-border pb-8">
        <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary-light px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
          Documentation
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          {page.title}
        </h1>
        <p className="mt-4 max-w-3xl text-[16px] leading-7 text-muted">
          {page.description}
        </p>
      </header>

      <div className="grid gap-5">
        {page.sections.map((section) => (
          <section
            key={section.title}
            className="rounded-xl border border-border bg-surface/55 p-5"
          >
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {section.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">{section.body}</p>
            {section.code ? (
              <div className="mt-5">
                <CodeBlock
                  title={section.title}
                  code={section.code}
                  language={section.language ?? "ts"}
                />
              </div>
            ) : null}
          </section>
        ))}
      </div>

      <nav
        className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2"
        aria-label="Documentation pagination"
      >
        {previous ? (
          <Link
            href={`/docs/${previous.slug}`}
            className="bg-surface p-5 no-underline transition hover:bg-surface-hover"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-dark">
              Previous
            </div>
            <div className="mt-2 text-sm font-semibold text-foreground">
              {previous.title}
            </div>
          </Link>
        ) : (
          <Link
            href="/docs"
            className="bg-surface p-5 no-underline transition hover:bg-surface-hover"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-dark">
              Previous
            </div>
            <div className="mt-2 text-sm font-semibold text-foreground">
              Overview
            </div>
          </Link>
        )}

        {next ? (
          <Link
            href={`/docs/${next.slug}`}
            className="bg-surface p-5 text-right no-underline transition hover:bg-surface-hover"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-dark">
              Next
            </div>
            <div className="mt-2 text-sm font-semibold text-foreground">
              {next.title}
            </div>
          </Link>
        ) : (
          <Link
            href="/docs/use-cases"
            className="bg-primary/10 p-5 text-right no-underline transition hover:bg-primary/15"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-dark">
              Next
            </div>
            <div className="mt-2 text-sm font-semibold text-foreground">
              Use Cases
            </div>
          </Link>
        )}
      </nav>
    </article>
  );
}
