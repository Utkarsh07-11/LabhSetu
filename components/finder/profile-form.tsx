"use client";

import { useState } from "react";
import { Download, Share2 } from "lucide-react";
import { LoadingState } from "@/components/finder/loading-state";
import { ResultsGrid } from "@/components/finder/results-grid";
import { ShareButton } from "@/components/shared/share-button";
import { Button } from "@/components/ui/button";
import type { Scheme, UserProfile } from "@/types";

const states = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Maharashtra",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Gujarat",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

const occupations = [
  "Farmer / Agricultural worker",
  "Student",
  "Salaried employee",
  "Self-employed / Business owner",
  "Daily wage / Unorganised worker",
  "Unemployed",
  "Retired / Senior citizen",
  "Homemaker"
];

const extras = [
  { id: "bpl", label: "BPL card holder" },
  { id: "divyang", label: "Divyang / Differently abled" },
  { id: "widow", label: "Widow / Single woman" },
  { id: "home_buyer", label: "First-time home buyer" },
  { id: "pregnant", label: "Pregnant / Lactating mother" },
  { id: "ex_serviceman", label: "Ex-serviceman family" }
];

const initialProfile: UserProfile = {
  age: "",
  gender: "",
  state: "Maharashtra",
  income: "",
  occupation: "",
  category: "",
  extras: []
};

export function ProfileForm() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [shareUrl, setShareUrl] = useState("");

  const updateField = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const downloadReport = () => {
    const params = new URLSearchParams({
      profile: JSON.stringify(profile),
      schemes: JSON.stringify(schemes)
    });

    window.open(`/report/demo?${params.toString()}`, "_blank");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/find-schemes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profile)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to match schemes right now.");
      }

      setSchemes(data.schemes);

      const saveResponse = await fetch("/api/save-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ profile, schemes: data.schemes })
      });

      const saved = await saveResponse.json();
      if (saveResponse.ok && saved.shareUrl) {
        setShareUrl(saved.shareUrl);
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[32px] border border-stone-200 bg-white/90 p-6 shadow-soft sm:p-8"
      >
        <p className="text-sm uppercase tracking-[0.2em] text-stone-400">
          Step 1 of 1
        </p>
        <h2 className="mt-3 font-serif text-4xl text-stone-900">
          Tell us about yourself
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Takes around 30 seconds. No account needed for the first match.
        </p>

        <div className="mt-8 space-y-8">
          <section>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
              Personal details
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Age">
                <input
                  required
                  type="number"
                  min="18"
                  max="100"
                  value={profile.age}
                  onChange={(event) => updateField("age", event.target.value)}
                  className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 outline-none transition focus:border-saffron-400"
                  placeholder="28"
                />
              </Field>
              <Field label="Gender">
                <select
                  required
                  value={profile.gender}
                  onChange={(event) => updateField("gender", event.target.value)}
                  className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 outline-none transition focus:border-saffron-400"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
              <Field label="State">
                <select
                  required
                  value={profile.state}
                  onChange={(event) => updateField("state", event.target.value)}
                  className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 outline-none transition focus:border-saffron-400"
                >
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Social category">
                <select
                  required
                  value={profile.category}
                  onChange={(event) => updateField("category", event.target.value)}
                  className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 outline-none transition focus:border-saffron-400"
                >
                  <option value="">Select</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                  <option value="Minority">Minority</option>
                </select>
              </Field>
            </div>
          </section>

          <section>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
              Financial details
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Annual income">
                <select
                  required
                  value={profile.income}
                  onChange={(event) => updateField("income", event.target.value)}
                  className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 outline-none transition focus:border-saffron-400"
                >
                  <option value="">Select</option>
                  <option value="Below ₹1 lakh">Below ₹1 lakh</option>
                  <option value="₹1-2.5 lakh">₹1-2.5 lakh</option>
                  <option value="₹2.5-5 lakh">₹2.5-5 lakh</option>
                  <option value="₹5-8 lakh">₹5-8 lakh</option>
                  <option value="Above ₹8 lakh">Above ₹8 lakh</option>
                </select>
              </Field>
              <Field label="Occupation">
                <select
                  required
                  value={profile.occupation}
                  onChange={(event) => updateField("occupation", event.target.value)}
                  className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 outline-none transition focus:border-saffron-400"
                >
                  <option value="">Select</option>
                  {occupations.map((occupation) => (
                    <option key={occupation} value={occupation}>
                      {occupation}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          <section>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
              Additional qualifiers
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {extras.map((extra) => {
                const checked = profile.extras.includes(extra.id);
                return (
                  <label
                    key={extra.id}
                    className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) =>
                        updateField(
                          "extras",
                          event.target.checked
                            ? [...profile.extras, extra.id]
                            : profile.extras.filter((item) => item !== extra.id)
                        )
                      }
                    />
                    {extra.label}
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <Button type="submit" size="lg" className="mt-8 w-full">
          {loading ? "Searching schemes..." : "Find My Schemes"}
        </Button>
      </form>

      <div className="space-y-6">
        {loading ? <LoadingState /> : null}

        {!loading && schemes.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-stone-300 bg-white/75 p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.2em] text-stone-400">
              What you get
            </p>
            <h3 className="mt-3 font-serif text-3xl text-stone-900">
              A personalised shortlist, not a maze of portals
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">
              We turn a few profile details into a ranked list of central and
              state schemes, plus documents, official links, and a printable
              report.
            </p>
          </div>
        ) : null}

        {!loading && schemes.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={downloadReport}>
                <Download className="mr-2 size-4" />
                Download report
              </Button>
              {shareUrl ? (
                <ShareButton title="My LabhSetu Report" url={shareUrl} />
              ) : null}
              <Button
                variant="ghost"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <Share2 className="mr-2 size-4" />
                Edit profile
              </Button>
            </div>
            <ResultsGrid schemes={schemes} profile={profile} />
          </>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm text-stone-600">
      <span className="mb-2 block">{label}</span>
      {children}
    </label>
  );
}
