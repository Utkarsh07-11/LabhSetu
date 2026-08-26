import { redirect } from "next/navigation";
import { ProfileManager } from "@/components/dashboard/profile-manager";
import { SiteShell } from "@/components/layout/site-shell";
import { StatCard } from "@/components/shared/stat-card";
import { sanitizeUser } from "@/lib/auth";
import { ensureDailyEligibilityDigest } from "@/lib/eligibility-digest";
import { listSchemes } from "@/lib/schemes-store";
import { matchSchemesLocally } from "@/lib/match-schemes";
import { getCurrentUserRecord } from "@/lib/auth";
import { getNotificationHistoryForUser } from "@/lib/users";

export default async function DashboardPage() {
  const user = await getCurrentUserRecord();
  if (!user) {
    redirect("/login");
  }

  void ensureDailyEligibilityDigest().catch((error) => {
    console.error("daily eligibility digest failed", error);
  });

  const schemes = user.profile ? matchSchemesLocally(user.profile, await listSchemes()) : [];
  const history = await getNotificationHistoryForUser(user.id);

  return (
    <SiteShell>
      <section className="container-shell py-12 sm:py-16">
        <p className="text-sm uppercase tracking-[0.2em] text-stone-400">
          Dashboard
        </p>
        <h1 className="mt-3 font-serif text-5xl text-stone-900">
          Welcome back, {user.fullName}
        </h1>
        <p className="mt-4 text-base leading-7 text-stone-600">
          Save your profile once and LabhSetu will re-check your eligibility
          every day, then email you when fresh scheme matches appear.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <StatCard value={String(schemes.length)} label="eligible schemes from your saved profile" />
          <StatCard
            value={String(history.length)}
            label="recent notification emails logged in your account"
          />
          <StatCard
            value={user.lastEligibilityDigestAt ? "Active" : "Pending"}
            label="daily alert status for your saved profile"
          />
        </div>

        <div className="mt-10">
          <ProfileManager
            user={sanitizeUser(user)}
            initialProfile={user.profile ?? null}
            initialMatches={schemes}
            initialNotificationsEnabled={user.notificationsEnabled ?? true}
            notificationHistory={history}
            lastDigestAt={user.lastEligibilityDigestAt ?? null}
          />
        </div>
      </section>
    </SiteShell>
  );
}
