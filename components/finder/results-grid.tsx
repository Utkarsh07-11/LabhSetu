"use client";

import { useMemo, useState } from "react";
import { SchemeCard } from "@/components/finder/scheme-card";
import { Button } from "@/components/ui/button";
import { currencyTotal } from "@/lib/utils";
import type { Scheme, UserProfile } from "@/types";

const filters = ["All", "Central", "State", "Health", "Financial", "Housing"];

export function ResultsGrid({
  schemes,
  profile
}: {
  schemes: Scheme[];
  profile: UserProfile;
}) {
  const [filter, setFilter] = useState("All");
  const total = currencyTotal(schemes);

  const filtered = useMemo(() => {
    if (filter === "All") {
      return schemes;
    }

    if (filter === "Central" || filter === "State") {
      return schemes.filter((scheme) => scheme.type === filter);
    }

    return schemes.filter((scheme) => scheme.category === filter);
  }, [filter, schemes]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-stone-200 bg-white/85 p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-stone-400">
              Results
            </p>
            <h2 className="mt-2 font-serif text-4xl text-stone-900">
              {schemes.length} schemes found for you
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              {profile.gender} · {profile.age} yrs · {profile.state} ·{" "}
              {profile.category} · {profile.occupation}
            </p>
          </div>
          <div className="rounded-[24px] bg-saffron-50 px-5 py-4 text-sm text-saffron-900">
            <p className="text-xs uppercase tracking-[0.18em] text-saffron-600">
              Estimated annual benefit
            </p>
            <p className="mt-1 font-serif text-3xl">
              {total ?? "Multiple benefits"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <Button
              key={item}
              type="button"
              variant={filter === item ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((scheme) => (
          <SchemeCard key={scheme.id} scheme={scheme} />
        ))}
      </div>
    </section>
  );
}
