import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";

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

/* ── Hero testimonials ── */
const heroTestimonials = [
  {
    quote: "It is rare to come across the combination of talent that Katie possesses. With a mind that is highly creative, innovative, and resourceful, and equally strategic and visionary, you get an explosive powerhouse that can bring incredible change, structure, process, and vision to an organization extremely quickly.",
    name: "Lauren Benton-Cissel",
    role: "Director of Talent Experience & Programs · Direct Manager",
  },
  {
    quote: "She not only evolved Onboarding to become a world-class program but also enlisted interest and engagement from the business to participate and drive some of the content management...she showed up, got buy-in quickly and project managed the effort across many levels and groups to get to a beautiful final product.",
    name: "Eric Saggese",
    role: "Global People & Culture Leader · Senior Stakeholder",
  },
];

/* ── Module data ── */
const modules = [
  { num: "01", title: "How We Launch", tagline: "60-min workshop on onboarding philosophy & the critical Handoff", body: "A 60-minute workshop covering Happy Money's onboarding philosophy, the OX experience, retention data, and the critical \"Handoff\" period between company onboarding and team integration. Required for all managers. Prerequisite for everything that follows." },
  { num: "02", title: "Building Launch Plans", tagline: "Hands-on session building real First 30 plans in Lattice", body: "A 60-minute hands-on workshop where managers built their actual First 30 launch plan inside Lattice — the company's new performance management tool. Not theory. Live work time with facilitated support." },
  { num: "03", title: "Coaching New Peeps", tagline: "Peer-to-peer manager panel surfacing tacit knowledge", body: "A 45-minute manager discussion panel — peer-to-peer learning from managers who were already launching well. Designed to surface tacit knowledge, build cross-functional connection, and give managers a space to learn from each other." },
  { num: "04", title: "Launching Managers", tagline: "Advanced session for managers of managers", body: "A 60-minute advanced session for managers of managers. Covered team integration, cultural alignment, growth mindset, and Happy Money's commitment to Radical Belonging. Required Core Strengths as a prerequisite." },
];

/* ── Framework data ── */
const frameworks = [
  { title: "The Handoff", tagline: "The critical gap between company onboarding and the team", desc: "The critical gap between company onboarding and team integration", body: "Visualized as a bridge that managers and new hires cross together. Made the invisible transition visible and gave managers a shared mental model for their role in it." },
  { title: "The 411", tagline: "A first-1:1 framework built around six questions", desc: "A first-1:1 framework built around six questions", body: "Who, What, Where, Why, When, and How. Gave managers a practical structure for that first conversation that covered expectations, context, belonging, and purpose." },
  { title: "The Dream Journey", tagline: "A day-by-day roadmap for a manager's first 30 days", desc: "A day-by-day, week-by-week roadmap for a manager's first 30 days", body: "From \"quiet prep days\" during OX to walking meetings in Week 3. Concrete, human, and grounded in what actually makes people feel welcomed." },
];

/* ── Operational tools data ── */
const operationalTools = [
  { title: "Launch Plan: The First 30", tagline: "Structured onboarding checklist living in Lattice", body: "A structured onboarding checklist for new hires — covering culture integration, relationship building, team tools, and 30-day goals. Lived in Lattice as a reusable manager template." },
  { title: "Manager Checklist", tagline: "Day-by-day action guide from pre-start through Week 4", body: "A day-by-day action guide for managers from pre-start-date through Week 4. Built to eliminate the \"I don't know what to do\" problem entirely." },
  { title: "New Hire Scavenger Hunt", tagline: "Customizable discovery tool for new hires' first 30 days", body: "A customizable discovery tool for new hires covering their first 30 days — from Slack channels to wellness resources to cross-functional meet-and-greets. Designed to make culture integration feel like exploration, not orientation." },
];

/* ── Infinite loop phases ── */
const loopPhases = [
  { label: "Discovery &\nAlignment", short: "Discover" },
  { label: "Architecture &\nDesign", short: "Design" },
  { label: "Build &\nFacilitation", short: "Build" },
  { label: "Pilot &\nLaunch", short: "Launch" },
];

/* ── FlipCard component ── */
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
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeQuote, setActiveQuote] = useState(0);

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

  /* Auto-rotate hero testimonials */
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQuote((prev) => (prev + 1) % heroTestimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  /* ── Constellation geometry ── */
  const cx = 300, cy = 220, r = 170;
  const nodePositions = constellationNodes.map((_, i) => {
    const angle = (Math.PI * 2 * i) / constellationNodes.length - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

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

      {/* HERO */}
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
              <div className="cs-testimonial-rotator">
                {heroTestimonials.map((t, i) => (
                  <div key={i} className={`cs-testimonial-slide ${i === activeQuote ? "active" : ""}`}>
                    <p className="cs-bubble-quote">"{t.quote}"</p>
                    <p className="cs-bubble-name">— {t.name}, {t.role}</p>
                  </div>
                ))}
              </div>
              <div className="cs-testimonial-dots">
                {heroTestimonials.map((_, i) => (
                  <button
                    key={i}
                    className={`cs-testimonial-dot ${i === activeQuote ? "active" : ""}`}
                    onClick={() => setActiveQuote(i)}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="cs-divider" />

      {/* CONTENT */}
      <div className="cs-content cs-content-wide" ref={contentRef}>

        {/* SECTION 1 — THE SITUATION */}
        <div className="cs-section">
          <p className="cs-section-label">The Situation</p>
          <h2 className="cs-section-heading">
            Managers were the missing link.<br />
            <em>And the data knew it.</em>
          </h2>
          <p className="cs-body-text">
            Happy Money was a fast-growing fintech startup with a culture it was proud of — and a retention problem it couldn't ignore.
          </p>
          <p className="cs-body-text" style={{ fontWeight: 500, color: "hsl(var(--forest))", marginBottom: 12 }}>
            Three things were happening at once:
          </p>
          <div className="hm-situation-items">
            <div className="hm-situation-item">
              <span className="hm-situation-num">01</span>
              <div>
                <p className="hm-situation-title">Attrition was climbing.</p>
                <p className="cs-body-text">
                  Industry data was clear: a negative onboarding experience makes new hires 2x more likely to leave. As an Onboarding team of one, I had built something exceptional for Day 1-3. But what happened after that — when new hires crossed over to their managers — was largely unstructured.
                </p>
              </div>
            </div>
            <div className="hm-situation-item">
              <span className="hm-situation-num">02</span>
              <div>
                <p className="hm-situation-title">A new tool, no training.</p>
                <p className="cs-body-text">
                  The company had recently adopted Lattice as its performance management and 1:1 platform. Managers were expected to use it to build and track new hire launch plans. Most had no idea how.
                </p>
              </div>
            </div>
            <div className="hm-situation-item">
              <span className="hm-situation-num">03</span>
              <div>
                <p className="hm-situation-title">Managers were flying blind.</p>
                <p className="cs-body-text">
                  There was no shared framework for how to onboard a new team member. No consistent language. No structured handoff between company onboarding and team integration. Managers wanted to do right by their people — they just didn't have the infrastructure to do it well.
                </p>
              </div>
            </div>
          </div>
          <p className="cs-body-text" style={{ marginTop: 20 }}>
            The retention crisis was the burning platform. The opportunity was to give managers the knowledge, tools, and confidence to close the gap.
          </p>
        </div>

        {/* SECTION 2 — THE PHILOSOPHY */}
        <div className="cs-section">
          <p className="cs-section-label">The Philosophy</p>
          <h2 className="cs-section-heading">
            Launching people is a <em>values act.</em>
          </h2>
          <p className="cs-body-text">
            Before a single slide was built or a single stakeholder was interviewed, there was a frame.
          </p>
          <p className="cs-body-text">
            I don't build training programs. I build human experiences that happen to teach something. The distinction matters — because the difference between a manager who launches a new hire well and one who doesn't isn't usually knowledge. It's intention. It's culture. It's whether the team they're walking into feels like a place where they belong.
          </p>
          <p className="cs-body-text">
            At Happy Money, learning sat inside Workplace Experience and People & Culture — not in a silo beside it. That positioning shaped everything. A checklist isn't just a to-do list. A launch plan isn't just a Lattice template. They're signals. They tell a new person: <em>someone thought about you before you arrived.</em>
          </p>
          <p className="cs-body-text">
            Every component of this program — every framework, every tool, every facilitated moment — was designed to make that signal louder.
          </p>
          <div className="hm-philosophy-callout">
            <p className="cs-body-text" style={{ marginBottom: 0 }}>
              I build at the intersection of people and possibility. Even the most operational thing I design is a human experience in disguise.
            </p>
          </div>
        </div>

        {/* SECTION 3 — THE BUILD / CONSTELLATION + INFINITE LOOP */}
        <div className="cs-section">
          <p className="cs-section-label">How I Build Zero to One</p>
          <h2 className="cs-section-heading">
            Not one thing, then the next.<br />
            <em>Everything, in parallel.</em>
          </h2>
          <p className="cs-body-text">
            Most programs get built sequentially. I don't build that way. In the first two weeks — before a single session was facilitated — multiple workstreams were running simultaneously. This is the mental model I carry into every zero-to-one build.
          </p>

          {/* Desktop: SVG constellation */}
          <div className="hm-constellation-wrap" ref={constellationRef}>
            <svg
              className={`hm-constellation ${constellationVisible ? "visible" : ""}`}
              viewBox="0 0 600 440"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Lines from center to nodes */}
              {nodePositions.map((pos, i) => (
                <line
                  key={`line-${i}`}
                  className={`hm-constellation-line ${constellationVisible ? "draw" : ""}`}
                  x1={cx} y1={cy} x2={pos.x} y2={pos.y}
                  style={{ animationDelay: `${0.3 + i * 0.12}s` }}
                />
              ))}
              {/* Cross-connections for web feel */}
              {[
                [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [0, 3], [2, 5]
              ].map(([a, b], i) => (
                <line
                  key={`cross-${i}`}
                  className={`hm-constellation-crossline ${constellationVisible ? "draw" : ""}`}
                  x1={nodePositions[a].x} y1={nodePositions[a].y}
                  x2={nodePositions[b].x} y2={nodePositions[b].y}
                  style={{ animationDelay: `${0.8 + i * 0.08}s` }}
                />
              ))}
              {/* Center node */}
              <g className={`hm-center-node ${constellationVisible ? "visible" : ""}`}>
                <circle cx={cx} cy={cy} r={38} />
                <text x={cx} y={cy - 6} textAnchor="middle" className="hm-center-label">V1</text>
                <text x={cx} y={cy + 12} textAnchor="middle" className="hm-center-sublabel">DELIVERY</text>
              </g>
              {/* Outer nodes */}
              {constellationNodes.map((node, i) => (
                <g
                  key={node.id}
                  className={`hm-outer-node ${constellationVisible ? "visible" : ""} ${hoveredNode === node.id ? "hovered" : ""}`}
                  style={{ animationDelay: `${0.4 + i * 0.12}s` }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle cx={nodePositions[i].x} cy={nodePositions[i].y} r={hoveredNode === node.id ? 30 : 26} />
                  <text x={nodePositions[i].x} y={nodePositions[i].y + 4} textAnchor="middle" className="hm-node-label">
                    {node.label.length > 14 ? node.label.split(" ").slice(0, 2).join(" ") : node.label}
                  </text>
                  {hoveredNode === node.id && (
                    <foreignObject
                      x={nodePositions[i].x - 90}
                      y={nodePositions[i].y + 34}
                      width={180}
                      height={60}
                    >
                      <div className="hm-node-desc">{node.desc}</div>
                    </foreignObject>
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* Mobile: Stacked nodes */}
          <div className="hm-constellation-mobile">
            {constellationNodes.map((node, i) => (
              <div key={node.id} className="hm-mobile-node cs-section" style={{ marginBottom: 0 }}>
                <div className="hm-mobile-node-dot" />
                {i < constellationNodes.length - 1 && <div className="hm-mobile-node-line" />}
                <div className="hm-mobile-node-content">
                  <p className="hm-mobile-node-label">{node.label}</p>
                  <p className="hm-mobile-node-desc">{node.desc}</p>
                </div>
              </div>
            ))}
            <div className="hm-mobile-center-node">
              <span>V1 DELIVERY</span>
            </div>
          </div>

          {/* Infinite Loop Visual — replaces timeline */}
          <div className="hm-loop-wrap">
            <svg className="hm-loop-svg" viewBox="0 0 900 360" xmlns="http://www.w3.org/2000/svg">
              {/* Figure-8 / infinity path — wider lobes */}
              <path
                className="hm-loop-track"
                d="M 200,180 C 200,60 450,60 450,180 C 450,300 700,300 700,180 C 700,60 450,60 450,180 C 450,300 200,300 200,180 Z"
                fill="none"
              />
              <path
                className="hm-loop-runner"
                d="M 200,180 C 200,60 450,60 450,180 C 450,300 700,300 700,180 C 700,60 450,60 450,180 C 450,300 200,300 200,180 Z"
                fill="none"
              />

              {/* Phase labels — positioned OUTSIDE the loop */}
              {/* Left: Discovery & Alignment */}
              <circle cx="200" cy="180" r="8" className="hm-loop-dot" />
              <text x="120" y="175" textAnchor="middle" className="hm-loop-phase-label">Discovery &amp;</text>
              <text x="120" y="195" textAnchor="middle" className="hm-loop-phase-label">Alignment</text>

              {/* Top: Architecture & Design */}
              <circle cx="325" cy="95" r="8" className="hm-loop-dot" style={{ animationDelay: "1.5s" }} />
              <text x="325" y="50" textAnchor="middle" className="hm-loop-phase-label">Architecture &amp;</text>
              <text x="325" y="70" textAnchor="middle" className="hm-loop-phase-label">Design</text>

              {/* Right: Build & Facilitation */}
              <circle cx="700" cy="180" r="8" className="hm-loop-dot" style={{ animationDelay: "3s" }} />
              <text x="785" y="175" textAnchor="middle" className="hm-loop-phase-label">Build &amp;</text>
              <text x="785" y="195" textAnchor="middle" className="hm-loop-phase-label">Facilitation</text>

              {/* Bottom: Pilot & Launch */}
              <circle cx="575" cy="265" r="8" className="hm-loop-dot" style={{ animationDelay: "4.5s" }} />
              <text x="575" y="310" textAnchor="middle" className="hm-loop-phase-label">Pilot &amp;</text>
              <text x="575" y="330" textAnchor="middle" className="hm-loop-phase-label">Launch</text>

              {/* Center crossing point — iteration marker */}
              <circle cx="450" cy="180" r="38" className="hm-loop-center" />
              <text x="450" y="176" textAnchor="middle" className="hm-loop-center-text">ITERATE</text>
              <text x="450" y="196" textAnchor="middle" className="hm-loop-center-sub">V1 → V2 → V3</text>
            </svg>
            <p className="hm-loop-mantra">Try. Learn. Improve. Repeat.</p>
          </div>

          {/* Mobile: vertical loop */}
          <div className="hm-loop-mobile">
            {loopPhases.map((phase, i) => (
              <div key={i} className="hm-loop-mobile-phase">
                <div className="hm-loop-mobile-marker">{i + 1}</div>
                <span className="hm-loop-mobile-label">{phase.short}</span>
                {i < loopPhases.length - 1 && <span className="hm-loop-mobile-arrow">→</span>}
              </div>
            ))}
            <div className="hm-loop-mobile-return">
              <span>↩ Loop back — V1 → V2 → V3</span>
            </div>
            <p className="hm-loop-mantra">Try. Learn. Improve. Repeat.</p>
          </div>
        </div>

        {/* SECTION 4 — WHAT GOT BUILT (Flip Cards) */}
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

          {/* Original Frameworks */}
          <div style={{ marginTop: 56 }}>
            <p className="cs-section-label">Original Frameworks</p>
            <h2 className="cs-section-heading">
              The language didn't exist.<br />
              <em>So I built it.</em>
            </h2>
            <p className="cs-body-text">
              Three frameworks created from scratch and woven through the entire program:
            </p>
            <p className="hm-flip-hint">Click any card to learn more</p>
            <div className="hm-framework-grid">
              {frameworks.map((fw) => (
                <FlipCard
                  key={fw.title}
                  className="hm-flip-framework"
                  front={
                    <>
                      <h3 className="hm-framework-title">{fw.title}</h3>
                      <p className="hm-flip-tagline">{fw.tagline}</p>
                    </>
                  }
                  back={
                    <>
                      <h3 className="hm-flip-back-title">{fw.title}</h3>
                      <p className="hm-flip-back-body">{fw.body}</p>
                    </>
                  }
                />
              ))}
            </div>
          </div>

          {/* Operational Tools */}
          <div style={{ marginTop: 48 }}>
            <p className="cs-section-label">Operational Tools</p>
            <p className="cs-body-text">Three tools designed to live beyond the training:</p>
            <div className="hm-framework-grid">
              {operationalTools.map((tool) => (
                <FlipCard
                  key={tool.title}
                  className="hm-flip-framework"
                  front={
                    <>
                      <h3 className="hm-framework-title">{tool.title}</h3>
                      <p className="hm-flip-tagline">{tool.tagline}</p>
                    </>
                  }
                  back={
                    <>
                      <h3 className="hm-flip-back-title">{tool.title}</h3>
                      <p className="hm-flip-back-body">{tool.body}</p>
                    </>
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 5 — IN THEIR WORDS — REMOVED (quotes moved to hero) */}

        {/* SECTION 6 — HONEST OUTCOMES */}
        <div className="cs-section">
          <p className="cs-section-label">Outcomes</p>
          <h2 className="cs-section-heading">
            Launched. <em>Then the company changed.</em>
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

          <div className="hm-proved-list">
            <p className="cs-body-text" style={{ fontWeight: 500, color: "hsl(var(--forest))", marginBottom: 12 }}>What the build proved:</p>
            <ul className="cs-engagement-list">
              <li>A four-module curriculum system can go from zero to facilitated in 8 weeks</li>
              <li>Cross-functional alignment (L&D, People Ops, HRBPs, Recruiting) is achievable without a large team</li>
              <li>Operational tools that live beyond the training room create durable value even when programs are discontinued</li>
              <li>A program designed with care is felt — even if it can't yet be measured</li>
            </ul>
          </div>
        </div>

        {/* SECTION 7 — WHAT THIS WORK REVEALS */}
        <div className="cs-so-what cs-section">
          <p className="cs-so-what-label">What This Work Reveals</p>
          <p className="cs-so-what-text">
            This wasn't a curriculum project. It was a <em>systems build.</em>
          </p>
          <p className="cs-so-what-text" style={{ marginTop: 16 }}>
            I came in with a business problem, a blank page, and about eight weeks. I left with a sequenced learning ecosystem, original frameworks that gave managers a shared language, operational tools that outlived the program, and a philosophy baked into every component: that launching people well is one of the most human things an organization can do.
          </p>
          <p className="cs-so-what-text" style={{ marginTop: 16 }}>
            I don't build training. I build the infrastructure that makes culture visible — and gives people the tools to actually live it.
          </p>
          <p className="cs-so-what-text" style={{ marginTop: 16 }}>
            <em>That's what zero to one looks like when it's done with intention.</em>
          </p>
          <div style={{ marginTop: 32 }}>
            <a
              href="https://www.linkedin.com/in/katieharwood2/"
              target="_blank"
              rel="noopener noreferrer"
              className="hm-cta-button"
            >
              → Let's talk about what I can build for your team
            </a>
          </div>
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
