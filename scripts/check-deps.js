const fs = require("fs");
const path = require("path");

const root = process.cwd();
const lockfilePath = path.join(root, "package-lock.json");
const packagePath = path.join(root, "package.json");

const blockedAxiosVersions = new Set(["1.14.1", "0.30.4"]);
const blockedPackages = new Set(["plain-crypto-js"]);
const findings = [];

function record(message) {
  findings.push(message);
}

function inspectObject(node, trail = []) {
  if (!node || typeof node !== "object") {
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key === "axios" && typeof value === "string" && blockedAxiosVersions.has(value)) {
      record(`Blocked axios version detected at ${trail.join(".") || "root"}: ${value}`);
    }

    if (blockedPackages.has(key)) {
      record(`Blocked package detected at ${trail.join(".") || "root"}: ${key}`);
    }

    if (key === "name" && typeof value === "string" && blockedPackages.has(value)) {
      record(`Blocked package detected at ${trail.join(".") || "root"}: ${value}`);
    }

    if (
      key === "version" &&
      typeof value === "string" &&
      trail[trail.length - 1] === "axios" &&
      blockedAxiosVersions.has(value)
    ) {
      record(`Blocked axios version detected at ${trail.join(".")}: ${value}`);
    }

    inspectObject(value, [...trail, key]);
  }
}

function main() {
  const files = [packagePath, lockfilePath].filter((file) => fs.existsSync(file));

  if (files.length === 0) {
    console.log("No package manifests found.");
    process.exit(0);
  }

  for (const file of files) {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    inspectObject(parsed, [path.basename(file)]);
  }

  if (findings.length > 0) {
    console.error("Dependency security check failed:");
    for (const finding of findings) {
      console.error(`- ${finding}`);
    }
    process.exit(1);
  }

  console.log(
    "Dependency security check passed. No blocked axios versions or plain-crypto-js package found."
  );
}

main();
