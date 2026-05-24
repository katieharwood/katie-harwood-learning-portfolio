import type { MindMapPrompt } from "./prompts";

export type Answers = Record<string, string[]>;

const STOPWORDS = new Set([
  "the", "and", "for", "with", "that", "this", "you", "your", "are", "was", "were",
  "have", "has", "had", "but", "not", "all", "any", "can", "out", "use", "using",
  "like", "liked", "love", "loved", "enjoy", "enjoyed", "doing", "things", "thing",
  "people", "person", "time", "times", "lot", "really", "very", "just", "get", "got",
  "make", "made", "want", "wanted", "feel", "felt", "when", "what", "who", "how",
  "why", "from", "into", "about", "they", "them", "their", "our", "his", "her",
  "she", "him", "its", "been", "being", "than", "then", "too", "also", "more",
  "most", "some", "such", "each", "other", "one", "two", "three", "etc", "way",
  "ways", "good", "great", "new", "myself", "being", "around",
]);

export interface StrengthBucket {
  id: string;
  label: string;
  /** One-line gloss of the CliftonStrengths domain (paraphrased, not Gallup's verbatim text). */
  description: string;
  /** Sentence fragment used in the summary. */
  phrase: string;
  keywords: string[];
}

/**
 * The four CliftonStrengths® domains (Don Clifton / Gallup). Each domain's
 * keyword list is aggregated from the vocabulary of its constituent themes.
 * Inspired by — not affiliated with or endorsed by — Gallup; this is a
 * lightweight reflection aid, not the official assessment.
 */
export const STRENGTH_BUCKETS: StrengthBucket[] = [
  {
    id: "executing",
    label: "Executing",
    description: "Making things happen — turning intent into done.",
    phrase: "gets things done and makes ideas real",
    keywords: ["achieve", "achievement", "accomplish", "accomplished", "finish", "finished", "complete", "completed", "deliver", "delivered", "productive", "hardworking", "busy", "goal", "goals", "done", "organize", "organized", "organizing", "arrange", "coordinate", "logistics", "juggle", "multitask", "belief", "beliefs", "mission", "purpose", "ethics", "ethical", "fair", "fairness", "consistent", "consistency", "rule", "rules", "routine", "structure", "structured", "discipline", "disciplined", "deadline", "deadlines", "order", "detail", "details", "careful", "cautious", "deliberate", "thorough", "focus", "focused", "priority", "prioritize", "responsible", "responsibility", "reliable", "dependable", "ownership", "commit", "commitment", "fix", "fixing", "fixed", "restore", "repair", "turnaround", "troubleshoot", "execute"],
  },
  {
    id: "influencing",
    label: "Influencing",
    description: "Taking charge, speaking up, and reaching a wider audience.",
    phrase: "steps up, speaks out, and rallies others",
    keywords: ["lead", "leader", "leading", "leadership", "manage", "manager", "managing", "direct", "initiate", "initiative", "activate", "action", "drive", "momentum", "command", "charge", "decisive", "decision", "communicate", "communication", "speak", "speaking", "present", "presenting", "presentation", "story", "storytelling", "persuade", "persuasive", "influence", "pitch", "compete", "competition", "competitive", "win", "winning", "won", "maximize", "excellence", "optimize", "confidence", "confident", "independent", "autonomy", "significance", "recognition", "impact", "audience", "stage", "network", "networking", "outgoing", "charisma", "sell"],
  },
  {
    id: "relationship-building",
    label: "Relationship Building",
    description: "The glue that holds a team together.",
    phrase: "builds trust and brings people together",
    keywords: ["relationship", "relationships", "connect", "connecting", "connection", "team", "teams", "teamwork", "together", "collaborate", "collaboration", "community", "belong", "belonging", "include", "inclusive", "welcome", "mentor", "mentoring", "coach", "coaching", "develop", "developing", "grow", "growth", "teach", "teaching", "support", "supporting", "help", "helping", "care", "caring", "empathy", "empathetic", "listen", "listening", "feelings", "emotion", "compassion", "kind", "kindness", "harmony", "consensus", "individual", "personalize", "positive", "positivity", "optimism", "optimistic", "encourage", "encouraging", "friend", "friends", "trust", "bond", "family", "nurture", "serve", "service", "volunteer", "volunteering", "adaptable", "flexible", "flexibility"],
  },
  {
    id: "strategic-thinking",
    label: "Strategic Thinking",
    description: "Absorbing information and shaping what could be.",
    phrase: "absorbs ideas and thinks several moves ahead",
    keywords: ["analyze", "analysis", "analytical", "data", "logic", "logical", "evidence", "reason", "reasoning", "pattern", "patterns", "context", "history", "background", "research", "researching", "future", "futuristic", "vision", "visionary", "imagine", "possibility", "possibilities", "idea", "ideas", "ideation", "creative", "creativity", "create", "design", "brainstorm", "innovate", "innovation", "invent", "input", "information", "knowledge", "curious", "curiosity", "learn", "learning", "read", "reading", "study", "studying", "books", "book", "course", "courses", "explore", "exploring", "discover", "think", "thinking", "thinker", "reflect", "reflection", "intellectual", "ponder", "strategy", "strategic", "options", "anticipate", "theory", "concept", "concepts"],
  },
];

const SUFFIXES = ["ing", "ed", "es", "s"];

function normalizeToken(raw: string): string {
  let t = raw.toLowerCase().replace(/[^a-z]/g, "");
  for (const suf of SUFFIXES) {
    if (t.length > suf.length + 2 && t.endsWith(suf)) {
      t = t.slice(0, -suf.length);
      break;
    }
  }
  return t;
}

export function tokenize(text: string): string[] {
  return text
    .split(/[^a-zA-Z]+/)
    .map((w) => w.toLowerCase())
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

export interface Theme {
  word: string;
  count: number;
  /** Prompt ids where this word appeared. */
  branches: string[];
}

export interface Strength {
  id: string;
  label: string;
  score: number;
  matched: string[];
}

export interface Analysis {
  leafCount: number;
  branchCount: number;
  themes: Theme[];
  strengths: Strength[];
  /** Words that bridge two or more branches. */
  connections: Theme[];
  /** Recurring words that matched no domain — surfaced for reflection, not dropped. */
  unmatched: Theme[];
  summary: string;
}

/** Pre-index bucket keywords by their normalized stem for fast lookup. */
const STEM_TO_BUCKETS = (() => {
  const map = new Map<string, string[]>();
  for (const b of STRENGTH_BUCKETS) {
    for (const kw of b.keywords) {
      const stem = normalizeToken(kw);
      const arr = map.get(stem) ?? [];
      if (!arr.includes(b.id)) arr.push(b.id);
      map.set(stem, arr);
    }
  }
  return map;
})();

/** True if any word in the text maps to a CliftonStrengths domain. */
export function matchesAnyDomain(text: string): boolean {
  return tokenize(text).some((w) => STEM_TO_BUCKETS.has(normalizeToken(w)));
}

/** True if at least one entry carries recognizable strength signal. */
export function entriesHaveSignal(entries: string[]): boolean {
  return entries.some(matchesAnyDomain);
}

export function analyze(answers: Answers, prompts: MindMapPrompt[]): Analysis {
  const wordInfo = new Map<string, { count: number; branches: Set<string> }>();
  const bucketScores = new Map<string, { score: number; matched: Set<string> }>();
  let leafCount = 0;
  const branchesWithContent = new Set<string>();

  for (const prompt of prompts) {
    const entries = answers[prompt.id] ?? [];
    if (entries.length) branchesWithContent.add(prompt.id);
    for (const entry of entries) {
      leafCount += 1;
      const seenWords = tokenize(entry);
      for (const w of seenWords) {
        const info = wordInfo.get(w) ?? { count: 0, branches: new Set<string>() };
        info.count += 1;
        info.branches.add(prompt.id);
        wordInfo.set(w, info);

        const stem = normalizeToken(w);
        const bucketIds = STEM_TO_BUCKETS.get(stem);
        if (bucketIds) {
          for (const id of bucketIds) {
            const bs = bucketScores.get(id) ?? { score: 0, matched: new Set<string>() };
            bs.score += 1;
            bs.matched.add(w);
            bucketScores.set(id, bs);
          }
        }
      }
    }
  }

  const themes: Theme[] = [...wordInfo.entries()]
    .map(([word, info]) => ({ word, count: info.count, branches: [...info.branches] }))
    .filter((t) => t.count >= 2)
    .sort((a, b) => b.count - a.count || b.branches.length - a.branches.length)
    .slice(0, 12);

  const connections: Theme[] = [...wordInfo.entries()]
    .map(([word, info]) => ({ word, count: info.count, branches: [...info.branches] }))
    .filter((t) => t.branches.length >= 2)
    .sort((a, b) => b.branches.length - a.branches.length || b.count - a.count)
    .slice(0, 8);

  const strengths: Strength[] = [...bucketScores.entries()]
    .map(([id, bs]) => {
      const meta = STRENGTH_BUCKETS.find((b) => b.id === id)!;
      return { id, label: meta.label, score: bs.score, matched: [...bs.matched] };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const unmatched: Theme[] = [...wordInfo.entries()]
    .filter(([word]) => !STEM_TO_BUCKETS.has(normalizeToken(word)))
    .map(([word, info]) => ({ word, count: info.count, branches: [...info.branches] }))
    .filter((t) => t.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    leafCount,
    branchCount: branchesWithContent.size,
    themes,
    strengths,
    connections,
    unmatched,
    summary: buildSummary(strengths, themes),
  };
}

function buildSummary(strengths: Strength[], themes: Theme[]): string {
  if (strengths.length === 0 && themes.length === 0) {
    return "Add a few more entries and your strengths will start to surface here.";
  }
  const top = strengths.slice(0, 3);
  const phrases = top.map((s) => STRENGTH_BUCKETS.find((b) => b.id === s.id)!.phrase);
  let lead = "";
  if (phrases.length === 1) lead = phrases[0];
  else if (phrases.length === 2) lead = `${phrases[0]} and ${phrases[1]}`;
  else if (phrases.length >= 3) lead = `${phrases[0]}, ${phrases[1]}, and ${phrases[2]}`;

  const themeWords = themes.slice(0, 4).map((t) => t.word);
  const themePart = themeWords.length
    ? ` Recurring threads — ${themeWords.join(", ")} — suggest where your energy naturally goes.`
    : "";

  if (!lead) {
    return `Someone reading your map would notice clear themes.${themePart}`;
  }
  return `Someone reading your map without knowing you would likely describe a person who ${lead}.${themePart}`;
}
