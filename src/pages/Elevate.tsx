import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Elevate = () => {
  const contentRef = useRef<HTMLDivElement>(null);
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

    // Scroll to top on mount
    window.scrollTo(0, 0);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

      {/* HERO */}
      <section className="cs-hero">
        <p className="cs-case-label">Case Study 01</p>
        <h1 className="cs-hero-title">
          Elevate: Manager
          <br />
          <em>Leadership Program</em>
        </h1>
        <p className="cs-hero-subtitle">
          Award-winning leadership development at enterprise scale.
        </p>
        <div className="cs-stat-row">
          <span className="cs-stat-pill award">🏆 Brandon Hall Gold</span>
          <span className="cs-stat-pill light">90+ NPS</span>
          <span className="cs-stat-pill light">1,000+ Participants</span>
          <span className="cs-stat-pill light">Global Delivery</span>
        </div>
      </section>

      <div className="cs-divider" />

      {/* CONTENT */}
      <div className="cs-content" ref={contentRef}>
        {/* SITUATION */}
        <div className="cs-section">
          <p className="cs-section-label">The Situation</p>
          <h2 className="cs-section-heading">
            An award-winning program.
            <br />
            <em>A pivotal moment.</em>
          </h2>
          <p className="cs-body-text">
            Elevate had already earned industry recognition as one of the most
            effective frontline manager programs at enterprise scale. Then a new
            enterprise skills mandate arrived — and the business was moving fast
            into AI, Agentforce, and a new model of what leadership required. I
            inherited something great and{" "}
            <span className="cs-owned">owned making it even better.</span>
          </p>
          <div className="cs-mapping-callout">
            <p className="cs-mapping-label">Instructional Design Rigor</p>
            <p className="cs-mapping-text">
              Before touching a single session, I did the foundational work:{" "}
              <strong>
                skill mapping and behavioral shift mapping
              </strong>{" "}
              against the new enterprise mandate. When senior leaders asked
              "Where does AI fluency show up? Where does storytelling show up?" —
              I had the answer ready. Because I'd built the map before anyone
              asked.
            </p>
          </div>
        </div>

        {/* SPEED */}
        <div className="cs-section">
          <div className="cs-speed-block">
            <div className="cs-speed-number">4–6</div>
            <div className="cs-speed-text">
              <p className="cs-speed-headline">
                Weeks to redesign, build, and launch
              </p>
              <p className="cs-speed-body">
                Four to six weeks from brief to first cohort kickoff — with
                three more builds shipping in parallel while the program was
                live. No missed deadlines.
              </p>
              <ul className="cs-speed-list">
                <li>Refreshed Pod 2</li>
                <li>Ask Agent Elevate</li>
                <li>Fireside Chat</li>
                <li>Gemini Leadership Coach</li>
              </ul>
            </div>
          </div>
        </div>

        {/* WHAT I DID */}
        <div className="cs-section">
          <p className="cs-section-label">What I Did</p>
          <h2 className="cs-section-heading">
            Four threads.
            <br />
            <em>One coherent story.</em>
          </h2>
          <p className="cs-body-text">
            The work wasn't one thing. It was a program rebuild, two AI builds,
            and a creative event — running in parallel, all pointing at the same
            north star.
          </p>

          <div className="cs-thread-grid">
            <div className="cs-thread">
              <p className="cs-thread-number">01 · The Program Refresh</p>
              <h3 className="cs-thread-title">
                Rebuilding Pod 2 for the AI moment
              </h3>
              <p className="cs-thread-body">
                The program was anchored around a simulation with peer-to-peer
                pods on either side. Participant feedback was clear: the final
                pod needed to shift. I rebuilt Pod 2 from scratch — recentering
                it around coaching, not content delivery. Zero to one, new
                design, new facilitation arc, new outcomes. Delivered in
                partnership with BTS design partners, in a compressed timeline,
                while the rest of the program was live.
              </p>
              <div className="cs-thread-tags">
                <span className="cs-thread-tag">Curriculum design</span>
                <span className="cs-thread-tag">Feedback-driven rebuild</span>
                <span className="cs-thread-tag">Global delivery</span>
                <span className="cs-thread-tag">Stakeholder management</span>
              </div>
            </div>

            <div className="cs-thread accent">
              <p className="cs-thread-number">
                02 · AI Build · Ask Agent Elevate
              </p>
              <h3 className="cs-thread-title">
                Customer zero.
                <br />
                <em>Built in public.</em>
              </h3>
              <p className="cs-thread-body">
                When Salesforce launched Agentforce, I volunteered as customer
                zero. Taught myself by doing — iterating, hitting walls, pulling
                in SMEs. No pretense of having it figured out. Built Ask Agent
                Elevate: a Slack Channel Knowledge Agent deployed to 1,000+
                participants. Rollout message: "We're all figuring this out —
                give feedback and we'll iterate." Honesty built trust. Colleagues
                came to learn. Agents spread across the team.
              </p>
              <div className="cs-thread-tags">
                <span className="cs-thread-tag">
                  85% autonomous resolution
                </span>
                <span className="cs-thread-tag">Agentforce</span>
                <span className="cs-thread-tag">Enterprise AI blueprint</span>
                <span className="cs-thread-tag">Named AI Champion</span>
              </div>
            </div>

            <div className="cs-thread coming-soon">
              <p className="cs-thread-number">
                03 · AI Build · Gemini Leadership Coach
              </p>
              <h3 className="cs-thread-title">
                Post-program AI coaching,
                <br />
                <em>built for every participant</em>
              </h3>
              <p className="cs-thread-body">
                After the program ended, the learning didn't have to. I built a
                Gemini Gem — a personalized AI leadership coach every alumnus
                could configure with their own development goals, personality
                assessments, and coaching focus. Grounded in Elevate principles.
                A confidential thought partner for what comes after. I wrote the
                setup guide from scratch and rolled it out clean. Pilot adoption
                hit 80%.
              </p>
              <div className="cs-thread-tags">
                <span className="cs-thread-tag">80% pilot adoption</span>
                <span className="cs-thread-tag">Gemini</span>
                <span className="cs-thread-tag">Post-program innovation</span>
                <span className="cs-thread-tag">0 to 1</span>
              </div>
              <div className="cs-demo-badge">✦ Live Demo Coming Soon</div>
            </div>

            <div className="cs-thread accent">
              <p className="cs-thread-number">04 · The Creative Event</p>
              <h3 className="cs-thread-title">
                Your Career Mosaic —
                <br />
                <em>a Fireside Chat built from zero</em>
              </h3>
              <p className="cs-thread-body">
                My concept, zero to one. A live Fireside Chat for 2,400+
                combined Elevate and Accelerate participants — the largest
                gathering in this program community's history. Two senior
                Salesforce leaders. One conversation about non-linear careers,
                AI, and what leadership looks like now. I designed it, booked the
                panelists, moderated, and held the room.
              </p>
              <div className="cs-thread-tags">
                <span className="cs-thread-tag">97% relevance rating</span>
                <span className="cs-thread-tag">2,400+ participants</span>
                <span className="cs-thread-tag">
                  0 to 1 creative ownership
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        <div className="cs-section">
          <p className="cs-section-label">The Results</p>
          <h2 className="cs-section-heading">
            Numbers that <em>hold up.</em>
          </h2>

          <div className="cs-results-grid">
            <div className="cs-result-card">
              <div className="cs-result-number">
                90<em>+ NPS</em>
              </div>
              <div className="cs-result-label">
                Combined across cohorts — among the highest in the program's
                history
              </div>
            </div>
            <div className="cs-result-card">
              <div className="cs-result-number">
                85<em>%</em>
              </div>
              <div className="cs-result-label">
                Ask Agent Elevate autonomous resolution — named enterprise AI
                blueprint
              </div>
            </div>
            <div className="cs-result-card">
              <div className="cs-result-number">
                95<em>%+</em>
              </div>
              <div className="cs-result-label">
                Participants found the program impactful and relevant to their
                role
              </div>
            </div>
            <div className="cs-result-card">
              <div className="cs-result-number">
                80<em>%</em>
              </div>
              <div className="cs-result-label">
                Pilot adoption rate for the Gemini Leadership Coaching Gem
              </div>
            </div>
            <div className="cs-result-card">
              <div className="cs-result-number">
                97<em>%</em>
              </div>
              <div className="cs-result-label">
                Fireside Chat relevance across 2,400+ global participants
              </div>
            </div>
            <div className="cs-result-card">
              <div className="cs-result-number">
                4–6<em> wks</em>
              </div>
              <div className="cs-result-label">
                From brief to launch — four parallel builds shipped without
                missing a deadline
              </div>
            </div>
            <div className="cs-result-card full">
              <div className="cs-award-block">
                <div className="cs-award-icon">🏆</div>
                <div>
                  <div className="cs-award-title">Brandon Hall Gold Award</div>
                  <div className="cs-award-sub">
                    Best Development Program for Frontline Leaders · "Building
                    Frontline Manager Capability at Scale" · Salesforce
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SO WHAT */}
        <div className="cs-so-what cs-section">
          <p className="cs-so-what-label">What This Work Reveals</p>
          <p className="cs-so-what-text">
            I don't separate what something does from how it feels. The program
            rebuild, the AI builds, the Fireside Chat — these weren't separate
            work streams. They were{" "}
            <em>one response to a single moment.</em> That's the throughline in
            everything I touch: systems thinking and human experience,{" "}
            <em>in the same frame, at the same time.</em>
          </p>
        </div>

        {/* TESTIMONIALS */}
        <div className="cs-testimonials cs-section">
          <p className="cs-testimonials-label">What Collaborators Say</p>
          <div className="cs-testimonial-grid">
            <div className="cs-testimonial-card">
              <p className="cs-testimonial-quote">
                She has played a pivotal role in integrating agentic capabilities
                in daily operations, and post-program support to drive learning
                at scale. Katie is a systems thinker and an extremely gifted
                facilitator who focuses on delivering business outcomes, while
                being creative, innovative and led by purpose and values.
              </p>
              <div className="cs-testimonial-attribution">
                <span className="cs-testimonial-name">Gaurav Mukherjee</span>
                <span className="cs-testimonial-role">
                  Direct Manager · Leadership Development & Talent Management ·
                  Salesforce
                </span>
              </div>
            </div>

            <div className="cs-testimonial-card">
              <p className="cs-testimonial-quote">
                Katie has a rare ability to align diverse stakeholders,
                anticipate challenges before they surface, and drive momentum
                without losing sight of the bigger picture. Her leadership
                presence builds trust quickly and elevates everyone around her.
              </p>
              <div className="cs-testimonial-attribution">
                <span className="cs-testimonial-name">Bianca A Cowan</span>
                <span className="cs-testimonial-role">
                  BTS Program Lead · Empowering Global Leaders & Organizations
                </span>
              </div>
            </div>

            <div className="cs-testimonial-card">
              <p className="cs-testimonial-quote">
                That human-first approach created the kind of trust that drove
                buy-in from everyone in the room and contributed to an
                award-winning workshop. That's not easy to manufacture, and Katie
                made it look natural.
              </p>
              <div className="cs-testimonial-attribution">
                <span className="cs-testimonial-name">Victor Steeb</span>
                <span className="cs-testimonial-role">
                  BTS Senior Consultant · Leadership, Coaching & AI
                  Transformation Strategy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEXT PROJECT */}
      <div className="cs-next-project">
        <p className="cs-next-label">Next</p>
        <Link to="/" className="cs-next-link">
          <span className="cs-next-title">
            Slack AI Agent: Building in Public
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

export default Elevate;
