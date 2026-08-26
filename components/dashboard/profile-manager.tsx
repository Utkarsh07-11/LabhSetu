"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type {
  AppUser,
  NotificationHistoryItem,
  Scheme,
  UserProfile
} from "@/types";

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
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
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

const defaultProfile: UserProfile = {
  age: "",
  gender: "",
  state: "Maharashtra",
  income: "",
  occupation: "",
  category: "",
  extras: []
};

export function ProfileManager({
  user,
  initialProfile,
  initialMatches,
  initialNotificationsEnabled,
  notificationHistory,
  lastDigestAt
}: {
  user: AppUser;
  initialProfile: UserProfile | null;
  initialMatches: Scheme[];
  initialNotificationsEnabled: boolean;
  notificationHistory: NotificationHistoryItem[];
  lastDigestAt: string | null;
}) {
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [profile, setProfile] = useState<UserProfile>(initialProfile ?? defaultProfile);
  const [matches, setMatches] = useState<Scheme[]>(initialMatches);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    initialNotificationsEnabled
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const updateField = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, phone, profile, notificationsEnabled })
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error || "Unable to save profile.");
      return;
    }

    setMatches(data.matchedSchemes ?? []);
    setMessage("Profile saved. Daily alerts will use this information.");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={save} className="panel p-7">
        <h2 className="text-2xl font-semibold text-stone-900">Your alert profile</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Save your contact details and eligibility profile so LabhSetu can
          re-check your matches every day and email you when something relevant appears.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" value={fullName} onChange={setFullName} />
          <Field label="Phone number" value={phone} onChange={setPhone} />
          <Field label="Age" value={profile.age} onChange={(value) => updateField("age", value)} />
          <SelectField
            label="Gender"
            value={profile.gender}
            onChange={(value) => updateField("gender", value)}
            options={["Male", "Female", "Other"]}
          />
          <SelectField
            label="State"
            value={profile.state}
            onChange={(value) => updateField("state", value)}
            options={states}
          />
          <SelectField
            label="Social category"
            value={profile.category}
            onChange={(value) => updateField("category", value)}
            options={["General", "OBC", "SC", "ST", "EWS", "Minority"]}
          />
          <SelectField
            label="Annual income"
            value={profile.income}
            onChange={(value) => updateField("income", value)}
            options={[
              "Below ₹1 lakh",
              "₹1-2.5 lakh",
              "₹2.5-5 lakh",
              "₹5-8 lakh",
              "Above ₹8 lakh"
            ]}
          />
          <SelectField
            label="Occupation"
            value={profile.occupation}
            onChange={(value) => updateField("occupation", value)}
            options={occupations}
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
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

        <label className="mt-6 flex items-center gap-3 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(event) => setNotificationsEnabled(event.target.checked)}
          />
          Email me daily when my profile matches new schemes
        </label>

        {message ? (
          <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
            {message}
          </div>
        ) : null}

        <Button type="submit" className="mt-6">
          {loading ? "Saving..." : "Save profile"}
        </Button>
      </form>

      <div className="space-y-6">
        <div className="panel p-7">
          <h2 className="text-2xl font-semibold text-stone-900">Current matches</h2>
          <p className="mt-2 text-sm text-stone-600">
            These are the schemes your saved profile currently matches.
          </p>
          <div className="mt-5 space-y-3">
            {matches.length === 0 ? (
              <p className="text-sm text-stone-500">Save a full profile to see daily-match results.</p>
            ) : (
              matches.slice(0, 8).map((scheme) => (
                <div key={scheme.slug} className="rounded-2xl bg-stone-50 px-4 py-4">
                  <p className="text-sm font-medium text-stone-900">{scheme.name}</p>
                  <p className="mt-1 text-xs text-stone-500">
                    {scheme.type} · {scheme.category}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel p-7">
          <h2 className="text-2xl font-semibold text-stone-900">Notification history</h2>
          <p className="mt-2 text-sm text-stone-600">
            Latest emails sent when your match set changed.
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-stone-400">
            Last digest run for you: {lastDigestAt ? new Date(lastDigestAt).toLocaleString("en-IN") : "Not sent yet"}
          </p>
          <div className="mt-5 space-y-3">
            {notificationHistory.length === 0 ? (
              <p className="text-sm text-stone-500">
                No notifications sent yet. Once daily matching finds new eligible schemes, they will appear here.
              </p>
            ) : (
              notificationHistory.map((item) => (
                <div key={item.id} className="rounded-2xl bg-stone-50 px-4 py-4">
                  <p className="text-sm font-medium text-stone-900">{item.subject}</p>
                  <p className="mt-1 text-xs text-stone-500">
                    {new Date(item.sentAt).toLocaleString("en-IN")}
                  </p>
                  <p className="mt-2 text-sm text-stone-600">
                    {item.schemeNames.slice(0, 4).join(", ")}
                    {item.schemeNames.length > 4 ? ` +${item.schemeNames.length - 4} more` : ""}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm text-stone-600">
      <span className="mb-2 block">{label}</span>
      <input
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 outline-none transition focus:border-saffron-400"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block text-sm text-stone-600">
      <span className="mb-2 block">{label}</span>
      <select
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 outline-none transition focus:border-saffron-400"
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
