import { SiteShell } from "@/components/layout/site-shell";

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="container-shell py-12 sm:py-16">
        <p className="text-sm uppercase tracking-[0.2em] text-stone-400">
          About LabhSetu
        </p>
        <h1 className="mt-3 font-serif text-5xl text-stone-900">
          Closing the gap between eligible and applying
        </h1>
        <div className="mt-6 max-w-3xl space-y-5 text-base leading-8 text-stone-600">
          <p>
            LabhSetu is designed as a hackathon-ready platform that translates
            complex welfare policy into plain-language next steps. Instead of
            asking citizens to navigate scattered portals, it gives them one
            guided entry point.
          </p>
          <p>
            The current implementation uses a grounded scheme catalog plus an
            optional OpenRouter model call for AI-assisted ranking and phrasing.
            When your env variables are present, you can switch models without
            touching the code.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
