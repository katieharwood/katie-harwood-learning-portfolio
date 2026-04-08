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
          <p className="cs-section-label">THE SITUATION</p>
          <h2 className="cs-section-heading">
            Managers were the missing link.<br />
            <em>And the data knew it.</em>
          </h2>

          <div className="hm-triptych">
            {/* Card 01 */}
            <div className="hm-triptych-card">
              <div className="hm-triptych-illus" />
              <p className="hm-triptych-eyebrow">RETENTION</p>
              <h3 className="hm-triptych-title">Attrition<br />was climbing.</h3>
              <p className="hm-triptych-body">
                A bad onboarding makes new hires 2x more likely to leave. The data was loud.
              </p>
            </div>

            {/* Card 02 */}
            <div className="hm-triptych-card">
              <div className="hm-triptych-illus" />
              <p className="hm-triptych-eyebrow">TOOLING</p>
              <h3 className="hm-triptych-title">New tool,<br />no playbook.</h3>
              <p className="hm-triptych-body">
                Lattice was live. Most managers had never opened it.
              </p>
            </div>

            {/* Card 03 */}
            <div className="hm-triptych-card">
              <div className="hm-triptych-illus" />
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

          {/* Two-panel side-by-side layout */}
          <div className="hm-zero-to-one-grid" ref={constellationRef}>
            {/* LEFT: Iterative Version Delivery */}
            <div className="hm-version-panel">
              <h3 className="hm-panel-title">Iterative Version Delivery</h3>
              <div className="hm-workstream-grid">
                {constellationNodes.map((node, i) => (
                  <div
                    key={node.id}
                    className={`hm-workstream-card ${constellationVisible ? "visible" : ""}`}
                    style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                  >
                    <div className="hm-workstream-dot" />
                    <div>
                      <p className="hm-workstream-name">{node.label}</p>
                      <p className="hm-workstream-desc">{node.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: The Iteration Engine */}
            <div className="hm-engine-panel">
              <h3 className="hm-panel-title">The Iteration Engine</h3>
              <div className="hm-engine-container">
                {/* Dotted circular arrow overlay */}
                <svg className="hm-circle-arrow" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                  <circle
                    cx="150" cy="150" r="120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeDasharray="10,7"
                    strokeLinecap="round"
                  />
                  {/* Arrowhead extending outward from the circle path (clockwise direction at top) */}
                  <polygon points="150,18 157,30 143,30" fill="currentColor" />
                </svg>

                <div className="hm-engine-grid">
                  {loopPhases.map((phase, i) => (
                    <div key={i} className="hm-engine-card">
                      <span className="hm-engine-num">{String(i + 1).padStart(2, "0")}</span>
                      <p className="hm-engine-short">{phase.short}</p>
                      <p className="hm-engine-full">{phase.label.replace("\n", " ")}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="hm-engine-mantra">Try. Fail. Learn. Repeat.</p>
            </div>
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
