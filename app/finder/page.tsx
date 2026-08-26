import { ProfileForm } from "@/components/finder/profile-form";
import { SiteShell } from "@/components/layout/site-shell";

export default function FinderPage() {
  return (
    <SiteShell>
      <section className="container-shell py-12 sm:py-16">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-stone-400">
            Eligibility Finder
          </p>
          <h1 className="mt-3 font-serif text-5xl text-stone-900">
            Find your schemes in one guided flow
          </h1>
          <p className="mt-4 text-base leading-7 text-stone-600">
            Enter your profile once and get a clean shortlist of central and
            state support schemes with benefits, documents, and official links.
          </p>
        </div>
        <ProfileForm />
      </section>
    </SiteShell>
  );
}
