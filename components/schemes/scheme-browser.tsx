"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Scheme } from "@/types";

const PAGE_SIZE = 9;

export function SchemeBrowser({ schemes }: { schemes: Scheme[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return schemes.filter((scheme) => {
      const matchesQuery =
        !query ||
        `${scheme.name} ${scheme.ministry} ${scheme.category} ${scheme.sourceLabel ?? ""} ${scheme.state ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase());

      const matchesType = type === "All" ? true : scheme.type === type;
      return matchesQuery && matchesType;
    });
  }, [query, schemes, type]);

  useEffect(() => {
    setPage(1);
  }, [query, type]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="panel h-fit p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
          Filter
        </p>
        <div className="mt-4 space-y-2">
          {["All", "Central", "State"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setType(option)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm ${
                option === type
                  ? "bg-saffron-50 text-saffron-700"
                  : "bg-stone-50 text-stone-600"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </aside>

      <section className="space-y-5">
        <div className="panel p-4">
          <label className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3">
            <Search className="size-4 text-stone-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full border-0 bg-transparent outline-none"
              placeholder="Search schemes, ministries, categories..."
            />
          </label>
        </div>

        <div className="flex items-center justify-between text-sm text-stone-600">
          <p>
            Showing {paginated.length} of {filtered.length} records
          </p>
          <p>
            Page {page} of {totalPages}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {paginated.map((scheme) => (
            <Link
              key={scheme.id}
              href={`/schemes/${scheme.slug}`}
              className="panel p-5 transition hover:-translate-y-1"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
                {scheme.type} · {scheme.category}
                {scheme.state ? ` · ${scheme.state}` : ""}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-stone-900">
                {scheme.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {scheme.benefit}
              </p>
              {scheme.sourceLabel ? (
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-saffron-600">
                  {scheme.sourceLabel}
                </p>
              ) : null}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-700 disabled:opacity-50"
          >
            <ChevronLeft className="size-4" />
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .slice(Math.max(0, page - 3), Math.max(5, page + 2))
            .map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`size-10 rounded-full text-sm ${
                  pageNumber === page
                    ? "bg-saffron-400 text-white"
                    : "border border-stone-200 text-stone-700"
                }`}
              >
                {pageNumber}
              </button>
            ))}
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-700 disabled:opacity-50"
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
