import { redirect } from "next/navigation";
import { AdminDashboardActions } from "@/components/admin/admin-dashboard-actions";
import { SiteShell } from "@/components/layout/site-shell";
import { StatCard } from "@/components/shared/stat-card";
import { getCurrentAdmin } from "@/lib/auth";
import { getAdminStats } from "@/lib/admin-dashboard";

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const stats = await getAdminStats();

  return (
    <SiteShell>
      <section className="container-shell py-12 sm:py-16">
        <p className="text-sm uppercase tracking-[0.2em] text-stone-400">
          Admin Dashboard
        </p>
        <h1 className="mt-3 font-serif text-5xl text-stone-900">
          Welcome, {admin.username}
        </h1>
        <p className="mt-4 text-base leading-7 text-stone-600">
          Manage daily matching, catalog sync, and recent alert activity from one place.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <StatCard value={String(stats.totalUsers)} label="total registered users" />
          <StatCard
            value={String(stats.usersWithProfiles)}
            label="users with saved eligibility profiles"
          />
          <StatCard value={String(stats.totalSchemes)} label="catalog records available" />
          <StatCard
            value={String(stats.sentNotifications)}
            label="notification emails sent in total"
          />
        </div>

        <div className="mt-10">
          <AdminDashboardActions />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="panel p-6">
            <h2 className="text-xl font-semibold text-stone-900">Recent sync runs</h2>
            <div className="mt-4 space-y-3">
              {stats.recentSyncRuns.length === 0 ? (
                <p className="text-sm text-stone-500">No sync runs yet.</p>
              ) : (
                stats.recentSyncRuns.map((run: { finishedAt: string; schemeCount?: number }) => (
                  <div key={run.finishedAt} className="rounded-2xl bg-stone-50 px-4 py-4 text-sm text-stone-700">
                    <p>{new Date(run.finishedAt).toLocaleString("en-IN")}</p>
                    <p className="mt-1 text-xs text-stone-500">
                      {run.schemeCount ?? 0} records processed
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="text-xl font-semibold text-stone-900">Recent digest runs</h2>
            <div className="mt-4 space-y-3">
              {stats.recentDigestRuns.length === 0 ? (
                <p className="text-sm text-stone-500">No digest runs yet.</p>
              ) : (
                stats.recentDigestRuns.map(
                  (run: {
                    finishedAt: string;
                    scannedUsers?: number;
                    emailedUsers?: number;
                  }) => (
                    <div key={run.finishedAt} className="rounded-2xl bg-stone-50 px-4 py-4 text-sm text-stone-700">
                      <p>{new Date(run.finishedAt).toLocaleString("en-IN")}</p>
                      <p className="mt-1 text-xs text-stone-500">
                        scanned {run.scannedUsers ?? 0}, emailed {run.emailedUsers ?? 0}
                      </p>
                    </div>
                  )
                )
              )}
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="text-xl font-semibold text-stone-900">Recent notifications</h2>
            <div className="mt-4 space-y-3">
              {stats.recentNotifications.length === 0 ? (
                <p className="text-sm text-stone-500">No notifications sent yet.</p>
              ) : (
                stats.recentNotifications.map(
                  (item: { id: string; email: string; sentAt: string; schemeNames?: string[] }) => (
                    <div key={item.id} className="rounded-2xl bg-stone-50 px-4 py-4 text-sm text-stone-700">
                      <p>{item.email}</p>
                      <p className="mt-1 text-xs text-stone-500">
                        {new Date(item.sentAt).toLocaleString("en-IN")}
                      </p>
                      <p className="mt-2 text-xs text-stone-500">
                        {(item.schemeNames ?? []).slice(0, 2).join(", ")}
                      </p>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
