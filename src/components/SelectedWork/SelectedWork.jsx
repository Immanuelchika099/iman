import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../../data/projects";
import "./SelectedWork.css";
import BlinkingSquares from "../BlinkingSquares/BlinkingSquares";

gsap.registerPlugin(ScrollTrigger);

function ExternalIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4 11 13M19 14v5H5V5h5" /></svg>;
}

function GitHubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .6a11.7 11.7 0 0 0-3.7 22.8c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6.2 0c2.4-1.6 3.4-1.2 3.4-1.2.6 1.7.2 3 .1 3.3.8.9 1.2 2 1.2 3.3 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.7 11.7 0 0 0 12 .6Z" /></svg>;
}

// Keep card content compact by shortening existing metadata, never replacing its meaning.
function shortenRole(role = "Design & Development") {
  return role.replace("Development", "Dev");
}

function shortenStack(stack = "") {
  return stack.split(" · ").slice(0, 2).join(" · ");
}

const projectCards = projects.map((project, index) => ({
  index: String(index + 1).padStart(2, "0"),
  title: project.name,
  descriptor: project.type,
  role: shortenRole(project.role),
  stack: shortenStack(project.stack || project.type),
  year: project.year || "2026",
  image: project.previewImage,
  liveUrl: project.liveUrl,
  githubUrl: project.repoUrl,
  previewFallback: project.previewFallback,
  alt: `${project.name} — ${project.type} screenshot`,
}));

function ProjectCard({ project, cardRef, slotRef, index, total, cursorRef }) {
  const mediaRef = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const descriptorRef = useRef(null);
  const metaRef = useRef(null);
  const slateRef = useRef(null);

  function handlePreviewError(event) {
    const img = event.currentTarget;
    if (img.dataset.fallbackTried !== "true" && project.previewFallback) {
      img.dataset.fallbackTried = "true";
      img.src = project.previewFallback;
      return;
    }
    img.style.opacity = "0";
    img.parentElement?.classList.add("has-preview-error");
  }

  function showCursor(event) {
    if (!cursorRef.current || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    gsap.set(cursorRef.current, { x: event.clientX, y: event.clientY, autoAlpha: 1, scale: 1 });
  }

  function moveCursor(event) {
    if (!cursorRef.current || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    gsap.to(cursorRef.current, { x: event.clientX, y: event.clientY, duration: 0.18, ease: "power3.out", overwrite: true });
  }

  function hideCursor() {
    if (cursorRef.current) gsap.to(cursorRef.current, { autoAlpha: 0, scale: 0.8, duration: 0.2, overwrite: true });
  }

  return (
    <div className="work-card-slot" ref={slotRef} style={{ "--card-index": index }}>
      <article className="work-card" data-work-card ref={cardRef}>
        <div
          className="work-card__media"
          ref={mediaRef}
          onMouseEnter={showCursor}
          onMouseMove={moveCursor}
          onMouseLeave={hideCursor}
        >
          <div className="work-card__parallax">
            <img
              ref={imageRef}
              className="work-card__image"
              src={project.image}
              alt={project.alt}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              onError={handlePreviewError}
            />
          </div>
          <span className="work-card__index" ref={slateRef} aria-label={`Project ${project.index} of ${total}`}>
            <span className="work-card__index-number">{project.index}</span>
            <span className="work-card__index-divider">/</span>
            <span>{String(total).padStart(2, "0")}</span>
          </span>
        </div>

        <div className="work-card__content">
          <div className="work-card__title-row">
            <div className="work-card__title-mask"><h3 ref={titleRef}>{project.title}</h3></div>
            <a className="work-card__live" href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`View live site: ${project.title}`}>
              <ExternalIcon />
            </a>
          </div>
          <p className="work-card__descriptor" ref={descriptorRef}>{project.descriptor}</p>
          <div className="work-card__meta-row" ref={metaRef}>
            <div className="work-card__pills" aria-label="Project details">
              <span className="work-card__pill">{project.role}</span>
              <span className="work-card__pill">{project.stack}</span>
              <span className="work-card__pill">{project.year}</span>
            </div>
            {project.githubUrl && (
              <a className="work-card__github" href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`View ${project.title} GitHub repository`}>
                <GitHubIcon />
              </a>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

function SelectedWork() {
  const section = useRef(null);
  const heading = useRef(null);
  const cardRefs = useRef([]);
  const slotRefs = useRef([]);
  const cursorRef = useRef(null);

  // Timeline 1: reveal the section heading from behind a clean line mask.
  function animateHeading() {
    const lines = heading.current?.querySelectorAll(".work-heading__line-inner");
    if (!lines?.length) return;
    gsap.fromTo(lines, { yPercent: 115 }, {
      yPercent: 0,
      duration: 1,
      stagger: 0.12,
      ease: "power4.out",
      scrollTrigger: { trigger: heading.current, start: "top 86%", once: true },
    });
  }

  // Timeline 2: reveal each film frame and push the screenshot through its media window.
  function animateCardEntry(card, slot) {
    const title = card.querySelector(".work-card__title-mask h3");
    const descriptor = card.querySelector(".work-card__descriptor");
    const meta = card.querySelector(".work-card__meta-row");
    const media = card.querySelector(".work-card__parallax");
    const indexPill = card.querySelector(".work-card__index");

    gsap.fromTo(card,
      { clipPath: "inset(8% 0 8% 0 round 28px)", opacity: 0.55 },
      {
        clipPath: "inset(0% 0 0% 0 round 28px)",
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: slot, start: "top 88%", end: "top 35%", scrub: 0.7 },
      }
    );

    gsap.fromTo(media, { scale: 1.2, yPercent: 8 }, {
      scale: 1,
      yPercent: -8,
      ease: "none",
      scrollTrigger: { trigger: slot, start: "top bottom", end: "top 15%", scrub: 0.8 },
    });

    gsap.fromTo(title, { yPercent: 115 }, {
      yPercent: 0,
      ease: "power3.out",
      scrollTrigger: { trigger: slot, start: "top 75%", end: "top 42%", scrub: 0.55 },
    });

    gsap.fromTo([descriptor, meta], { y: 14, opacity: 0 }, {
      y: 0,
      opacity: 1,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: { trigger: slot, start: "top 72%", end: "top 43%", scrub: 0.55 },
    });

    gsap.fromTo(indexPill, { yPercent: 35, opacity: 0 }, {
      yPercent: 0,
      opacity: 1,
      ease: "power2.out",
      scrollTrigger: { trigger: slot, start: "top 82%", end: "top 55%", scrub: 0.45 },
    });
  }

  // Timeline 3: as the next card arrives, the previous scene recedes behind it.
  function animateStacking(cards, slots) {
    cards.forEach((card, index) => {
      if (index === cards.length - 1) return;
      const nextSlot = slots[index + 1];
      gsap.to(card, {
        scale: 0.94,
        filter: "brightness(0.5) blur(2px)",
        transformOrigin: "center top",
        ease: "none",
        scrollTrigger: {
          trigger: nextSlot,
          start: "top 72%",
          end: "top 16%",
          scrub: 0.7,
        },
      });
    });
  }

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);
      const slots = slotRefs.current.filter(Boolean);

      if (reducedMotion) {
        gsap.fromTo([heading.current, ...cards], { opacity: 0 }, {
          opacity: 1,
          duration: 0.45,
          stagger: 0.1,
          ease: "power1.out",
          scrollTrigger: { trigger: section.current, start: "top 85%", once: true },
        });
        return;
      }

      animateHeading();
      cards.forEach((card, index) => animateCardEntry(card, slots[index]));
      animateStacking(cards, slots);

      // The active frame gets a restrained accent; inactive frames remain neutral.
      cards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: slots[index],
          start: "top 62%",
          end: "bottom 38%",
          toggleClass: { targets: card, className: "is-active" },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const cursorEnabled = typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <section id="work" className="selected-work" ref={section}>
      <div className="selected-work__squares"><BlinkingSquares direction="right" gridSize={58} squareSize={0.48} fadeStart={0.58} fadeEnd={1} falloff={1.6} minBrightness={0.28} twinkleSpeed={0.7} twinkleStrength={0.55} intensity={0.65} opacity={0.42} squareColor="#3451B2" backgroundColor="transparent" dpr={1.5} /></div>
      <div className="section-inner">
        <div className="work-head" ref={heading}>
          <div>
            <span className="section-kicker">SELECTED WORKS</span>
            <h2><span className="work-heading__line"><span className="work-heading__line-inner">SELECTED</span></span><span className="work-heading__line"><em className="work-heading__line-inner">WORKS.</em></span></h2>
          </div>
          <a className="github-link" href="https://github.com/Immanuelchika099" target="_blank" rel="noreferrer" aria-label="IMAN GitHub"><GitHubIcon /></a>
        </div>

        <div className="work-stack">
          {projectCards.map((project, index) => (
            <ProjectCard
              key={project.index}
              project={project}
              index={index}
              total={projectCards.length}
              cardRef={(node) => { cardRefs.current[index] = node; }}
              slotRef={(node) => { slotRefs.current[index] = node; }}
              cursorRef={cursorRef}
            />
          ))}
        </div>
      </div>
      <a className="all-projects-button" href="https://github.com/Immanuelchika099" target="_blank" rel="noreferrer">VIEW ALL PROJECTS <span>↗</span></a>
      {cursorEnabled && <div className="work-cursor" ref={cursorRef} aria-hidden="true">View</div>}
    </section>
  );
}

export default SelectedWork;
