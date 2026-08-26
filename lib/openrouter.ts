import { matchSchemesLocally } from "@/lib/match-schemes";
import { slugify } from "@/lib/utils";
import type { Scheme, UserProfile } from "@/types";

const OPENROUTER_URL = process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1/chat/completions";

function extractJsonArray(raw: string) {
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) {
    throw new Error("Model response did not include a JSON array.");
  }

  return JSON.parse(match[0]) as Scheme[];
}

function normalizeSchemes(items: Scheme[]): Scheme[] {
  return items.map((item, index) => ({
    ...item,
    id: item.id || slugify(item.name || `scheme-${index + 1}`),
    slug: item.slug || slugify(item.name || `scheme-${index + 1}`),
    documents: Array.isArray(item.documents) ? item.documents : [],
    ministry: item.ministry || "Government of India",
    category: item.category || "Other",
    type: item.type || "Central"
  }));
}

export async function findSchemesWithAI(
  profile: UserProfile,
  availableSchemes: Scheme[]
) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;

  if (!apiKey || !model) {
    return {
      source: "local" as const,
      schemes: matchSchemesLocally(profile, availableSchemes)
    };
  }

  const prompt = `
You are an expert on Indian government welfare schemes.
Return only valid JSON as an array with 8 to 14 currently relevant schemes.

User profile:
- Age: ${profile.age}
- Gender: ${profile.gender}
- State: ${profile.state}
- Annual income: ${profile.income}
- Occupation: ${profile.occupation}
- Social category: ${profile.category}
- Additional tags: ${profile.extras.join(", ") || "None"}

Reference scheme catalog for grounding:
${JSON.stringify(availableSchemes)}

Rules:
- Mix central schemes with schemes specific to the user's state where applicable.
- Only include real official schemes or extremely likely matches from the reference data.
- Use official looking government application URLs when available.
- Respond with objects shaped as:
{
  "id": "slug",
  "slug": "slug",
  "name": "Scheme name",
  "ministry": "Ministry or department",
  "type": "Central" | "State" | "Subsidy",
  "state": "State name or null",
  "category": "Health" | "Financial" | "Housing" | "Education" | "Agriculture" | "Women" | "Insurance" | "Livelihood" | "Other",
  "benefit": "Clear summary",
  "annualBenefit": "₹X/year or null",
  "howToApply": "Plain-language steps",
  "documents": ["Doc 1", "Doc 2"],
  "applyUrl": "https://...",
  "deadline": "Ongoing or month/year",
  "overview": "1-2 sentence detail",
  "eligibility": ["point 1", "point 2"],
  "tags": ["tag 1", "tag 2"]
}
`;

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "LabhSetu"
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You match Indian citizens to government schemes and reply with strict JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter request failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;

  if (typeof text !== "string") {
    throw new Error("OpenRouter response was missing text content.");
  }

  return {
    source: "openrouter" as const,
    schemes: normalizeSchemes(extractJsonArray(text))
  };
}
