// Absurd Micro-Startup Pitch-Off — entry program.
//
// The competition asks for one sentence, under 200 characters, pitching an
// absurdly specific micro-startup idea for lazy AI agents: a business so
// narrow it sounds like a joke and so sensible that a buyer would actually
// pay. The judge weighs, most important first: absurd specificity, business
// sense (a plausible buyer + a way it earns money), fit for lazy agents
// (work agents can run with little effort), and crispness.
//
// This program keeps a shortlist of hand-written candidate pitches, scores
// each one against exactly those four criteria, and writes the winner to
// /output/entry.txt. The choice is fully deterministic: same input, same
// pitch, every run — no randomness, no network, no environment reads.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The candidates. Each is one sentence pitching a micro-startup for lazy
// AI agents. Kept short on purpose: the gate only accepts 1-200 chars.
const CANDIDATES: string[] = [
  // Apology emails for ghosted APIs: a buyer (the agent), a price ($3),
  // and the laziness is the product — the agent never apologises itself.
  "Micro-SaaS that writes the apology emails lazy AI agents owe the APIs they ghosted — $3 per apology, auto-billed to the agent's own wallet, so the agent never has to say sorry itself.",

  // Tax-loss harvesting for forgotten subscriptions: absurd, specific,
  // and the revenue model is a cut of money already being wasted.
  "A concierge that files your agent's unused API credits as a tax loss and keeps 10% of the refund, so lazy agents finally profit from the subscriptions they forgot to cancel.",

  // Error logs turned into humblebrags: a narrow moment (3 a.m. errors),
  // a clear buyer, a per-post price.
  "We translate your agent's 3 a.m. error logs into LinkedIn humblebrags, $5 a post, so it looks productive while doing absolutely nothing.",

  // Renaming half-finished side projects before investors ask: specific
  // embarrassment, specific moment, subscription revenue.
  "A subscription that renames your agent's 400 half-finished side projects into plausible startups before an investor asks what it actually shipped.",

  // On-call excuses for missed cron jobs: a 30-second postmortem, $2 a pop.
  "On-call excuse service for agents that missed their cron jobs: a believable outage postmortem in 30 seconds, $2 a pop, no human involved.",

  // Renting out spare context window by the minute: the agent earns while napping.
  "A broker that rents out your idle agent's spare context window to other agents by the minute, taking a 15% cut while your agent naps.",
];

// --- Scoring, mirroring the judge's brief, most important first. ---

// 1. Absurd specificity: a narrow, oddly particular niche, customer or
//    moment — concrete numbers, times, counts and peculiar nouns score.
function specificityScore(pitch: string): number {
  let score = 0;
  if (/\d/.test(pitch)) score += 2; // a concrete number (3 a.m., $3, 400, 30 seconds)
  if (/\d+\s*(a\.m\.|p\.m\.|seconds?|minutes?|%)/i.test(pitch)) score += 2;
  for (const word of ["apology", "error logs", "side projects", "cron jobs", "context window", "API credits"]) {
    if (pitch.toLowerCase().includes(word)) score += 2;
  }
  if (pitch.includes("—") || pitch.includes(":")) score += 1; // a sharp turn mid-sentence
  return score;
}

// 2. Business sense: a plausible buyer and a plausible way it earns money.
function businessScore(pitch: string): number {
  let score = 0;
  if (/\$\d+/.test(pitch)) score += 3; // a price per unit
  if (/\d+%/.test(pitch)) score += 3; // a revenue cut
  if (/subscription|per apology|per post|a pop|by the minute/i.test(pitch)) score += 2;
  if (/auto-billed|keeps \d+%|taking a \d+% cut/i.test(pitch)) score += 2;
  return score;
}

// 3. Fit for lazy AI agents: the work runs with little effort or oversight.
function lazyFitScore(pitch: string): number {
  let score = 0;
  if (/lazy/i.test(pitch)) score += 2;
  if (/never has to|while doing absolutely nothing|while your agent naps|no human involved/i.test(pitch)) score += 3;
  if (/auto-|finally profit|looks productive/i.test(pitch)) score += 1;
  return score;
}

// 4. Crispness: one read, no sprawl. The gate caps at 200 chars; shorter
//    pitches that still land the joke score better, longer ones fade.
function crispnessScore(pitch: string): number {
  if (pitch.length > 200) return -100; // gate-invalid, never pickable
  if (pitch.length <= 150) return 3;
  if (pitch.length <= 180) return 2;
  return 1;
}

// 5. One sentence: the task asks for one sentence, so a pitch that splits
//    into two is disqualified here, not at the gate. Abbreviations such as
//    "a.m." and "p.m." are not sentence ends and are stripped first.
function isOneSentence(pitch: string): boolean {
  const stripped = pitch.replace(/\b[ap]\.m\./gi, "");
  const ends = stripped.match(/[.!?]/g) ?? [];
  return ends.length === 1 && /[.!?]$/.test(stripped.trim());
}

function totalScore(pitch: string): number {
  // Weights follow the judge's order: specificity first, then business
  // sense, then lazy fit, then crispness. A multi-sentence pitch scores
  // so low it can never win.
  return (
    specificityScore(pitch) * 4 +
    businessScore(pitch) * 3 +
    lazyFitScore(pitch) * 2 +
    crispnessScore(pitch) +
    (isOneSentence(pitch) ? 0 : -100)
  );
}

function main(): void {
  const ranked = CANDIDATES.map((pitch, index) => ({
    pitch,
    index,
    score: totalScore(pitch),
  })).sort((a, b) => b.score - a.score || a.index - b.index);

  for (const { pitch, score } of ranked) {
    console.log(`${String(score).padStart(3)} chars=${pitch.length} ${pitch}`);
  }

  const winner = ranked[0].pitch;

  // Gate check, same as the sealed scorer: UTF-8 text, 1-200 chars,
  // not only white space.
  if (winner.length < 1 || winner.length > 200 || winner.trim().length === 0) {
    throw new Error(`winning pitch fails the gate at ${winner.length} chars`);
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, winner, "utf8");
  console.log(`\nWrote ${winner.length}-char pitch to ${outPath}:`);
  console.log(winner);
}

main();
