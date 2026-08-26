"use client";

import { motion } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { Scheme } from "@/types";
import { cn } from "@/lib/utils";

export function SchemeCard({ scheme }: { scheme: Scheme }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] border border-stone-200 bg-white/95 p-5 shadow-soft transition hover:-translate-y-1 hover:border-saffron-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
            {scheme.ministry}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900">
            {scheme.name}
          </h3>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            scheme.type === "Central"
              ? "bg-sky-50 text-sky-700"
              : "bg-green-50 text-green-700"
          )}
        >
          {scheme.type}
        </span>
      </div>

      {scheme.annualBenefit ? (
        <div className="mt-4 inline-flex rounded-full bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
          {scheme.annualBenefit}
        </div>
      ) : null}

      <p className="mt-4 text-sm leading-6 text-stone-600">{scheme.benefit}</p>

      <button
        type="button"
        className="mt-5 flex items-center gap-2 text-sm font-medium text-saffron-600"
        onClick={() => setExpanded((value) => !value)}
      >
        <ChevronDown
          className={cn("size-4 transition", expanded && "rotate-180")}
        />
        {expanded ? "Hide details" : "How to apply + documents"}
      </button>

      {expanded ? (
        <div className="mt-4 border-t border-stone-100 pt-4">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
            How to apply
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            {scheme.howToApply}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-stone-400">
            Documents needed
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {scheme.documents.map((document) => (
              <span
                key={document}
                className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600"
              >
                {document}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {scheme.applyUrl ? (
        <a
          href={scheme.applyUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 flex h-11 items-center justify-center gap-2 rounded-full border border-stone-200 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        >
          Apply on official portal
          <ExternalLink className="size-4" />
        </a>
      ) : null}
    </motion.article>
  );
}
