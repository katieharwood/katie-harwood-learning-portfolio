export type PromptCategory =
  | "passions"
  | "experience"
  | "growth"
  | "values"
  | "vision";

export interface MindMapPrompt {
  id: string;
  /** Short label used as the branch name on the map. */
  label: string;
  /** Full question shown during the timed flow. */
  question: string;
  /** Optional nudge shown under the question. */
  hint?: string;
  category: PromptCategory;
}

export const CATEGORY_META: Record<
  PromptCategory,
  { label: string; hue: number }
> = {
  passions: { label: "Passions", hue: 37 }, // aspen gold
  experience: { label: "Experience", hue: 138 }, // forest
  growth: { label: "Growth", hue: 123 }, // sage
  values: { label: "Values", hue: 210 }, // granite blue
  vision: { label: "Vision", hue: 280 }, // soft violet
};

export const FULL_PROMPTS: MindMapPrompt[] = [
  { id: "hobbies", label: "Hobbies", question: "What are your hobbies?", hint: "Don't filter — list whatever comes to mind.", category: "passions" },
  { id: "activities", label: "Activities I like", question: "What activities do you like doing?", category: "passions" },
  { id: "things", label: "Things I like to do", question: "What are things you like to do?", category: "passions" },
  { id: "roles", label: "Meaningful roles", question: "Which jobs, caregiving, or volunteering roles had meaning for you?", category: "experience" },
  { id: "learning", label: "Lasting learning", question: "Which classes, workshops, or training had a lasting impact on you?", category: "growth" },
  { id: "proud", label: "Proud of", question: "What successes or things you've done are you most proud of?", category: "experience" },
  { id: "awards", label: "Recognition", question: "What awards, recognition, or honors have you received?", category: "experience" },
  { id: "gear", label: "Tools I love", question: "What gear, equipment, tools, or technology do you enjoy using?", category: "passions" },
  { id: "research", label: "Research for fun", question: "What do you research when you don't have to?", category: "growth" },
  { id: "media", label: "Media that moved me", question: "Which books, films, TV shows, or plays impacted you?", category: "growth" },
  { id: "rolemodels", label: "People I admire", question: "Who have you looked up to?", category: "growth" },
  { id: "peers", label: "People I enjoy", question: "What types of people do you enjoy working or volunteering with?", category: "values" },
  { id: "lessons", label: "Lessons learned", question: "What valuable lessons have you learned?", category: "growth" },
  { id: "happytime", label: "Happiest at work", question: "Name a time you felt happiest about the work you were doing — in 1–2 keywords — and what made it meaningful.", hint: "Keyword first, then why it mattered.", category: "experience" },
  { id: "workplace", label: "I value at work", question: "What do you value most in a workplace?", hint: "Include 'anti-values' — what you can't stand — as clues.", category: "values" },
  { id: "wishes", label: "Wishes", question: "What are 1–3 wishes you have for your career and/or life right now?", category: "vision" },
  { id: "missing", label: "Anything missing?", question: "Is there anything missing? Add whatever the prompts didn't capture.", category: "vision" },
];

/** A shorter set for a ~5-minute pass. */
const QUICK_IDS = ["things", "proud", "happytime", "peers", "workplace", "lessons", "wishes"];

export const QUICK_PROMPTS: MindMapPrompt[] = QUICK_IDS.map(
  (id) => FULL_PROMPTS.find((p) => p.id === id)!,
);

export type PromptSetId = "full" | "quick" | "custom";

export const PROMPT_SET_META: Record<
  PromptSetId,
  { label: string; description: string }
> = {
  full: { label: "Career Values (full)", description: "All 17 prompts. ~12–15 min." },
  quick: { label: "Quick pass", description: "7 core prompts. ~5 min." },
  custom: { label: "Your own prompts", description: "Write the questions yourself." },
};

export function buildCustomPrompts(lines: string[]): MindMapPrompt[] {
  return lines
    .map((l) => l.trim())
    .filter(Boolean)
    .map((question, i) => ({
      id: `custom-${i}`,
      label: question.length > 24 ? question.slice(0, 22) + "…" : question,
      question,
      category: (["passions", "experience", "growth", "values", "vision"] as PromptCategory[])[i % 5],
    }));
}
