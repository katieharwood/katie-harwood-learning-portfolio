import { describe, it, expect } from "vitest";
import {
  analyze, tokenize, entriesHaveSignal, type Answers,
} from "@/lib/mindmap/insights";
import { FULL_PROMPTS } from "@/lib/mindmap/prompts";

describe("tokenize", () => {
  it("drops stopwords and short words", () => {
    expect(tokenize("I love the mountain")).toEqual(["mountain"]);
  });

  it("splits on punctuation and lowercases", () => {
    expect(tokenize("Coaching, mentoring; teaching!")).toEqual([
      "coaching",
      "mentoring",
      "teaching",
    ]);
  });
});

describe("analyze", () => {
  it("returns an empty-but-valid analysis when there are no answers", () => {
    const result = analyze({}, FULL_PROMPTS);
    expect(result.leafCount).toBe(0);
    expect(result.strengths).toEqual([]);
    expect(result.summary).toContain("more entries");
  });

  it("counts leaves and active branches", () => {
    const answers: Answers = {
      hobbies: ["hiking", "skiing"],
      proud: ["coached a team"],
    };
    const result = analyze(answers, FULL_PROMPTS);
    expect(result.leafCount).toBe(3);
    expect(result.branchCount).toBe(2);
  });

  it("maps coaching/developing language to the Relationship Building domain", () => {
    const answers: Answers = {
      roles: ["coaching new hires", "mentoring interns"],
      proud: ["teaching a workshop"],
      lessons: ["develop people first"],
    };
    const result = analyze(answers, FULL_PROMPTS);
    const top = result.strengths[0];
    expect(top.id).toBe("relationship-building");
    expect(top.score).toBeGreaterThanOrEqual(4);
  });

  it("surfaces recurring unmatched words for reflection instead of dropping them", () => {
    const answers: Answers = {
      hobbies: ["pottery"],
      activities: ["pottery class"],
    };
    const result = analyze(answers, FULL_PROMPTS);
    expect(result.unmatched.some((t) => t.word === "pottery")).toBe(true);
  });
});

describe("entriesHaveSignal", () => {
  it("is true when an entry carries domain signal", () => {
    expect(entriesHaveSignal(["I love mentoring juniors"])).toBe(true);
  });

  it("is false for entries with no recognizable strength words", () => {
    expect(entriesHaveSignal(["pottery", "purple", "tuesdays"])).toBe(false);
  });

  it("detects themes that recur and threads that bridge branches", () => {
    const answers: Answers = {
      hobbies: ["mountain biking"],
      activities: ["mountain hikes"],
      wishes: ["live near a mountain"],
    };
    const result = analyze(answers, FULL_PROMPTS);
    const mountain = result.themes.find((t) => t.word === "mountain");
    expect(mountain?.count).toBe(3);
    const bridge = result.connections.find((c) => c.word === "mountain");
    expect(bridge?.branches.length).toBe(3);
  });
});
