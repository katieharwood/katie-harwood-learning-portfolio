import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const UserGuideVilt = () => {
  const fabRef = useRef<HTMLButtonElement>(null);

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

    const handleScroll = () => {
      fabRef.current?.classList.toggle("visible", window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    window.scrollTo(0, 0);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const voicesFromTheRoom = [
    {
      quote: "WOW are any of my other NDs feeling some weight as you respond? This is a powerful tool.",
      name: "Manager",
      role: "",
    },
    {
      quote: "The magic is that this tool is powerful for neurodivergent and neurotypical folks alike.",
      name: "Manager",
      role: "",
    },
    {
      quote: "I have ADHD and struggle with how to explain how my brain works.",
      name: "Independent Contributor",
      role: "",
    },
    {
      quote: "I think every Evolver should have a personalized User Guide.",
      name: "Independent Contributor",
      role: "",
    },
  ];

  return (
    <>
      {/* NAV */}
      <nav className="cs-nav">
        <Link to="/" className="cs-nav-back">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2L4 7L9 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          All Work
        </Link>
        <Link to="/" className="cs-nav-label">
          Katie Harwood Portfolio
        </Link>
      </nav>

      {/* HERO - wider layout */}
      <section className="cs-hero cs-hero-wide">
        <p className="cs-case-label">Case Study 03</p>
        <h1 className="cs-hero-title">
          Build Your User Guide
          <br />
          <em>with an AI Assistant</em>
        </h1>
        <p className="cs-hero-subtitle">
          A hands-on workshop to build high-performing teams.
        </p>
        <div className="cs-stat-row">
          <span className="cs-stat-pill light">60-min Live Workshop</span>
          <span className="cs-stat-pill light">AI-Powered</span>
          <span className="cs-stat-pill light">95% Belonging</span>
        </div>
      </section>

      <div className="cs-divider" />

      {/* CONTENT - wider layout */}
      <div className="cs-content cs-content-wide">
        {/* SITUATION + SPEED BLOCK side by side */}
        <div className="cs-section cs-two-col">
          <div className="cs-two-col-main">
            <p className="cs-section-label">The Situation</p>
            <h2 className="cs-section-heading">
              Communication is personal.
              <br />
              <em>Most teams never talk about it.</em>
            </h2>
            <p className="cs-body-text">
              Teams perform best when people feel safe enough to say how they actually work — 
              their stress signals, communication preferences, and what they need to do their best work. 
              But most teams never have that conversation. This hands-on session turns invisible 
              preferences into clear, professional language teammates and managers can actually use.
            </p>
            <div className="cs-mapping-callout">
              <p className="cs-mapping-label">Why This Matters</p>
              <p className="cs-mapping-text">
                Psychological safety is the <strong>#1 factor in team effectiveness</strong> (Google's Project Aristotle). 
                A User Guide isn't just a nice-to-have — it's <strong>actionable infrastructure</strong> for 
                how teams communicate, especially when diverse working styles are in play.
              </p>
            </div>
          </div>
          <div className="cs-two-col-side">
            <div className="cs-speed-block cs-speed-stacked">
              <div className="cs-speed-number" style={{ fontSize: "2.2rem", lineHeight: 1.1 }}>
                From Intro to Built
                <br />
                in 60 Minutes
              </div>
              <div className="cs-speed-text">
                <p className="cs-speed-body">
                  Facilitated live for the Evolve Neurodynamic ERG during Neurodiversity 
                  Celebration Week — March 31, 2026. Every participant left with a tangible 
                  artifact they could immediately share with their team.
                </p>
                <ul className="cs-speed-list">
                  
                  <li>100% Left with Artifact</li>
                  <li>Live Facilitation</li>
                  <li>ERG Partnership</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* LEARNING OBJECTIVES */}
        <div className="cs-section">
          <p className="cs-section-label">What Participants Learned</p>
          <h2 className="cs-section-heading">
            Four learning objectives.
            <br />
            <em>One transformative hour.</em>
          </h2>
          <p className="cs-body-text">
            The session was designed around four clear outcomes — each building on the last, 
            moving from understanding to action.
          </p>

          <div className="cs-thread-grid cs-thread-grid-2col">
            <div className="cs-thread">
              <p className="cs-thread-number">01 · Understand Psychological Safety</p>
              <h3 className="cs-thread-title">
                The #1 factor in <em>team effectiveness</em>
              </h3>
              <p className="cs-thread-body">
                Learn why psychological safety is the #1 factor in team effectiveness 
                and how a User Guide serves as actionable infrastructure for it.
              </p>
            </div>

            <div className="cs-thread accent">
              <p className="cs-thread-number">02 · Build a Personal User Guide</p>
              <h3 className="cs-thread-title">
                Document your working style
                <br />
                <em>with AI as your co-author</em>
              </h3>
              <p className="cs-thread-body">
                Use AI to identify and document your unique working style, communication 
                needs, and stress signals — turning self-knowledge into something shareable.
              </p>
            </div>

            <div className="cs-thread">
              <p className="cs-thread-number">03 · Support Diverse Teams</p>
              <h3 className="cs-thread-title">
                Explicit communication helps
                <br />
                <em>everyone perform better</em>
              </h3>
              <p className="cs-thread-body">
                Discover how explicit communication supports neurodivergent (and neurotypical) 
                colleagues and helps all employees perform better.
              </p>
            </div>

            <div className="cs-thread accent">
              <p className="cs-thread-number">04 · Leverage AI for Self-Reflection</p>
              <h3 className="cs-thread-title">
                Complex preferences,
                <br />
                <em>clear professional language</em>
              </h3>
              <p className="cs-thread-body">
                Experience how AI can help put complex personal preferences into clear, 
                professional language — making the invisible visible.
              </p>
            </div>
          </div>
        </div>

        {/* RESULTS + WORD CLOUD side by side */}
        <div className="cs-section cs-two-col">
          <div className="cs-two-col-main">
            <p className="cs-section-label">Session Impact</p>

            <div className="cs-results-grid">
              <div className="cs-result-card">
                <div className="cs-result-number">
                  95<em>%</em>
                </div>
                <div className="cs-result-label">
                  Felt more comfortable sharing how they work
                </div>
              </div>
              <div className="cs-result-card">
                <div className="cs-result-number">
                  88<em>%</em>
                </div>
                <div className="cs-result-label">
                  Of managers plan to run this with their teams
                </div>
              </div>
              <div className="cs-result-card">
                <div className="cs-result-number">
                  91<em>%</em>
                </div>
                <div className="cs-result-label">
                  Will continue building or share their User Guide
                </div>
              </div>
              <div className="cs-result-card">
                <div className="cs-result-number">
                  100<em>%</em>
                </div>
                <div className="cs-result-label">
                  Left the session with a tangible artifact started in session
                </div>
              </div>
            </div>
          </div>
          <div className="cs-two-col-side">
            
            <p className="cs-body-text" style={{ fontSize: "0.82rem", marginBottom: "16px" }}>
              How did it feel to use AI to build a personal document like this?
            </p>
            <div className="cs-word-cloud">
              <span className="cs-word xl">empowering</span>
              <span className="cs-word xl bold">validated</span>
              <span className="cs-word lg">cathartic</span>
              <span className="cs-word lg">introspective</span>
              <span className="cs-word lg">supportive</span>
              <span className="cs-word md">amazing</span>
              <span className="cs-word sm">therapeutic</span>
              <span className="cs-word sm">scary</span>
              <span className="cs-word sm">vulnerable</span>
              <span className="cs-word sm">hopeful</span>
              <span className="cs-word sm">clarity</span>
              <span className="cs-word sm">educative</span>
              <span className="cs-word sm">comforting</span>
            </div>
          </div>
        </div>

        {/* VOICES FROM THE ROOM */}
        <div className="cs-testimonials cs-section">
          <p className="cs-testimonials-label">Voices from the Room</p>
          <div className="cs-testimonial-grid cs-testimonial-grid-2col">
            {voicesFromTheRoom.map((v, i) => (
              <div className="cs-testimonial-card" key={i}>
                <p className="cs-testimonial-quote">{v.quote}</p>
                <div className="cs-testimonial-attribution">
                  <span className="cs-testimonial-name">{v.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KEY ENGAGEMENT SIGNALS */}
        <div className="cs-section">
          <p className="cs-section-label">Key Engagement Signals</p>
          <div className="cs-mapping-callout">
            <ul className="cs-engagement-list">
              <li>Manager shared tool with team before session ended</li>
              <li>Participants defined psychological safety unprompted</li>
              <li>41% poll: need processing time before responding</li>
              <li>22 survey responses (44% response rate) — 64% ICs / 36% Managers</li>
            </ul>
          </div>
        </div>

        {/* VIDEO PLACEHOLDER */}
        <div className="cs-section">
          <p className="cs-section-label">Session Recording</p>
          <div className="cs-video-placeholder">
            <div className="cs-video-play">▶</div>
            <p className="cs-video-text">Session recording coming soon</p>
          </div>
        </div>

        {/* SO WHAT */}
        <div className="cs-so-what cs-section">
          <p className="cs-so-what-label">What This Work Reveals</p>
          <p className="cs-so-what-text">
            This wasn't a deck and a debrief. It was a live experience where people did 
            real work on themselves — with AI as a thinking partner, not a gimmick. 
            The User Guide is infrastructure:{" "}
            <em>something teams can actually use</em> to communicate better, 
            support neurodivergent colleagues, and build the kind of psychological safety
            <em> that shows up in how people actually work together.</em>
          </p>
        </div>
      </div>

      {/* NEXT PROJECT */}
      <div className="cs-next-project">
        <p className="cs-next-label">Next</p>
        <Link to="/elevate" className="cs-next-link">
          <span className="cs-next-title">
            Elevate: Manager Leadership Program
          </span>
          <span className="cs-next-arrow">→</span>
        </Link>
      </div>

      {/* BOTTOM NAV */}
      <div className="cs-bottom-nav">
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

export default UserGuideVilt;
