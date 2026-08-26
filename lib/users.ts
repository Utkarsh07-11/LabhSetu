import { nanoid } from "nanoid";
import { getMongoDb } from "@/lib/mongodb";
import type { NotificationHistoryItem, StoredUser, UserProfile } from "@/types";

function toPlainUser(document: StoredUser | (StoredUser & { _id?: unknown })) {
  const plain = JSON.parse(JSON.stringify(document)) as StoredUser & {
    _id?: unknown;
  };
  delete plain._id;
  return plain;
}

export async function ensureUserIndexes() {
  const db = await getMongoDb();
  if (!db) {
    return;
  }

  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("users").createIndex({ id: 1 }, { unique: true });
}

export async function createUser(input: {
  email: string;
  fullName: string;
  phone: string;
  passwordHash: string;
}) {
  const db = await getMongoDb();
  if (!db) {
    throw new Error("MongoDB is not configured.");
  }

  await ensureUserIndexes();

  const now = new Date().toISOString();
  const user: StoredUser = {
    id: nanoid(12),
    email: input.email.toLowerCase(),
    fullName: input.fullName,
    phone: input.phone,
    passwordHash: input.passwordHash,
    createdAt: now,
    lastLoginAt: now,
    profile: null,
    notificationsEnabled: true,
    lastEligibilityDigestAt: null,
    lastNotifiedSchemeSlugs: []
  };

  await db.collection("users").insertOne(user);
  return user;
}

export async function findUserByEmail(email: string) {
  const db = await getMongoDb();
  if (!db) {
    return null;
  }

  const user = (await db
    .collection("users")
    .findOne({ email: email.toLowerCase() })) as StoredUser | null;

  return user ? toPlainUser(user) : null;
}

export async function updateUserLogin(userId: string) {
  const db = await getMongoDb();
  if (!db) {
    return;
  }

  await db.collection("users").updateOne(
    { id: userId },
    {
      $set: {
        lastLoginAt: new Date().toISOString()
      }
    }
  );
}

export async function updateUserProfile(
  userId: string,
  input: {
    fullName: string;
    phone: string;
    profile: UserProfile;
    notificationsEnabled: boolean;
  }
) {
  const db = await getMongoDb();
  if (!db) {
    throw new Error("MongoDB is not configured.");
  }

  await db.collection("users").updateOne(
    { id: userId },
    {
      $set: {
        fullName: input.fullName,
        phone: input.phone,
        profile: input.profile,
        notificationsEnabled: input.notificationsEnabled,
        updatedAt: new Date().toISOString()
      }
    }
  );
}

export async function listUsersWithProfiles() {
  const db = await getMongoDb();
  if (!db) {
    return [];
  }

  const users = (await db
    .collection("users")
    .find({
      profile: { $ne: null },
      notificationsEnabled: { $ne: false }
    })
    .toArray()) as unknown as StoredUser[];

  return users.map(toPlainUser);
}

export async function markUserDigest(userId: string, schemeSlugs: string[]) {
  const db = await getMongoDb();
  if (!db) {
    return;
  }

  await db.collection("users").updateOne(
    { id: userId },
    {
      $set: {
        lastEligibilityDigestAt: new Date().toISOString(),
        lastNotifiedSchemeSlugs: schemeSlugs
      }
    }
  );
}

export async function addNotificationHistory(
  item: Omit<NotificationHistoryItem, "id"> & { id?: string }
) {
  const db = await getMongoDb();
  if (!db) {
    return;
  }

  await db.collection("notification_history").insertOne({
    ...item,
    id: item.id ?? nanoid(14)
  });
}

export async function getNotificationHistoryForUser(userId: string) {
  const db = await getMongoDb();
  if (!db) {
    return [];
  }

  const items = (await db
    .collection("notification_history")
    .find({ userId })
    .sort({ sentAt: -1 })
    .limit(10)
    .toArray()) as unknown as NotificationHistoryItem[];

  return items.map((item) => {
    const plain = JSON.parse(JSON.stringify(item)) as NotificationHistoryItem & {
      _id?: unknown;
    };
    delete plain._id;
    return plain;
  });
}
