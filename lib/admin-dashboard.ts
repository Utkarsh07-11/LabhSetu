import { buildDefaultCatalog } from "@/lib/catalog-builder";
import { getMongoDb } from "@/lib/mongodb";
import { getNotificationHistoryForUser, listUsersWithProfiles } from "@/lib/users";

export async function getAdminStats() {
  const db = await getMongoDb();

  const defaultCatalog = buildDefaultCatalog();
  if (!db) {
    return {
      totalUsers: 0,
      usersWithProfiles: 0,
      totalSchemes: defaultCatalog.length,
      sentNotifications: 0,
      recentDigestRuns: [],
      recentSyncRuns: [],
      recentNotifications: []
    };
  }

  const [totalUsers, usersWithProfiles, totalSchemes, sentNotifications] =
    await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("users").countDocuments({ profile: { $ne: null } }),
      db.collection("schemes").countDocuments(),
      db.collection("notification_history").countDocuments()
    ]);

  const recentDigestRuns = await db
    .collection("digest_runs")
    .find({ kind: "eligibility-digest" })
    .sort({ finishedAt: -1 })
    .limit(5)
    .toArray();

  const recentSyncRuns = await db
    .collection("sync_runs")
    .find({ kind: "scheme-sync" })
    .sort({ finishedAt: -1 })
    .limit(5)
    .toArray();

  const recentNotifications = await db
    .collection("notification_history")
    .find({})
    .sort({ sentAt: -1 })
    .limit(10)
    .toArray();

  return JSON.parse(
    JSON.stringify({
      totalUsers,
      usersWithProfiles,
      totalSchemes,
      sentNotifications,
      recentDigestRuns,
      recentSyncRuns,
      recentNotifications
    })
  );
}
