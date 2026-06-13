#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const legacyDir = "legacy/2025-content";
const ignoredDirs = new Set([".git", ".hugo-build", "node_modules", "public"]);
const courseDirPattern = /^20\d{2}-\d{2}$/;

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function walk(dir = ".") {
  const out = [];
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const rel = dir === "." ? entry.name : `${dir}/${entry.name}`;
    if (entry.isDirectory()) out.push(...walk(rel));
    else out.push(rel);
  }
  return out;
}

const files = walk();
const fileSet = new Set(files.map(toPosix));
const markdownFiles = files.filter((file) => file.endsWith(".md")).map(toPosix);
const courseDirs = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && courseDirPattern.test(entry.name))
  .map((entry) => entry.name);

const virtualFiles = new Set();
if (fs.existsSync(path.join(root, legacyDir))) {
  for (const file of fs.readdirSync(path.join(root, legacyDir))) {
    if (!file.endsWith(".md")) continue;
    virtualFiles.add(file);
    for (const course of courseDirs) virtualFiles.add(`${course}/${file}`);
  }
}

function shouldCheckSource(source) {
  return !(
    source.startsWith(`${legacyDir}/`) ||
    source.startsWith("live-sessions/") ||
    source.startsWith("prompts/")
  );
}

function stripUrl(url) {
  return url
    .trim()
    .replace(/^<|>$/g, "")
    .split("#")[0]
    .split("?")[0];
}

function isExamplePlaceholder(url) {
  const clean = stripUrl(url).replace(/^\.?\//, "");
  return (
    clean === "image.png" ||
    clean === "image.jpg" ||
    clean === "background.jpg" ||
    clean === "left.jpg" ||
    clean === "right.jpg" ||
    clean === "style.css" ||
    clean === "url" ||
    clean === "example.com" ||
    clean.startsWith("downloads/")
  );
}

function isExternal(url) {
  return /^(https?:|mailto:|data:|javascript:|tel:)/i.test(url);
}

function candidatePaths(target) {
  const clean = target.replace(/^\/+/, "").replace(/\/+$/, "");
  if (!clean) return [""];

  const ext = path.posix.extname(clean);
  const candidates = [clean];
  if (!ext) candidates.push(`${clean}.md`);
  candidates.push(`${clean}/README.md`);
  candidates.push(`${clean}/index.html`);
  return candidates;
}

function existsTarget(target) {
  return candidatePaths(target).some((candidate) => {
    if (!candidate) return true;
    return fileSet.has(candidate) || virtualFiles.has(candidate);
  });
}

function resolveTarget(source, url) {
  if (url.startsWith("/")) return url.slice(1);

  const baseDir = source.startsWith(`${legacyDir}/`) ? "." : path.posix.dirname(source);
  return path.posix.normalize(path.posix.join(baseDir, url));
}

function extractLinks(markdown) {
  markdown = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~/g, "");

  const links = [];
  const patterns = [
    /!?\[[^\]]*]\(\s*([^)\s]+)(?:\s+["'][^)]*["'])?\s*\)/g,
    /^\s*\[[^\]]+]:\s*(\S+)/gm,
    /\b(?:href|src)=["']([^"']+)["']/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(markdown))) links.push(match[1]);
  }
  return links;
}

const failures = [];
for (const source of markdownFiles) {
  if (!shouldCheckSource(source)) continue;

  const markdown = fs.readFileSync(path.join(root, source), "utf8");
  for (const rawUrl of extractLinks(markdown)) {
    const url = stripUrl(rawUrl);
    if (!url || url.startsWith("#") || isExternal(url) || isExamplePlaceholder(url)) continue;

    const target = resolveTarget(source, url);
    if (!existsTarget(target)) {
      failures.push({ source, rawUrl, target });
    }
  }
}

if (failures.length) {
  console.error(`Broken local links: ${failures.length}`);
  for (const failure of failures) {
    console.error(`${failure.source}: ${failure.rawUrl} -> ${failure.target}`);
  }
  process.exit(1);
}

console.log(`Checked ${markdownFiles.length} markdown files. No broken local links found.`);
