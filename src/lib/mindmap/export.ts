import type { MindMapPrompt } from "./prompts";
import type { Analysis, Answers } from "./insights";

function fileStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

export function buildMarkdown(
  name: string,
  prompts: MindMapPrompt[],
  answers: Answers,
  analysis: Analysis,
): string {
  const lines: string[] = [];
  lines.push(`# Career Values Mind Map — ${name}`);
  lines.push("");
  lines.push(`_Generated ${fileStamp()}_`);
  lines.push("");

  lines.push("## Key insights");
  lines.push("");
  lines.push(analysis.summary);
  lines.push("");
  if (analysis.strengths.length) {
    lines.push("**Top strengths**");
    lines.push("");
    for (const s of analysis.strengths) {
      lines.push(`- **${s.label}** — signals: ${s.matched.slice(0, 6).join(", ")}`);
    }
    lines.push("");
  }
  if (analysis.themes.length) {
    lines.push("**Recurring themes**");
    lines.push("");
    lines.push(analysis.themes.map((t) => `${t.word} (${t.count})`).join(" · "));
    lines.push("");
  }
  if (analysis.connections.length) {
    lines.push("**Threads that connect multiple areas**");
    lines.push("");
    for (const c of analysis.connections) {
      lines.push(`- _${c.word}_ shows up across ${c.branches.length} prompts`);
    }
    lines.push("");
  }

  lines.push("## Your map");
  lines.push("");
  for (const p of prompts) {
    const entries = answers[p.id] ?? [];
    if (!entries.length) continue;
    lines.push(`### ${p.label}`);
    lines.push(`_${p.question}_`);
    lines.push("");
    for (const e of entries) lines.push(`- ${e}`);
    lines.push("");
  }

  return lines.join("\n");
}

export function buildPlainText(
  name: string,
  prompts: MindMapPrompt[],
  answers: Answers,
  analysis: Analysis,
): string {
  const lines: string[] = [];
  lines.push(`CAREER VALUES MIND MAP — ${name.toUpperCase()}`);
  lines.push(`Generated ${fileStamp()}`);
  lines.push("");
  lines.push("KEY INSIGHTS");
  lines.push(analysis.summary);
  lines.push("");
  if (analysis.strengths.length) {
    lines.push("Top strengths:");
    for (const s of analysis.strengths) {
      lines.push(`  - ${s.label} (${s.matched.slice(0, 6).join(", ")})`);
    }
    lines.push("");
  }
  lines.push("YOUR MAP");
  for (const p of prompts) {
    const entries = answers[p.id] ?? [];
    if (!entries.length) continue;
    lines.push("");
    lines.push(`${p.label.toUpperCase()} — ${p.question}`);
    for (const e of entries) lines.push(`  * ${e}`);
  }
  return lines.join("\n");
}

export function downloadText(filename: string, contents: string, mime: string): void {
  const blob = new Blob([contents], { type: mime });
  triggerDownload(blob, filename);
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Serializes an inline SVG element to a PNG download. */
export function downloadSvgAsPng(svg: SVGSVGElement, filename: string, scale = 2): void {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const viewBox = svg.getAttribute("viewBox");
  const [, , vbW, vbH] = (viewBox ?? "0 0 1200 1200").split(/\s+/).map(Number);
  clone.setAttribute("width", String(vbW));
  clone.setAttribute("height", String(vbH));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const serialized = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([serialized], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = vbW * scale;
    canvas.height = vbH * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#f3efe6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob((b) => {
      if (b) triggerDownload(b, filename);
    }, "image/png");
  };
  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
}

export const exportFilename = (name: string, ext: string): string => {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "mind-map";
  return `${slug}-career-mind-map.${ext}`;
};
