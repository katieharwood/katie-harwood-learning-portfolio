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

  it("groups related interest words into a passion area even at one mention each", () => {
    const answers: Answers = {
      hobbies: ["hiking", "skiing"],
      activities: ["climbing"],
    };
    const result = analyze(answers, FULL_PROMPTS);
    const outdoors = result.passions.find((p) => p.id === "outdoors");
    expect(outdoors).toBeDefined();
    expect(outdoors!.score).toBe(3);
    // None of these repeat as a single word, so the frequency themes miss them.
    expect(result.themes.length).toBe(0);
  });

  it("lets creativity count as both a strength and a passion", () => {
    const answers: Answers = {
      hobbies: ["painting", "pottery"],
      proud: ["designed a creative campaign"],
    };
    const result = analyze(answers, FULL_PROMPTS);
    expect(result.passions.some((p) => p.id === "creativity")).toBe(true);
    expect(result.strengths.some((s) => s.id === "strategic-thinking")).toBe(true);
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
