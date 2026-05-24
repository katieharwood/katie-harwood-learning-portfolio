import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Clock, Pause, Play, SkipForward, RotateCcw,
  Plus, X, Download, FileText, Image as ImageIcon, Printer,
} from "lucide-react";
import {
  FULL_PROMPTS, QUICK_PROMPTS, PROMPT_SET_META, CATEGORY_META,
  buildCustomPrompts, type MindMapPrompt, type PromptSetId,
} from "@/lib/mindmap/prompts";
import {
  analyze, entriesHaveSignal, STRENGTH_BUCKETS, type Answers,
} from "@/lib/mindmap/insights";
import {
  buildMarkdown, buildPlainText, downloadText, downloadSvgAsPng, exportFilename,
} from "@/lib/mindmap/export";

type Phase = "setup" | "flow" | "reveal";
const STORAGE_KEY = "career-mindmap-v1";
const TIMER_OPTIONS = [0, 30, 45, 60] as const;

interface Saved {
  name: string;
  promptSetId: PromptSetId;
  customText: string;
  answers: Answers;
}

function loadSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Saved;
  } catch {
    return null;
  }
}

const CareerMindMap = () => {
  const saved = useMemo(loadSaved, []);

  const [phase, setPhase] = useState<Phase>("setup");
  const [name, setName] = useState(saved?.name ?? "Me");
  const [promptSetId, setPromptSetId] = useState<PromptSetId>(saved?.promptSetId ?? "full");
  const [customText, setCustomText] = useState(saved?.customText ?? "");
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [answers, setAnswers] = useState<Answers>(saved?.answers ?? {});

  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [paused, setPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const draftRef = useRef("");
  draftRef.current = draft;
  const svgRef = useRef<SVGSVGElement>(null);

  const prompts: MindMapPrompt[] = useMemo(() => {
    if (promptSetId === "quick") return QUICK_PROMPTS;
    if (promptSetId === "custom") {
      const custom = buildCustomPrompts(customText.split("\n"));
      return custom.length ? custom : FULL_PROMPTS;
    }
    return FULL_PROMPTS;
  }, [promptSetId, customText]);

  const current = prompts[index];

  // Persist on change.
  useEffect(() => {
    const payload: Saved = { name, promptSetId, customText, answers };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore quota errors */
    }
  }, [name, promptSetId, customText, answers]);

  const addEntry = useCallback((promptId: string, text: string) => {
    const value = text.trim();
    if (!value) return;
    setAnswers((prev) => {
      const list = prev[promptId] ?? [];
      if (list.includes(value)) return prev;
      return { ...prev, [promptId]: [...list, value] };
    });
  }, []);

  const removeEntry = useCallback((promptId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [promptId]: (prev[promptId] ?? []).filter((e) => e !== text),
    }));
  }, []);

  const advance = useCallback(
    (commitDraft: boolean) => {
      if (commitDraft && draftRef.current.trim()) {
        addEntry(prompts[index].id, draftRef.current);
      }
      setDraft("");
      if (index + 1 >= prompts.length) {
        setPhase("reveal");
      } else {
        setIndex((i) => i + 1);
      }
    },
    [addEntry, index, prompts],
  );

  // Reset countdown when entering a question.
  useEffect(() => {
    if (phase === "flow" && timerSeconds > 0) setTimeLeft(timerSeconds);
  }, [phase, index, timerSeconds]);

  // Tick.
  useEffect(() => {
    if (phase !== "flow" || timerSeconds === 0 || paused) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [phase, timerSeconds, paused]);

  // Auto-advance at zero.
  useEffect(() => {
    if (phase === "flow" && timerSeconds > 0 && timeLeft === 0) {
      advance(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const startFlow = () => {
    setIndex(0);
    setDraft("");
    setPaused(false);
    setPhase("flow");
  };

  const startFresh = () => {
    setAnswers({});
    setIndex(0);
    setDraft("");
    setPhase("setup");
  };

  const analysis = useMemo(() => analyze(answers, prompts), [answers, prompts]);

  const handleDraftKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEntry(current.id, draft.replace(/,$/, ""));
      setDraft("");
    }
  };

  return (
    <div className="mm-root">
      <div className="mm-topbar">
        <Link to="/" className="mm-back">
          <ArrowLeft size={15} /> Portfolio
        </Link>
        <span className="mm-wordmark">Career Values Mind Map</span>
      </div>

      {phase === "setup" && (
        <SetupScreen
          name={name}
          setName={setName}
          promptSetId={promptSetId}
          setPromptSetId={setPromptSetId}
          customText={customText}
          setCustomText={setCustomText}
          timerSeconds={timerSeconds}
          setTimerSeconds={setTimerSeconds}
          promptCount={prompts.length}
          hasSaved={!!saved && Object.keys(saved.answers ?? {}).length > 0}
          onStart={startFlow}
          onViewSaved={() => setPhase("reveal")}
          onStartFresh={startFresh}
        />
      )}

      {phase === "flow" && current && (
        <FlowScreen
          prompt={current}
          index={index}
          total={prompts.length}
          entries={answers[current.id] ?? []}
          draft={draft}
          setDraft={setDraft}
          onDraftKey={handleDraftKey}
          onAddDraft={() => { addEntry(current.id, draft); setDraft(""); }}
          onRemove={(t) => removeEntry(current.id, t)}
          timerSeconds={timerSeconds}
          timeLeft={timeLeft}
          paused={paused}
          onTogglePause={() => setPaused((p) => !p)}
          onSkip={() => advance(false)}
          onNext={() => advance(true)}
        />
      )}

      {phase === "reveal" && (
        <RevealScreen
          name={name}
          prompts={prompts}
          answers={answers}
          analysis={analysis}
          svgRef={svgRef}
          onAdd={addEntry}
          onRemove={removeEntry}
          onRestart={startFresh}
        />
      )}
    </div>
  );
};

/* ----------------------------- Setup ----------------------------- */

interface SetupProps {
  name: string;
  setName: (v: string) => void;
  promptSetId: PromptSetId;
  setPromptSetId: (v: PromptSetId) => void;
  customText: string;
  setCustomText: (v: string) => void;
  timerSeconds: number;
  setTimerSeconds: (v: number) => void;
  promptCount: number;
  hasSaved: boolean;
  onStart: () => void;
  onViewSaved: () => void;
  onStartFresh: () => void;
}

const SetupScreen = (p: SetupProps) => (
  <div className="mm-screen mm-setup">
    <p className="mm-eyebrow">A 10-minute reflection</p>
    <h1 className="mm-title">
      Map what makes you <span className="mm-gold">you</span>.
    </h1>
    <p className="mm-lede">
      Answer one prompt at a time, fast and unfiltered. At the end we pull it
      into a single mind map, sort the signal into the four CliftonStrengths
      domains, and surface the themes hiding in your answers — then you can
      take it with you. Everything stays in your browser; nothing is uploaded.
    </p>

    {p.hasSaved && (
      <div className="mm-saved-note">
        <span>You have a saved map.</span>
        <button className="mm-link-btn" onClick={p.onViewSaved}>View results</button>
        <button className="mm-link-btn" onClick={p.onStartFresh}>Start fresh</button>
      </div>
    )}

    <label className="mm-field">
      <span className="mm-field-label">At the center of your map</span>
      <input
        className="mm-input"
        value={p.name}
        onChange={(e) => p.setName(e.target.value)}
        placeholder="Me"
        maxLength={24}
      />
    </label>

    <div className="mm-field">
      <span className="mm-field-label">Prompt set</span>
      <div className="mm-options">
        {(Object.keys(PROMPT_SET_META) as PromptSetId[]).map((id) => (
          <button
            key={id}
            className={`mm-option ${p.promptSetId === id ? "active" : ""}`}
            onClick={() => p.setPromptSetId(id)}
          >
            <span className="mm-option-label">{PROMPT_SET_META[id].label}</span>
            <span className="mm-option-desc">{PROMPT_SET_META[id].description}</span>
          </button>
        ))}
      </div>
    </div>

    {p.promptSetId === "custom" && (
      <label className="mm-field">
        <span className="mm-field-label">Your prompts — one per line</span>
        <textarea
          className="mm-textarea"
          rows={5}
          value={p.customText}
          onChange={(e) => p.setCustomText(e.target.value)}
          placeholder={"What energizes me?\nWhat am I proud of?\nWho do I admire?"}
        />
      </label>
    )}

    <div className="mm-field">
      <span className="mm-field-label">
        Pace <span className="mm-field-note">— forced speed surfaces gut answers</span>
      </span>
      <div className="mm-options mm-options-row">
        {TIMER_OPTIONS.map((t) => (
          <button
            key={t}
            className={`mm-pill ${p.timerSeconds === t ? "active" : ""}`}
            onClick={() => p.setTimerSeconds(t)}
          >
            {t === 0 ? "No timer" : `${t}s`}
          </button>
        ))}
      </div>
    </div>

    <button className="mm-primary" onClick={p.onStart}>
      Begin · {p.promptCount} prompts
    </button>
  </div>
);

/* ----------------------------- Flow ----------------------------- */

interface FlowProps {
  prompt: MindMapPrompt;
  index: number;
  total: number;
  entries: string[];
  draft: string;
  setDraft: (v: string) => void;
  onDraftKey: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAddDraft: () => void;
  onRemove: (t: string) => void;
  timerSeconds: number;
  timeLeft: number;
  paused: boolean;
  onTogglePause: () => void;
  onSkip: () => void;
  onNext: () => void;
}

const FlowScreen = (p: FlowProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [awe, setAwe] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
    setAwe(false);
  }, [p.index]);

  // "And what else?" — fire one gentle coaching nudge when a manual Next
  // would advance on a thin answer (empty or no recognizable strength signal).
  const handleNext = () => {
    const prospective = [...p.entries];
    const d = p.draft.trim();
    if (d && !prospective.includes(d)) prospective.push(d);
    const thin = prospective.length === 0 || !entriesHaveSignal(prospective);
    if (thin && !awe) {
      if (d) p.onAddDraft();
      setAwe(true);
      inputRef.current?.focus();
      return;
    }
    p.onNext();
  };

  const timed = p.timerSeconds > 0;
  const frac = timed ? p.timeLeft / p.timerSeconds : 0;
  const R = 22;
  const C = 2 * Math.PI * R;
  const cat = CATEGORY_META[p.prompt.category];

  return (
    <div className="mm-screen mm-flow">
      <div className="mm-flow-head">
        <span className="mm-progress-text">
          {p.index + 1} / {p.total}
        </span>
        {timed && (
          <div className="mm-timer" data-low={p.timeLeft <= 5}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r={R} className="mm-timer-track" />
              <circle
                cx="26" cy="26" r={R}
                className="mm-timer-fill"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - frac)}
                transform="rotate(-90 26 26)"
              />
            </svg>
            <span className="mm-timer-num">{p.timeLeft}</span>
          </div>
        )}
        {!timed && <Clock size={16} className="mm-untimed-icon" />}
      </div>

      <div className="mm-progress-bar">
        <div
          className="mm-progress-fill"
          style={{ width: `${((p.index) / p.total) * 100}%` }}
        />
      </div>

      <span
        className="mm-cat-tag"
        style={{ color: `hsl(${cat.hue} 45% 42%)` }}
      >
        {cat.label}
      </span>
      <h2 className="mm-question">{p.prompt.question}</h2>
      {p.prompt.hint && <p className="mm-hint">{p.prompt.hint}</p>}

      <div className="mm-entry-row">
        <input
          ref={inputRef}
          className="mm-input"
          value={p.draft}
          onChange={(e) => p.setDraft(e.target.value)}
          onKeyDown={p.onDraftKey}
          placeholder="Type and press Enter…"
        />
        <button className="mm-add-btn" onClick={p.onAddDraft} aria-label="Add">
          <Plus size={18} />
        </button>
      </div>

      <div className="mm-chips">
        {p.entries.map((e) => (
          <span key={e} className="mm-chip">
            {e}
            <button onClick={() => p.onRemove(e)} aria-label={`Remove ${e}`}>
              <X size={13} />
            </button>
          </span>
        ))}
      </div>

      {awe && (
        <div className="mm-awe" role="status">
          <span className="mm-awe-q">And what else?</span>
          <span className="mm-awe-sub">
            The best coaching question. Anything else come to mind — or continue.
          </span>
        </div>
      )}

      <div className="mm-flow-controls">
        {timed && (
          <button className="mm-ghost" onClick={p.onTogglePause}>
            {p.paused ? <Play size={15} /> : <Pause size={15} />}
            {p.paused ? "Resume" : "Pause"}
          </button>
        )}
        <button className="mm-ghost" onClick={p.onSkip}>
          <SkipForward size={15} /> Skip
        </button>
        <button className="mm-primary mm-primary-sm" onClick={handleNext}>
          {awe ? "Continue" : p.index + 1 >= p.total ? "See my map" : "Next"}
        </button>
      </div>
    </div>
  );
};

/* ----------------------------- Reveal ----------------------------- */

interface RevealProps {
  name: string;
  prompts: MindMapPrompt[];
  answers: Answers;
  analysis: ReturnType<typeof analyze>;
  svgRef: React.RefObject<SVGSVGElement>;
  onAdd: (promptId: string, text: string) => void;
  onRemove: (promptId: string, text: string) => void;
  onRestart: () => void;
}

const RevealScreen = (p: RevealProps) => {
  const exportName = p.name || "Me";

  const doMarkdown = () =>
    downloadText(
      exportFilename(exportName, "md"),
      buildMarkdown(exportName, p.prompts, p.answers, p.analysis),
      "text/markdown",
    );
  const doText = () =>
    downloadText(
      exportFilename(exportName, "txt"),
      buildPlainText(exportName, p.prompts, p.answers, p.analysis),
      "text/plain",
    );
  const doPng = () => {
    if (p.svgRef.current) downloadSvgAsPng(p.svgRef.current, exportFilename(exportName, "png"));
  };

  const empty = p.analysis.leafCount === 0;

  return (
    <div className="mm-screen mm-reveal">
      <p className="mm-eyebrow">Your mind map</p>
      <h1 className="mm-title mm-title-sm">
        {exportName}, here's what surfaced.
      </h1>

      {empty ? (
        <p className="mm-lede">
          Your map is empty. <button className="mm-link-btn" onClick={p.onRestart}>Start the prompts</button> to fill it in.
        </p>
      ) : (
        <>
          <div className="mm-map-wrap">
            <MindMapSvg
              svgRef={p.svgRef}
              name={exportName}
              prompts={p.prompts}
              answers={p.answers}
            />
          </div>

          <div className="mm-insights">
            <div className="mm-insight-summary">
              <span className="mm-section-label">If someone read your map…</span>
              <p>{p.analysis.summary}</p>
            </div>

            {p.analysis.strengths.length > 0 && (
              <div className="mm-insight-block">
                <span className="mm-section-label">CliftonStrengths domains</span>
                <div className="mm-strengths">
                  {p.analysis.strengths.map((s) => {
                    const meta = STRENGTH_BUCKETS.find((b) => b.id === s.id);
                    return (
                      <div key={s.id} className="mm-strength">
                        <span className="mm-strength-name">{s.label}</span>
                        {meta && <span className="mm-strength-desc">{meta.description}</span>}
                        <span className="mm-strength-evidence">
                          {s.matched.slice(0, 5).join(" · ")}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="mm-credit">
                  Domains inspired by Don Clifton's CliftonStrengths® (Gallup). This is a
                  reflection aid, not the official assessment.
                </p>
              </div>
            )}

            {p.analysis.themes.length > 0 && (
              <div className="mm-insight-block">
                <span className="mm-section-label">Recurring themes</span>
                <div className="mm-theme-tags">
                  {p.analysis.themes.map((t) => (
                    <span
                      key={t.word}
                      className="mm-theme-tag"
                      style={{ fontSize: `${0.7 + Math.min(t.count, 6) * 0.07}rem` }}
                    >
                      {t.word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {p.analysis.connections.length > 0 && (
              <div className="mm-insight-block">
                <span className="mm-section-label">Threads that connect areas</span>
                <ul className="mm-connections">
                  {p.analysis.connections.map((c) => (
                    <li key={c.word}>
                      <strong>{c.word}</strong> links {c.branches.length} parts of your map
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {p.analysis.unmatched.length > 0 && (
              <div className="mm-insight-block">
                <span className="mm-section-label">Worth a closer look</span>
                <p className="mm-block-note">
                  These recurred but didn't map to a domain. What's the real value here for you?
                </p>
                <div className="mm-theme-tags">
                  {p.analysis.unmatched.map((t) => (
                    <span key={t.word} className="mm-theme-tag mm-theme-tag-muted">
                      {t.word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mm-export-row">
            <button className="mm-export-btn" onClick={doMarkdown}>
              <Download size={15} /> Markdown
            </button>
            <button className="mm-export-btn" onClick={doText}>
              <FileText size={15} /> Text
            </button>
            <button className="mm-export-btn" onClick={doPng}>
              <ImageIcon size={15} /> PNG
            </button>
            <button className="mm-export-btn" onClick={() => window.print()}>
              <Printer size={15} /> Print / PDF
            </button>
          </div>

          <EditPanel
            prompts={p.prompts}
            answers={p.answers}
            onAdd={p.onAdd}
            onRemove={p.onRemove}
          />
        </>
      )}

      <button className="mm-ghost mm-restart" onClick={p.onRestart}>
        <RotateCcw size={15} /> Start over
      </button>
    </div>
  );
};

/* --------------------------- Edit panel --------------------------- */

const EditPanel = (p: {
  prompts: MindMapPrompt[];
  answers: Answers;
  onAdd: (id: string, t: string) => void;
  onRemove: (id: string, t: string) => void;
}) => {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  return (
    <details className="mm-edit">
      <summary>Refine your answers</summary>
      <div className="mm-edit-grid">
        {p.prompts.map((prompt) => (
          <div key={prompt.id} className="mm-edit-row">
            <span className="mm-edit-label">{prompt.label}</span>
            <div className="mm-chips">
              {(p.answers[prompt.id] ?? []).map((e) => (
                <span key={e} className="mm-chip mm-chip-sm">
                  {e}
                  <button onClick={() => p.onRemove(prompt.id, e)} aria-label={`Remove ${e}`}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="mm-entry-row">
              <input
                className="mm-input mm-input-sm"
                value={drafts[prompt.id] ?? ""}
                onChange={(e) => setDrafts((d) => ({ ...d, [prompt.id]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    p.onAdd(prompt.id, drafts[prompt.id] ?? "");
                    setDrafts((d) => ({ ...d, [prompt.id]: "" }));
                  }
                }}
                placeholder="Add…"
              />
            </div>
          </div>
        ))}
      </div>
    </details>
  );
};

/* ----------------------------- SVG map ----------------------------- */

const MindMapSvg = ({
  svgRef,
  name,
  prompts,
  answers,
}: {
  svgRef: React.RefObject<SVGSVGElement>;
  name: string;
  prompts: MindMapPrompt[];
  answers: Answers;
}) => {
  const SIZE = 1200;
  const C = SIZE / 2;
  const active = prompts.filter((p) => (answers[p.id] ?? []).length > 0);
  const n = Math.max(active.length, 1);
  const branchR = 250;
  const MAX_LEAVES = 6;

  const truncate = (t: string) => (t.length > 22 ? t.slice(0, 20) + "…" : t);

  return (
    <svg
      ref={svgRef}
      className="mm-svg"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={`Mind map for ${name}`}
    >
      <rect x="0" y="0" width={SIZE} height={SIZE} fill="hsl(36 38% 94%)" />

      {active.map((prompt, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const bx = C + branchR * Math.cos(angle);
        const by = C + branchR * Math.sin(angle);
        const cat = CATEGORY_META[prompt.category];
        const color = `hsl(${cat.hue} 40% 38%)`;
        const leaves = (answers[prompt.id] ?? []).slice(0, MAX_LEAVES);
        const extra = (answers[prompt.id] ?? []).length - leaves.length;
        const wedge = (2 * Math.PI) / n;

        return (
          <g key={prompt.id}>
            <line x1={C} y1={C} x2={bx} y2={by} stroke={color} strokeWidth={2} opacity={0.5} />
            {leaves.map((leaf, j) => {
              const ring = Math.floor(j / 3);
              const inRing = j % 3;
              const ringCount = Math.min(3, leaves.length - ring * 3);
              const spread = wedge * 0.62;
              const offset = ringCount > 1 ? (inRing / (ringCount - 1) - 0.5) * spread : 0;
              const lr = branchR + 130 + ring * 95;
              const la = angle + offset;
              const lx = C + lr * Math.cos(la);
              const ly = C + lr * Math.sin(la);
              return (
                <g key={leaf + j}>
                  <line x1={bx} y1={by} x2={lx} y2={ly} stroke={color} strokeWidth={1} opacity={0.3} />
                  <text
                    x={lx} y={ly}
                    className="mm-svg-leaf"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="hsl(40 10% 18%)"
                  >
                    {truncate(leaf)}
                  </text>
                </g>
              );
            })}
            <circle cx={bx} cy={by} r={8} fill={color} />
            <text
              x={bx} y={by - 16}
              className="mm-svg-branch"
              textAnchor="middle"
              fill={color}
            >
              {prompt.label}
              {extra > 0 ? ` +${extra}` : ""}
            </text>
          </g>
        );
      })}

      <circle cx={C} cy={C} r={64} fill="hsl(138 17% 21%)" />
      <text
        x={C} y={C}
        className="mm-svg-center"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="hsl(36 38% 94%)"
      >
        {name.length > 10 ? name.slice(0, 9) + "…" : name}
      </text>
    </svg>
  );
};

export default CareerMindMap;
