import type { Scheme, UserProfile } from "@/types";

function hasExtra(profile: UserProfile, value: string) {
  return profile.extras.includes(value);
}

function includesAny(text: string, patterns: string[]) {
  const lowered = text.toLowerCase();
  return patterns.some((pattern) => lowered.includes(pattern));
}

export function matchSchemesLocally(
  profile: UserProfile,
  schemes: Scheme[]
): Scheme[] {
  return schemes.filter((scheme) => {
    const occupation = profile.occupation.toLowerCase();
    const category = profile.category.toLowerCase();

    if (scheme.type === "State" && scheme.state && scheme.state !== profile.state) {
      return false;
    }

    if (scheme.slug === "pm-kisan") {
      return includesAny(occupation, ["farmer", "agricultural"]);
    }

    if (scheme.slug === "national-scholarship-portal") {
      return includesAny(occupation, ["student"]);
    }

    if (scheme.slug === "maji-ladki-bahin") {
      return profile.gender === "Female" && profile.state === "Maharashtra";
    }

    if (scheme.slug === "pmay-urban") {
      return hasExtra(profile, "home_buyer") || includesAny(occupation, ["salaried", "self-employed"]);
    }

    if (scheme.slug === "pm-svanidhi") {
      return includesAny(occupation, ["daily wage", "self-employed", "business"]);
    }

    if (scheme.slug === "atal-pension-yojana") {
      const age = Number(profile.age);
      return Number.isFinite(age) && age >= 18 && age <= 40;
    }

    if (scheme.slug === "ayushman-bharat" || scheme.slug === "mahatma-jyotiba-phule-jan-arogya") {
      return hasExtra(profile, "bpl") || includesAny(category, ["sc", "st", "obc", "ews"]);
    }

    return true;
  });
}
