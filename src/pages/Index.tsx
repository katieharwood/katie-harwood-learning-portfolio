import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import portraitImg from "@/assets/portrait.png";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const testimonials = [
  {
    text: "\u201CWith a mind that is highly creative and equally strategic, Katie brings incredible change, structure, and vision to an organization extremely quickly.\u201D",
    name: "Lauren Benton-Cissel",
    role: "Director, Talent Experience \u00B7 TAG",
  },
  {
    text: "\u201CWhat sets her apart is her ability to translate that passion into scalable innovation.\u201D",
    name: "Ian Burke",
    role: "HR Operations \u00B7 Salesforce",
  },
  {
    text: "\u201CKatie\u2019s approach, preparation and execution were second to none.\u201D",
    name: "Bonnie Parisi",
    role: "VP Product Accessibility \u00B7 Salesforce",
  },
];

const projects: { num: string; name: string; tag: string; href: string; comingSoon?: boolean }[] = [
  { num: "01", name: "Elevate: Manager Leadership Program", tag: "CASE STUDY", href: "/elevate" },
  { num: "02", name: "Build Your User Guide with an AI Assistant", tag: "CASE STUDY + VIDEO", href: "/build-user-guide" },
  { num: "03", name: "Slack AI Agent: Building in Public", tag: "COMING SOON!", href: "#", comingSoon: true },
];

const currentlyBuilding = [
  {
    label: "✦ Currently Building",
    title: "My User Guide AI Assistant",
    desc: "Create Your Own 'How to Work with Me' Doc",
    href: "https://gemini.google.com/gem/1K0X5T8p05PZWPcXaemb43UMCizeiM008?usp=sharing",
  },
  {
    label: "✦ Currently Building",
    title: "Emoji Decoder Ring 💍",
    desc: "Find the right one. Decode the cryptic ones.",
    href: "https://lnkd.in/g-ra6zsY",
  },
];

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const Index = () => {
  const chosen = useMemo(
    () => testimonials[Math.floor(Math.random() * testimonials.length)],
    []
  );

  const [cbIndex, setCbIndex] = useState(0);
  const cbTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCbTimer = useCallback(() => {
    cbTimerRef.current = setInterval(() => {
      setCbIndex((prev) => (prev + 1) % currentlyBuilding.length);
    }, 4000);
  }, []);

  const resetCbTimer = useCallback(() => {
    if (cbTimerRef.current) clearInterval(cbTimerRef.current);
    startCbTimer();
  }, [startCbTimer]);

  useEffect(() => {
    startCbTimer();
    return () => { if (cbTimerRef.current) clearInterval(cbTimerRef.current); };
  }, [startCbTimer]);

  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function runReveal() {
      const el = (id: string) => document.getElementById(id);
      const addVisible = (id: string) => el(id)?.classList.add("visible");

      await wait(600);
      addVisible("h1");
      await wait(220);
      addVisible("h2");
      await wait(400);
      addVisible("subtitle");
      await wait(500);
      addVisible("divider");
      await wait(300);
      addVisible("projectsLabel");
      await wait(150);
      const items = document.querySelectorAll(".project-item");
      for (let i = 0; i < items.length; i++) {
        await wait(100);
        items[i].classList.add("visible");
      }
      await wait(200);
      addVisible("currentlyBuilding");
      await wait(400);
      addVisible("testimonialWrap");
      await wait(400);
      addVisible("footerRow");
    }
    runReveal();
  }, []);

  return (
    <>
      {/* Mobile portrait - fixed top right */}
      <div className="portrait-mobile">
        <img src={portraitImg} alt="Katie Harwood portrait" />
      </div>

      <div className="page" ref={pageRef}>
        {/* Header */}
        <div className="header-row">
          <div className="portrait-wrap">
            <img src={portraitImg} alt="Katie Harwood portrait" />
          </div>
          <div className="header-content">
            <p className="eyebrow">Katie Harwood Portfolio</p>
            <h1>
              <span className="headline-line" id="h1">
                L&D Leader.
              </span>
              <span className="headline-line" id="h2">
                <span className="gold-italic">AI</span> <span className="gold-italic">Builder.</span>
              </span>
            </h1>
            <p className="subtitle" id="subtitle">
              Building at the intersection of people and possibility.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="divider" id="divider" />

        {/* Projects */}
        <p className="section-label" id="projectsLabel">
          Selected Projects
        </p>
        <div className="projects">
          {projects.map((p) =>
            p.href !== "#" ? (
              <Link
                key={p.num}
                to={p.href}
                className="project-item visible-link"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="project-num">{p.num}</span>
                <span className="project-name">{p.name}</span>
                <span className={`project-tag${p.comingSoon ? " coming-soon" : ""}`}>
                  {p.tag}
                </span>
                <span className="project-arrow">&rarr;</span>
              </Link>
            ) : (
              <Tooltip key={p.num}>
                <TooltipTrigger asChild>
                  <div
                    className="project-item"
                    role="button"
                    tabIndex={0}
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="project-num">{p.num}</span>
                    <span className="project-name">{p.name}</span>
                    <span className={`project-tag${p.comingSoon ? " coming-soon" : ""}`}>
                      {p.tag}
                    </span>
                    <span className="project-arrow">&rarr;</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="tooltip-coming-soon">
                  <p>{p.comingSoon ? "Coming soon" : "Case study coming soon"}</p>
                </TooltipContent>
              </Tooltip>
            )
          )}
        </div>

        {/* Currently Building */}
        <a
          className="currently-building"
          id="currentlyBuilding"
          href="https://lnkd.in/g-ra6zsY"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="cb-content">
            <p className="cb-label">&#10022; Currently Building</p>
            <p className="cb-title">Emoji Decoder Ring 💍</p>
            <p className="cb-desc">Find the right one. Decode the cryptic ones.</p>
          </div>
          <span className="cb-arrow">&rarr;</span>
        </a>

        {/* Testimonial */}
        <div className="testimonial-wrap" id="testimonialWrap">
          <div className="testimonial">
            <p className="testimonial-quote">{chosen.text}</p>
            <p className="testimonial-name">{chosen.name}</p>
            <p className="testimonial-role">{chosen.role}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-row" id="footerRow">
          <p className="tagline-footer">
            Experience Built &middot; Enterprise Tested &middot; AI Forward
          </p>
          <a
            className="linkedin-link"
            href="https://www.linkedin.com/in/katieharwood2/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <svg
              className="linkedin-icon"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
};

export default Index;
