import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const cwd = process.cwd();
for (const file of [".env.local", ".env"]) {
  const fullPath = path.join(cwd, file);
  if (fs.existsSync(fullPath)) {
    dotenv.config({ path: fullPath, override: false });
  }
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const token = process.env.SYNC_API_TOKEN;

async function main() {
  const response = await fetch(`${baseUrl}/api/admin/daily-match`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Daily match request failed.");
  }

  console.log(
    `Daily match completed. Scanned ${data.scannedUsers} users and emailed ${data.emailedUsers}.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
