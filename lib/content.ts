import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ConceptFile, ConceptFrontmatter } from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function unitDir(subject: string, unitSlug: string) {
  return path.join(CONTENT_ROOT, subject, unitSlug);
}

export function listConcepts(subject: string, unitSlug: string): ConceptFile[] {
  const dir = unitDir(subject, unitSlug);
  if (!fs.existsSync(dir)) return [];
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"));
  return files
    .map((f) => readConceptFile(subject, unitSlug, f.replace(/\.mdx$/, "")))
    .filter((c): c is ConceptFile => c !== null)
    .sort((a, b) => a.order - b.order);
}

export function getConcept(
  subject: string,
  unitSlug: string,
  conceptSlug: string,
): ConceptFile | null {
  return readConceptFile(subject, unitSlug, conceptSlug);
}

function readConceptFile(
  subject: string,
  unitSlug: string,
  conceptSlug: string,
): ConceptFile | null {
  const filePath = path.join(unitDir(subject, unitSlug), `${conceptSlug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as ConceptFrontmatter;
  return {
    ...fm,
    slug: fm.slug ?? conceptSlug,
    body: content,
    unit: unitSlug,
    subject,
  };
}
