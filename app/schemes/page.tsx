import { SiteShell } from "@/components/layout/site-shell";
import { SchemeBrowser } from "@/components/schemes/scheme-browser";
import { listSchemes } from "@/lib/schemes-store";

export default async function SchemesPage() {
  const schemes = await listSchemes();

  return (
    <SiteShell>
      <section className="container-shell py-12 sm:py-16">
        <p className="text-sm uppercase tracking-[0.2em] text-stone-400">
          Scheme Library
        </p>
        <h1 className="mt-3 font-serif text-5xl text-stone-900">
          All Government Schemes
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
          Explore the Mongo-backed catalog of schemes and official portals. The
          sync job now expands this list with a larger central and state source
          registry, and this page paginates the full catalog.
        </p>
        <div className="mt-10">
          <SchemeBrowser schemes={schemes} />
        </div>
      </section>
    </SiteShell>
  );
}
