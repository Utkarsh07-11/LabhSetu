import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CircleDollarSign,
  HeartPulse,
  Landmark,
  Leaf,
  MailCheck,
  School
} from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const categories = [
  { title: "Farmers", icon: Leaf, copy: "Income support, irrigation, crop cover" },
  { title: "Students", icon: School, copy: "Scholarships, fee support, hostels" },
  { title: "Women", icon: CircleDollarSign, copy: "Direct transfers, livelihoods, care" },
  { title: "Health", icon: HeartPulse, copy: "Insurance, treatment, maternal support" },
  { title: "Housing", icon: Landmark, copy: "Subsidies, home support, urban schemes" }
];

export default function HomePage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="container-shell grid min-h-[calc(100svh-72px)] items-center gap-16 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative z-10">
            <Badge>India&apos;s smartest scheme finder</Badge>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[0.96] text-stone-900 sm:text-6xl lg:text-7xl">
              You deserve <span className="text-saffron-600 italic">benefits</span>.
              <br />
              Are you claiming them?
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
              LabhSetu helps any Indian citizen discover central and
              state-level government schemes they may qualify for in under 30
              seconds, then keeps checking daily and emails them when new
              matches appear.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/finder">
                <Button size="lg">
                  Find My Schemes
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/schemes">
                <Button size="lg" variant="outline">
                  Browse All Schemes
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-stone-400">
              Free to try. Sign up when you want daily alerts and saved profiles.
            </p>
          </div>

          <div className="relative z-10 grid gap-4 sm:grid-cols-2">
            <StatCard value="1,000+" label="schemes across central and state programs" />
            <StatCard value="28" label="states and UT contexts supported in the matching flow" />
            <StatCard value="30 sec" label="to complete the finder and generate a usable shortlist" />
            <StatCard value="₹1.2L+" label="demo benefit potential shown in the live flow" />
          </div>
        </div>
      </section>

      <section className="container-shell py-20">
        <div className="panel grid gap-8 overflow-hidden bg-gradient-to-br from-saffron-50 via-white to-green-50 px-8 py-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-saffron-600">
              New feature
            </p>
            <h2 className="mt-3 font-serif text-4xl text-stone-900">
              Set your profile once. Get daily scheme alerts automatically.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
              Create an account with your email and phone number, save your
              eligibility details, and LabhSetu will re-check your profile
              every day. If a new scheme looks relevant, you get an email from us.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg">Create free account</Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  View dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              {
                icon: MailCheck,
                title: "Email + phone signup",
                copy: "Store user details securely and keep a saved eligibility profile."
              },
              {
                icon: BellRing,
                title: "Daily eligibility scan",
                copy: "Re-match every saved profile against the latest catalog once per day."
              },
              {
                icon: ArrowRight,
                title: "Actionable alerts",
                copy: "Email users only when their latest match set changes."
              }
            ].map(({ icon: ItemIcon, title, copy }) => {
              return (
                <div key={title} className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-soft">
                  <ItemIcon className="size-5 text-saffron-600" />
                  <h3 className="mt-4 text-lg font-semibold text-stone-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-stone-400">
            How it works
          </p>
          <h2 className="section-title mt-3">A faster path from eligibility to action</h2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {[
            ["1", "Fill your profile", "Age, state, category, occupation, and a few extra qualifiers."],
            ["2", "AI scans schemes", "We match central and state schemes that fit the profile and the context."],
            ["3", "Take the next step", "Get documents, official links, and a report you can share with family."]
          ].map(([count, title, copy]) => (
            <div key={title} className="panel p-6">
              <p className="font-serif text-5xl text-saffron-400">{count}</p>
              <h3 className="mt-5 text-xl font-semibold text-stone-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-6">
        <div className="grid gap-4 lg:grid-cols-5">
          {categories.map(({ title, icon: Icon, copy }) => (
            <div key={title} className="panel p-5">
              <Icon className="size-6 text-saffron-600" />
              <h3 className="mt-4 text-lg font-semibold text-stone-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-20">
        <div className="panel grid gap-8 bg-india-navy px-8 py-10 text-white lg:grid-cols-[1fr_1fr_1fr]">
          {[
            ['"I found 8 schemes I had never heard of."', "Ramesh K., Farmer, Maharashtra"],
            ['"The report was simple enough to explain to my parents on WhatsApp."', "Priya S., Student, Gujarat"],
            ['"It felt like someone finally translated policy into plain language."', "Amina B., Homemaker, Karnataka"]
          ].map(([quote, author]) => (
            <div key={author}>
              <p className="font-serif text-3xl leading-tight">{quote}</p>
              <p className="mt-4 text-sm text-white/70">{author}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
