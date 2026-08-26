import { listSchemes } from "@/lib/schemes-store";
import { matchSchemesLocally } from "@/lib/match-schemes";
import { getMongoDb } from "@/lib/mongodb";
import { getResendClient } from "@/lib/resend";
import {
  addNotificationHistory,
  listUsersWithProfiles,
  markUserDigest
} from "@/lib/users";
import type { Scheme } from "@/types";

const DAY_IN_MS = 24 * 60 * 60 * 1000;
let runningDigestPromise: Promise<{ scannedUsers: number; emailedUsers: number } | null> | null =
  null;

function buildDigestSubject(fullName: string) {
  return `New LabhSetu matches for ${fullName}`;
}

function buildDigestHtml(fullName: string, schemes: Scheme[]) {
  const items = schemes
    .slice(0, 8)
    .map(
      (scheme) =>
        `<li style="margin-bottom:12px;"><strong>${scheme.name}</strong><br/>${scheme.benefit}<br/><a href="${scheme.applyUrl ?? "#"}">Official link</a></li>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;">
      <h1 style="font-size:28px;margin-bottom:12px;">New schemes for ${fullName}</h1>
      <p style="font-size:16px;line-height:1.6;">We re-checked your saved profile and found schemes that may match your eligibility.</p>
      <ul style="padding-left:20px;">${items}</ul>
      <p style="font-size:14px;color:#666;">Visit your dashboard to review your saved profile and latest matches.</p>
    </div>
  `;
}

export async function runDailyEligibilityDigest() {
  const resend = getResendClient();
  if (!resend) {
    return { scannedUsers: 0, emailedUsers: 0 };
  }

  const schemes = await listSchemes();
  const users = await listUsersWithProfiles();

  let emailedUsers = 0;

  for (const user of users) {
    if (!user.profile) {
      continue;
    }

    const matched = matchSchemesLocally(user.profile, schemes);
    const schemeSlugs = matched.map((scheme) => scheme.slug).sort();
    const previous = [...(user.lastNotifiedSchemeSlugs ?? [])].sort();
    const hasChanged = JSON.stringify(previous) !== JSON.stringify(schemeSlugs);

    if (!hasChanged || schemeSlugs.length === 0) {
      continue;
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "LabhSetu <onboarding@resend.dev>",
      to: user.email,
      subject: buildDigestSubject(user.fullName),
      html: buildDigestHtml(user.fullName, matched)
    });

    await markUserDigest(user.id, schemeSlugs);
    await addNotificationHistory({
      userId: user.id,
      email: user.email,
      schemeSlugs,
      schemeNames: matched.map((scheme) => scheme.name),
      sentAt: new Date().toISOString(),
      subject: buildDigestSubject(user.fullName)
    });
    emailedUsers += 1;
  }

  const db = await getMongoDb();
  if (db) {
    await db.collection("digest_runs").insertOne({
      kind: "eligibility-digest",
      scannedUsers: users.length,
      emailedUsers,
      finishedAt: new Date().toISOString()
    });
  }

  return { scannedUsers: users.length, emailedUsers };
}

export async function ensureDailyEligibilityDigest() {
  const db = await getMongoDb();
  if (!db) {
    return null;
  }

  const lastRun = await db
    .collection("digest_runs")
    .find({ kind: "eligibility-digest" })
    .sort({ finishedAt: -1 })
    .limit(1)
    .next();

  const lastFinishedAt = lastRun?.finishedAt
    ? new Date(String(lastRun.finishedAt)).getTime()
    : 0;
  const shouldRun = !lastFinishedAt || Date.now() - lastFinishedAt >= DAY_IN_MS;

  if (!shouldRun) {
    return null;
  }

  if (!runningDigestPromise) {
    runningDigestPromise = runDailyEligibilityDigest().finally(() => {
      runningDigestPromise = null;
    });
  }

  return runningDigestPromise;
}
