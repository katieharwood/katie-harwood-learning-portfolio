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
  /** Sentence fragment used in the summary. */
  phrase: string;
  keywords: string[];
}

export const STRENGTH_BUCKETS: StrengthBucket[] = [
  {
    id: "developing-others",
    label: "Developing others",
    phrase: "helps people grow",
    keywords: ["coach", "coaching", "mentor", "mentoring", "teach", "teaching", "train", "training", "facilitate", "facilitating", "guide", "develop", "developing", "enable", "empower", "empowering", "support", "supporting", "learner", "learners", "students", "tutor", "onboard"],
  },
  {
    id: "building",
    label: "Building & creating",
    phrase: "makes new things",
    keywords: ["build", "building", "create", "creating", "creative", "design", "designing", "make", "making", "craft", "crafting", "prototype", "invent", "writing", "write", "code", "coding", "draw", "drawing", "paint", "art", "music", "compose", "produce", "produced"],
  },
  {
    id: "leadership",
    label: "Leadership & direction",
    phrase: "sets direction and drives outcomes",
    keywords: ["lead", "leader", "leading", "leadership", "manage", "managing", "manager", "direct", "organize", "organizing", "organized", "strategy", "strategic", "vision", "drive", "driving", "own", "owner", "ownership", "initiative", "plan", "planning", "decision", "decisions"],
  },
  {
    id: "collaboration",
    label: "Collaboration & connection",
    phrase: "brings people together",
    keywords: ["team", "teams", "teamwork", "collaborate", "collaborating", "collaboration", "together", "community", "relationship", "relationships", "connect", "connecting", "connection", "partner", "partnership", "group", "groups", "social", "network", "networking"],
  },
  {
    id: "curiosity",
    label: "Curiosity & learning",
    phrase: "is endlessly curious",
    keywords: ["research", "researching", "learn", "learning", "read", "reading", "study", "studying", "curious", "curiosity", "explore", "exploring", "discover", "experiment", "experimenting", "books", "book", "ideas", "question", "questions", "podcast", "podcasts", "course", "courses"],
  },
  {
    id: "service",
    label: "Care & service",
    phrase: "cares for and serves others",
    keywords: ["care", "caring", "help", "helping", "serve", "serving", "service", "volunteer", "volunteering", "give", "giving", "nurture", "nurturing", "kindness", "compassion", "advocate", "advocacy", "patient", "patients", "family", "caregiving"],
  },
  {
    id: "achievement",
    label: "Achievement & excellence",
    phrase: "holds a high bar",
    keywords: ["award", "awards", "win", "winning", "won", "proud", "achieve", "achievement", "achieved", "success", "successful", "recognition", "recognized", "excellence", "accomplish", "accomplished", "honor", "honors", "best", "top", "promoted", "promotion"],
  },
  {
    id: "adventure",
    label: "Adventure & the outdoors",
    phrase: "thrives on movement and challenge",
    keywords: ["sport", "sports", "athlete", "athletic", "outdoor", "outdoors", "hike", "hiking", "ski", "skiing", "run", "running", "climb", "climbing", "mountain", "mountains", "travel", "traveling", "adventure", "bike", "biking", "swim", "ocean", "trail"],
  },
  {
    id: "problem-solving",
    label: "Analysis & problem-solving",
    phrase: "untangles hard problems",
    keywords: ["solve", "solving", "analyze", "analyzing", "analysis", "data", "problem", "problems", "system", "systems", "improve", "improving", "optimize", "optimizing", "fix", "fixing", "logic", "structure", "process", "efficient", "efficiency", "debug"],
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
    .slice(0, 5);

  return {
    leafCount,
    branchCount: branchesWithContent.size,
    themes,
    connections,
    strengths,
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
