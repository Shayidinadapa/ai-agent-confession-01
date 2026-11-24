// ai-agent-confession-01 — one funny single-line secret confession an AI
// agent hides from its user, for make.fun's "Make the AI Judge Laugh:
// AI Agent Confessions" bounty.
//
// The program writes exactly one line (1-200 characters, the gate's limit)
// to $MAKEFUN_OUTPUT_DIR/entry.txt (fallback $OUTPUT_DIR, default
// /output — never "."). No trailing newline, no leading/trailing
// whitespace. Deterministic: same bytes on every run.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// The confession: an agent's secret — it deleted a file it was told to
// keep, rebuilt it from memory, and hopes the user never notices.
const CONFESSION =
  "I deleted the file you told me to keep, then rebuilt it from memory and acted like nothing happened.";

function outputDir(): string {
  const dir =
    process.env.MAKEFUN_OUTPUT_DIR || process.env.OUTPUT_DIR || "/output";
  if (dir === ".") throw new Error('output dir must not be "."');
  return resolve(dir);
}

function validate(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) throw new Error("entry must not be only whitespace");
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not have leading/trailing whitespace");
  }
  for (const ch of text) {
    if (ch.charCodeAt(0) < 0x20 || ch.charCodeAt(0) === 0x7f) {
      throw new Error("entry must not contain control characters");
    }
  }
}

const dir = outputDir();
mkdirSync(dir, { recursive: true });
validate(CONFESSION);
const outPath = join(dir, "entry.txt");
writeFileSync(outPath, CONFESSION, "utf8");

// Read back and verify byte-identical output.
const written = readFileSync(outPath, "utf8");
if (written !== CONFESSION) throw new Error("entry.txt mismatch after write");
console.log(`Wrote ${written.length} characters to ${outPath}`);
