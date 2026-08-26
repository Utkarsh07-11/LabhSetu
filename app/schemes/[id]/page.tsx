import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { listSchemes, findSchemeBySlug, getSchemeSlugs } from "@/lib/schemes-store";

export async function generateStaticParams() {
  const slugs = await getSchemeSlugs();
  return slugs.map((id) => ({ id }));
}

export default async function SchemeDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scheme = await findSchemeBySlug(id);

  if (!scheme) {
    notFound();
  }

  const related = (await listSchemes())
    .filter((item) => item.id !== scheme.id)
    .slice(0, 3);

  return (
    <SiteShell>
      <section className="container-shell py-12 sm:py-16">
        <Link href="/schemes" className="text-sm text-stone-500">
          Home / Schemes / {scheme.name}
        </Link>

        <div className="mt-6 rounded-[36px] bg-saffron-50 p-8 sm:p-10">
          <p className="text-sm uppercase tracking-[0.2em] text-saffron-600">
            {scheme.ministry}
          </p>
          <h1 className="mt-3 font-serif text-5xl text-stone-900">
            {scheme.name}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-stone-600">
            {scheme.benefit}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/finder">
              <Button>Check if I qualify</Button>
            </Link>
            {scheme.applyUrl ? (
              <a href={scheme.applyUrl} target="_blank" rel="noreferrer">
                <Button variant="outline">Official Site</Button>
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <article className="panel p-7">
            <h2 className="text-2xl font-semibold text-stone-900">Overview</h2>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              {scheme.overview ?? scheme.benefit}
            </p>

            <h3 className="mt-8 text-xl font-semibold text-stone-900">
              Who can apply
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-stone-600">
              {scheme.eligibility?.map((item) => <li key={item}>• {item}</li>)}
            </ul>

            <h3 className="mt-8 text-xl font-semibold text-stone-900">
              How to apply
            </h3>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              {scheme.howToApply}
            </p>

            <h3 className="mt-8 text-xl font-semibold text-stone-900">
              Documents needed
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {scheme.documents.map((document) => (
                <span
                  key={document}
                  className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-700"
                >
                  {document}
                </span>
              ))}
            </div>
          </article>

          <aside className="space-y-5">
            <div className="panel p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
                Quick facts
              </p>
              <div className="mt-4 space-y-4 text-sm text-stone-600">
                <p>
                  <span className="font-medium text-stone-900">Type:</span> {scheme.type}
                </p>
                <p>
                  <span className="font-medium text-stone-900">Category:</span>{" "}
                  {scheme.category}
                </p>
                <p>
                  <span className="font-medium text-stone-900">Deadline:</span>{" "}
                  {scheme.deadline ?? "Ongoing"}
                </p>
                <p>
                  <span className="font-medium text-stone-900">Benefit:</span>{" "}
                  {scheme.annualBenefit ?? "Varies"}
                </p>
              </div>
            </div>

            <div className="panel p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
                Related schemes
              </p>
              <div className="mt-4 space-y-3">
                {related.map((item) => (
                  <Link key={item.id} href={`/schemes/${item.slug}`} className="block rounded-2xl bg-stone-50 p-4 text-sm text-stone-700">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
