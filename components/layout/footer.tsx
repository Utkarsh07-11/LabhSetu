import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200/70 bg-white/70">
      <div className="container-shell grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="font-serif text-3xl text-stone-900">LabhSetu</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">
            Helping Indian citizens discover benefits, entitlements, and support
            schemes with an AI-assisted experience that feels human.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm text-stone-600">
          <div className="flex flex-col gap-3">
            <Link href="/finder">Eligibility Finder</Link>
            <Link href="/schemes">All Schemes</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/about">About</Link>
            <a href="https://www.india.gov.in/" target="_blank" rel="noreferrer">
              India.gov.in
            </a>
            <a href="https://www.myscheme.gov.in/" target="_blank" rel="noreferrer">
              myScheme
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
