"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to login.");
      }

      router.push("/admin");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="panel mx-auto max-w-md p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-stone-400">
        Admin Access
      </p>
      <h1 className="mt-3 font-serif text-4xl text-stone-900">Admin login</h1>
      <p className="mt-2 text-sm text-stone-600">
        This session is signed and expires after 24 hours.
      </p>

      <div className="mt-8 space-y-4">
        <Field label="Username" value={username} onChange={setUsername} />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
        />
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Button type="submit" className="mt-6 w-full">
        {loading ? "Logging in..." : "Login as admin"}
      </Button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm text-stone-600">
      <span className="mb-2 block">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 outline-none transition focus:border-saffron-400"
      />
    </label>
  );
}
