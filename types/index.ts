export type SchemeType = "Central" | "State" | "Subsidy";

export type SchemeCategory =
  | "Health"
  | "Financial"
  | "Housing"
  | "Education"
  | "Agriculture"
  | "Women"
  | "Insurance"
  | "Livelihood"
  | "Other";

export interface UserProfile {
  age: string;
  gender: string;
  state: string;
  income: string;
  occupation: string;
  category: string;
  extras: string[];
}

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  createdAt: string;
  lastLoginAt?: string | null;
}

export interface StoredUser extends AppUser {
  passwordHash: string;
  profile?: UserProfile | null;
  notificationsEnabled?: boolean;
  lastEligibilityDigestAt?: string | null;
  lastNotifiedSchemeSlugs?: string[];
}

export interface NotificationHistoryItem {
  id: string;
  userId: string;
  email: string;
  schemeSlugs: string[];
  schemeNames: string[];
  sentAt: string;
  subject: string;
}

export interface Scheme {
  id: string;
  name: string;
  slug: string;
  ministry: string;
  type: SchemeType;
  state?: string | null;
  category: SchemeCategory;
  benefit: string;
  annualBenefit?: string | null;
  howToApply: string;
  documents: string[];
  applyUrl?: string | null;
  deadline?: string | null;
  overview?: string;
  eligibility?: string[];
  tags?: string[];
  sourceUrl?: string | null;
  sourceLabel?: string | null;
  ingestionSource?: string | null;
  lastSyncedAt?: string | null;
}

export interface SavedResult {
  shareId: string;
  profile: UserProfile;
  schemes: Scheme[];
  totalSchemes: number;
  createdAt: string;
}
