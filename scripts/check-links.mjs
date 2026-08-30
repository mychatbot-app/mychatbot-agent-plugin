import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const markdownFiles = [
  "README.md",
  "SECURITY.md",
  "claude/SETUP.md",
  ...fs.readdirSync(path.join(root, "docs"))
    .filter((name) => name.endsWith(".md"))
    .map((name) => `docs/${name}`),
];
const external = new Set();

for (const relative of markdownFiles) {
  const body = fs.readFileSync(path.join(root, relative), "utf8");
  for (const match of body.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].trim().replace(/^<|>$/g, "");
    if (/^https:\/\//.test(target)) {
      external.add(target);
      continue;
    }
    if (/^(?:mailto:|#)/.test(target)) continue;
    const localTarget = target.split("#", 1)[0];
    if (!localTarget) continue;
    const absolute = path.resolve(path.dirname(path.join(root, relative)), localTarget);
    if (!absolute.startsWith(`${root}${path.sep}`) || !fs.existsSync(absolute)) {
      throw new Error(`${relative} has a broken local link: ${target}`);
    }
  }
}

for (const manifest of ["claude/.claude-plugin/plugin.json", "codex/.codex-plugin/plugin.json"]) {
  const data = JSON.parse(fs.readFileSync(path.join(root, manifest), "utf8"));
  for (const key of ["homepage", "repository"]) external.add(data[key]);
  for (const key of ["websiteURL", "privacyPolicyURL", "termsOfServiceURL"]) {
    if (data.interface?.[key]) external.add(data.interface[key]);
  }
}

const failures = [];
for (const url of [...external].sort()) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
      headers: { "user-agent": "mychatbot-agent-plugin-link-check" },
    });
    if (!response.ok) failures.push(`${response.status} ${url}`);
  } catch (error) {
    failures.push(`${url}: ${error.message}`);
  }
}
if (failures.length) throw new Error(`broken public links:\n${failures.join("\n")}`);
console.log(`Validated ${markdownFiles.length} Markdown files and ${external.size} public URLs.`);
