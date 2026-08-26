"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AdminDashboardActions() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<null | "sync" | "digest">(null);

  const run = async (type: "sync" | "digest") => {
    setLoading(type);
    setMessage("");

    const endpoint =
      type === "sync" ? "/api/admin/sync-schemes" : "/api/admin/daily-match";
    const response = await fetch(endpoint, { method: "POST" });
    const data = await response.json();
    setLoading(null);

    if (!response.ok) {
      setMessage(data.error || "Admin action failed.");
      return;
    }

    if (type === "sync") {
      setMessage(
        `Sync complete. ${data.schemeCount ?? 0} records, ${data.sourceCount ?? 0} sources.`
      );
      return;
    }

    setMessage(
      `Daily match complete. Scanned ${data.scannedUsers ?? 0} users, emailed ${data.emailedUsers ?? 0}.`
    );
  };

  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <div className="panel p-6">
      <h2 className="text-2xl font-semibold text-stone-900">Admin actions</h2>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={() => run("sync")}>
          {loading === "sync" ? "Running sync..." : "Run scheme sync"}
        </Button>
        <Button variant="outline" onClick={() => run("digest")}>
          {loading === "digest" ? "Running daily match..." : "Run daily match"}
        </Button>
        <Button variant="ghost" onClick={logout}>
          Logout
        </Button>
      </div>
      {message ? (
        <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
          {message}
        </div>
      ) : null}
    </div>
  );
}
