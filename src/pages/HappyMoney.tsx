import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import triptychRetention from "@/assets/triptych-readiness.svg";
import triptychTooling from "@/assets/triptych-tooling.svg";
import triptychReadiness from "@/assets/triptych-retention.svg";

/* ── Constellation node data ── */
const constellationNodes = [
  { id: "research", label: "User Research", desc: "Stakeholder interviews · understanding gaps · manager pain points" },
  { id: "curriculum", label: "Curriculum Architecture", desc: "Sequencing modules · prerequisites · learning outcomes" },
  { id: "brand", label: "Brand & Identity", desc: "Program naming · visual system · tone of voice" },
  { id: "content", label: "Content & Facilitation Design", desc: "Session decks · facilitator guides · frameworks · tools" },
  { id: "stakeholder", label: "Stakeholder Alignment", desc: "Executive comms · HRBP partnership · champion recruitment" },
  { id: "ops", label: "Operational Infrastructure", desc: "Lattice integration · templates · manager checklists · scavenger hunt" },
  { id: "gtm", label: "Go-to-Market", desc: "Launch comms · registration · promotion · facilitator recruitment" },
];

/* Node positions as % (clock positions) */
const nodePositions = [
  { top: "2%",  left: "50%", transform: "translateX(-50%)" },       // 12:00 — User Research
  { top: "15%", left: "78%", transform: "none" },                    // 01:30 — Curriculum Architecture
  { top: "42%", left: "84%", transform: "none" },                    // 03:00 — Content & Facilitation
  { top: "68%", left: "74%", transform: "none" },                    // 04:30 — Operational Infrastructure
  { top: "68%", left: "8%",  transform: "none" },                    // 07:30 — Go-to-Market
  { top: "42%", left: "0%",  transform: "none" },                    // 09:00 — Stakeholder Alignment
  { top: "15%", left: "12%", transform: "none" },                    // 10:30 — Brand & Identity
];

/* ── Hero testimonial (Lauren only) ── */
const heroTestimonial = {
  quote: "It is rare to come across the combination of talent that Katie possesses. With a mind that is highly creative, innovative, and resourceful, and equally strategic and visionary, you get an explosive powerhouse that can bring incredible change, structure, process, and vision to an organization extremely quickly.",
  name: "Lauren Benton-Cissel",
  role: "Director of Talent Experience & Programs · Direct Manager",
};

/* ── Module data ── */
const modules = [
  { num: "01", title: "How We Launch", tagline: "60-min workshop on onboarding philosophy & the critical Handoff", body: "A 60-minute workshop covering Happy Money's onboarding philosophy, the OX experience, retention data, and the critical \"Handoff\" period between company onboarding and team integration. Required for all managers. Prerequisite for everything that follows." },
  { num: "02", title: "Building Launch Plans", tagline: "Hands-on session building real First 30 plans in Lattice", body: "A 60-minute hands-on workshop where managers built their actual First 30 launch plan inside Lattice — the company's new performance management tool. Not theory. Live work time with facilitated support." },
  { num: "03", title: "Coaching New Hires", tagline: "Peer-to-peer manager panel surfacing tacit knowledge", body: "A 45-minute manager discussion panel — peer-to-peer learning from managers who were already launching well. Designed to surface tacit knowledge, build cross-functional connection, and give managers a space to learn from each other." },
  { num: "04", title: "Launching Managers", tagline: "Advanced session for managers of managers", body: "A 60-minute advanced session for managers of managers. Covered team integration, cultural alignment, growth mindset, and Happy Money's commitment to Radical Belonging. Required Core Strengths as a prerequisite." },
];

/* ── Framework data ── */
const frameworks = [
  { title: "The Handoff", body: "The critical gap between company onboarding and team integration — visualized as a bridge. Made the invisible transition visible." },
  { title: "The 411", body: "A first-1:1 framework built around six questions: Who, What, Where, Why, When, and How. Structure for the conversation that sets everything up." },
  { title: "The Dream Journey", body: "A day-by-day manager roadmap for the first 30 days — from quiet prep during OX to walking meetings in Week 3." },
];

/* ── Operational tools data ── */
const operationalTools = [
  { title: "Launch Plan: The First 30", body: "Structured onboarding checklist for new hires. Lived in Lattice as a reusable manager template." },
  { title: "Manager Checklist", body: "Day-by-day action guide from pre-start-date through Week 4. Built to eliminate the \"I don't know what to do\" problem entirely." },
  { title: "New Hire Scavenger Hunt", body: "A customizable 30-day discovery tool. Made culture integration feel like exploration, not orientation." },
];

/* ── 4-phase ribbon ── */
const phases = [
  { num: "01", title: "Discover", subtitle: "Discovery & Alignment" },
  { num: "02", title: "Design", subtitle: "Architecture & Design" },
  { num: "03", title: "Build", subtitle: "Build & Facilitation" },
  { num: "04", title: "Launch", subtitle: "Pilot & Launch" },
];

/* ── FlipCard component (still used for modules) ── */
const FlipCard = ({ front, back, className = "" }: { front: React.ReactNode; back: React.ReactNode; className?: string }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`hm-flip-card ${flipped ? "flipped" : ""} ${className}`}
      onClick={() => setFlipped(!flipped)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && setFlipped(!flipped)}
    >
      <div className="hm-flip-card-inner">
        <div className="hm-flip-card-front">{front}</div>
        <div className="hm-flip-card-back">{back}</div>
      </div>
    </div>
  );
};

const HappyMoney = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const constellationRef = useRef<HTMLDivElement>(null);
  const [constellationVisible, setConstellationVisible] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  useEffect(() => {
    const sections = document.querySelectorAll(".cs-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    sections.forEach((s) => observer.observe(s));

    // Constellation observer
    const cObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setConstellationVisible(true);
          cObs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (constellationRef.current) cObs.observe(constellationRef.current);

    const handleScroll = () => {
      fabRef.current?.classList.toggle("visible", window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    window.scrollTo(0, 0);

    return () => {
      observer.disconnect();
      cObs.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* Center of constellation container (%) */
  const cx = 50, cy = 50;

  /* Get center of each node in % for SVG lines */
  const getNodeCenter = (i: number) => {
    const pos = nodePositions[i];
    const left = parseFloat(pos.left);
    const top = parseFloat(pos.top);
    // Approximate pill center: offset by ~half pill width/height in %
    const xOff = pos.transform.includes("translateX(-50%)") ? 0 : 8;
    const yOff = 3;
    return { x: left + xOff, y: top + yOff };
  };

  return (
    <>
      {/* NAV */}
      <nav className="cs-nav">
        <Link to="/" className="cs-nav-back">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All Work
        </Link>
        <Link to="/" className="cs-nav-label">Katie Harwood Portfolio</Link>
      </nav>

      {/* HERO — Lauren only */}
      <section className="cs-hero cs-hero-wide">
        <div className="cs-hero-twocol hm-hero-grid">
          <div className="cs-hero-left">
            <p className="cs-case-label">CASE STUDY · 0-1 BUILT AT SPEED</p>
            <h1 className="cs-hero-title">
              0-1 Built at Speed.<br />
              <em>Manager Readiness Program</em>
            </h1>
            <p className="cs-hero-subtitle">
              How I architected a manager readiness system from scratch — in 8 weeks — inside a fast-moving unicorn startup.
            </p>
            <div className="cs-stat-row">
              {["Curriculum Architecture", "Instructional Design", "Facilitation", "Stakeholder Strategy", "Program Design", "Learning Systems"].map((t) => (
                <span key={t} className="cs-stat-pill light">{t}</span>
              ))}
            </div>
          </div>
          <div className="cs-hero-bubble-wrap">
            <div className="cs-speech-bubble">
              <p className="cs-bubble-quote">{heroTestimonial.quote}</p>
              <p className="cs-bubble-name">— {heroTestimonial.name}, {heroTestimonial.role}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="cs-divider" />

      {/* CONTENT */}
      <div className="cs-content cs-content-wide" ref={contentRef}>

        {/* SECTION 1 — THE SITUATION */}
        <div className="cs-section">
          <p className="cs-section-label">THE SITUATION</p>
          <h2 className="cs-section-heading">
            Managers were the missing link.<br />
            <em>And the data knew it.</em>
          </h2>

          <div className="hm-triptych">
            <div className="hm-triptych-card">
              <img src={triptychRetention} alt="Retention illustration" className="hm-triptych-illustration" />
              <p className="hm-triptych-eyebrow">RETENTION</p>
              <h3 className="hm-triptych-title">Attrition<br />was climbing.</h3>
              <p className="hm-triptych-body">
                A bad onboarding makes new hires 2x more likely to leave. The data was loud.
              </p>
            </div>
            <div className="hm-triptych-card">
              <img src={triptychTooling} alt="Tooling illustration" className="hm-triptych-illustration" />
              <p className="hm-triptych-eyebrow">TOOLING</p>
              <h3 className="hm-triptych-title">New tool,<br />no playbook.</h3>
              <p className="hm-triptych-body">
                Lattice was live. Most managers had never opened it.
              </p>
            </div>
            <div className="hm-triptych-card">
              <img src={triptychReadiness} alt="Readiness illustration" className="hm-triptych-illustration" />
              <p className="hm-triptych-eyebrow">READINESS</p>
              <h3 className="hm-triptych-title">No map.<br />No handoff.<br />No language.</h3>
              <p className="hm-triptych-body">
                No shared framework. No structured handoff. Managers wanted to do right by their people — nothing showed them how.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '44px' }}>
            <p className="hm-triptych-closing" style={{ background: 'hsl(123, 16%, 82%)', borderRadius: '999px', padding: '16px 40px', display: 'inline-block' }}>
              The retention crisis was the burning platform. The opportunity was to give managers what they were missing.
            </p>
          </div>
        </div>

        {/* SECTION 2 — THE PHILOSOPHY */}
        <div className="cs-section hm-philosophy-section">
          <p className="cs-section-label">THE PHILOSOPHY</p>
          <h2 className="cs-section-heading">
            Launching people is a <em>values act.</em>
          </h2>
          <p className="hm-philosophy-body">
            I don't build training programs. I build human experiences that happen to teach something. Learning sat inside Workplace Experience at Happy Money — not beside it. That positioning shaped everything I built. Every framework, every tool, every facilitated moment was designed around one idea: launching people well is a values act.
          </p>
          <div className="hm-philosophy-pullquote">
            <hr className="hm-pullquote-rule" />
            <p className="hm-pullquote-text">"Someone thought about you before you arrived."</p>
            <hr className="hm-pullquote-rule" />
          </div>
        </div>

        {/* SECTION 3 — HOW I BUILD ZERO TO ONE */}
        <div className="cs-section">
          <p className="cs-section-label">How I Build Zero to One</p>
          <h2 className="cs-section-heading">
            Not one thing, then the next.<br />
            <em>Everything, in parallel.</em>
          </h2>
          <p className="cs-body-text">
            Most programs get built sequentially. I don't build that way. In the first two weeks — before a single session was facilitated — multiple workstreams were running simultaneously. This is the mental model I carry into every zero-to-one build.
          </p>

          {/* CONSTELLATION — SVG lines + HTML pill cards */}
          <div className="hm-constellation" ref={constellationRef}>
            {/* SVG layer — lines only */}
            <svg className="hm-constellation-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              {constellationNodes.map((_, i) => {
                const nc = getNodeCenter(i);
                return (
                  <line
                    key={i}
                    x1={cx} y1={cy}
                    x2={nc.x} y2={nc.y}
                    className={`hm-constellation-line ${constellationVisible ? "visible" : ""}`}
                    style={{ animationDelay: `${0.3 + i * 0.08}s` }}
                  />
                );
              })}
            </svg>

            {/* Center node */}
            <div className={`hm-center-node ${constellationVisible ? "visible" : ""}`}>
              <span className="hm-center-delivery">DELIVERY</span>
            </div>

            {/* 7 pill cards */}
            {constellationNodes.map((node, i) => (
              <div
                key={node.id}
                className={`hm-pill-card ${constellationVisible ? "visible" : ""} ${hoveredNode === i ? "hovered" : ""}`}
                style={{
                  top: nodePositions[i].top,
                  left: nodePositions[i].left,
                  transform: nodePositions[i].transform,
                  animationDelay: `${0.5 + i * 0.08}s`,
                }}
                onMouseEnter={() => setHoveredNode(i)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <span className="hm-pill-label">{node.label}</span>
                <span className="hm-pill-desc">{node.desc}</span>
              </div>
            ))}
          </div>

          {/* 4-PHASE RIBBON */}
          <div className="hm-ribbon">
            <div className="hm-ribbon-row">
              {phases.map((p, i) => (
                <div key={p.num} className="hm-ribbon-item">
                  <div className="hm-phase-card">
                    <span className="hm-phase-num">{p.num}</span>
                    <span className="hm-phase-title">{p.title}</span>
                    <span className="hm-phase-subtitle">{p.subtitle}</span>
                  </div>
                  {i < phases.length - 1 && (
                    <span className="hm-ribbon-arrow">→</span>
                  )}
                </div>
              ))}
            </div>
            {/* Return arrow */}
            <div className="hm-ribbon-return">
              <svg className="hm-ribbon-return-svg" viewBox="0 0 600 50" preserveAspectRatio="none">
                <path
                  d="M540,5 C580,5 590,25 590,25 C590,45 580,45 540,45 L60,45 C20,45 10,25 10,25 C10,5 20,5 60,5"
                  fill="none"
                  stroke="hsl(37, 65%, 47%)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0.5"
                />
              </svg>
              <span className="hm-ribbon-return-label">ITERATE · V1 → V2 → V3</span>
            </div>
            <p className="hm-ribbon-mantra">Try. Fail. Learn. Repeat.</p>
          </div>
        </div>

        {/* SECTION 4 — THE SYSTEM (Modules still flip cards) */}
        <div className="cs-section">
          <p className="cs-section-label">The System</p>
          <h2 className="cs-section-heading">
            Four modules.<br />
            <em>One connected experience.</em>
          </h2>
          <p className="cs-body-text">
            This wasn't a single training. It was a sequenced learning system — designed with prerequisites, a clear arc, and tools that lived beyond the classroom.
          </p>
          <p className="cs-body-text hm-flip-hint">Click any card to learn more →</p>

          <div className="hm-module-grid">
            {modules.map((m) => (
              <FlipCard
                key={m.num}
                front={
                  <>
                    <p className="hm-module-eyebrow">MODULE {m.num}</p>
                    <h3 className="hm-module-title">{m.title}</h3>
                    <p className="hm-flip-tagline">{m.tagline}</p>
                  </>
                }
                back={
                  <>
                    <p className="hm-module-eyebrow">MODULE {m.num}</p>
                    <h3 className="hm-flip-back-title">{m.title}</h3>
                    <p className="hm-flip-back-body">{m.body}</p>
                  </>
                }
              />
            ))}
          </div>

          {/* Original Frameworks — labeled list */}
          <div style={{ marginTop: 56 }}>
            <p className="cs-section-label">Original Frameworks</p>
            <h2 className="cs-section-heading">
              The language didn't exist.<br />
              <em>So I built it.</em>
            </h2>
            <div className="hm-labeled-list hm-labeled-list--sage">
              {frameworks.map((fw) => (
                <div key={fw.title} className="hm-labeled-item">
                  <p className="hm-labeled-name">{fw.title}</p>
                  <p className="hm-labeled-desc">{fw.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Tools — labeled list */}
          <div style={{ marginTop: 48 }}>
            <p className="cs-section-label">Operational Tools</p>
            <p className="cs-body-text">Three tools designed to live beyond the training.</p>
            <div className="hm-labeled-list hm-labeled-list--rose">
              {operationalTools.map((tool) => (
                <div key={tool.title} className="hm-labeled-item">
                  <p className="hm-labeled-name">{tool.title}</p>
                  <p className="hm-labeled-desc">{tool.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 5 — OUTCOMES */}
        <div className="cs-section">
          <p className="cs-section-label">Outcomes</p>
          <h2 className="cs-section-heading">
            Launched.<br />
            <em>Then the company changed.</em>
          </h2>
          <p className="cs-body-text">
            The program reached managers across Happy Money. Cohorts ran. Managers built their first launch plans in Lattice. The frameworks — The Handoff, The 411, The Dream Journey — entered the shared language of the People team.
          </p>
          <p className="cs-body-text">
            This was always intended to be one track in a larger manager development ecosystem. That ecosystem was still being architected when, approximately eight weeks after V1 launched, Happy Money underwent a significant reduction in force — approximately 40% of the company. Longitudinal outcome data was never collected.
          </p>
          <p className="cs-body-text">
            What exists instead: the artifacts, the frameworks, the tools, and the testimony of the people who were there.
          </p>

          {/* Eric's quote as section closer */}
          <div className="hm-outcomes-quote">
            <hr className="hm-outcomes-quote-rule" />
            <p className="hm-outcomes-quote-text">
              "She not only evolved Onboarding to become a world-class program but also enlisted interest and engagement from the business to participate and drive some of the content management...she showed up, got buy-in quickly and project managed the effort across many levels and groups to get to a beautiful final product, which was appreciated and felt by our entire company."
            </p>
            <p className="hm-outcomes-quote-attr">— Eric Saggese, Global People & Culture Leader · Senior Stakeholder</p>
            <hr className="hm-outcomes-quote-rule" />
          </div>
        </div>

        {/* SECTION 6 — WHAT THIS WORK REVEALS */}
        <div className="hm-reveals cs-section">
          <p className="hm-reveals-label">What This Work Reveals</p>
          <p className="hm-reveals-opening">
            This wasn't a curriculum project. It was a <em>systems build.</em>
          </p>
          <p className="hm-reveals-body">
            I came in with a business problem, a blank page, and about eight weeks. I left with a sequenced learning ecosystem, original frameworks that gave managers a shared language, operational tools that outlived the program, and a philosophy baked into every component: that launching people well is one of the most human things an organization can do.
          </p>
          <p className="hm-reveals-body">
            I don't build training. I build the infrastructure that makes culture visible — and gives people the tools to actually live it.
          </p>
          <p className="hm-reveals-closing">
            That's what zero to one looks like when it's done with intention.
          </p>
        </div>
      </div>

      {/* NEXT PROJECT */}
      <div className="cs-next-project" style={{ maxWidth: 1080 }}>
        <p className="cs-next-label">Next</p>
        <Link to="/" className="cs-next-link">
          <span className="cs-next-title">Slack AI Agent: Building in Public</span>
          <span className="cs-next-arrow">→</span>
        </Link>
      </div>

      {/* BOTTOM NAV */}
      <div className="cs-bottom-nav" style={{ maxWidth: 1080 }}>
        <button
          className="cs-bottom-nav-link"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑ Back to top
        </button>
      </div>

      {/* FAB */}
      <button
        ref={fabRef}
        className="cs-fab"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑
      </button>
    </>
  );
};

export default HappyMoney;
