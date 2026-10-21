import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../../data/projects";
import "./SelectedWork.css";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

function ExternalIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4 11 13M19 14v5H5V5h5" /></svg>;
}

function GitHubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .6a11.7 11.7 0 0 0-3.7 22.8c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6.2 0c2.4-1.6 3.4-1.2 3.4-1.2.6 1.7.2 3 .1 3.3.8.9 1.2 2 1.2 3.3 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.7 11.7 0 0 0 12 .6Z" /></svg>;
}

function shortenStack(stack = "") {
  return stack.split(" · ").slice(0, 2).join(" · ");
}

const projectCards = projects.map((project, index) => ({
  index: String(index + 1).padStart(2, "0"),
  title: project.name,
  descriptor: project.type,
  stack: shortenStack(project.stack || project.type),
  year: project.year || "2026",
  image: project.previewImage,
  liveUrl: project.liveUrl,
  githubUrl: project.repoUrl,
  previewFallback: project.previewFallback,
  alt: `${project.name} — ${project.type} screenshot`,
}));

function ProjectCard({ project, cardRef, slotRef, index, total, cursorRef }) {

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
    gsap.set(cursorRef.current, { x: event.clientX, y: event.clientY, xPercent: -50, yPercent: -50, autoAlpha: 1, scale: 1 });
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
              width="1200"
              height="1500"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
              onLoad={index === 0 ? scheduleScrollRefresh : undefined}
              onError={handlePreviewError}
            />
          </div>
          <span className="work-card__index" aria-label={"Project " + project.index + " of " + total}>
            <span className="work-card__index-number">{project.index}</span>
            <span className="work-card__index-divider">/</span>
            <span>{String(total).padStart(2, "0")}</span>
          </span>
        </div>

        <div className="work-card__shade" aria-hidden="true" />
        <div className="work-card__content">
          <div className="work-card__title-row">
            <div className="work-card__title-mask"><h3>{project.title}</h3></div>
            <div className="work-card__actions">
              <a className="work-card__live" href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={"View live site: " + project.title}>
                <ExternalIcon />
              </a>
              {project.githubUrl && (
                <a className="work-card__github" href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={"View " + project.title + " GitHub repository"}>
                  <GitHubIcon />
                </a>
              )}
            </div>
          </div>
          <p className="work-card__descriptor">{project.descriptor}</p>
          <div className="work-card__meta-row">
            <div className="work-card__pills" aria-label="Project details">
              <span className="work-card__pill">{project.stack}</span>
              <span className="work-card__pill">{project.year}</span>
            </div>
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

  const refreshScheduled = useRef(false);

  function scheduleScrollRefresh() {
    if (refreshScheduled.current) return;
    refreshScheduled.current = true;
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);
      const slots = slotRefs.current.filter(Boolean);
      const activateCard = (activeIndex) => {
        cards.forEach((card, cardIndex) => {
          card.classList.toggle("is-active", cardIndex === activeIndex);
          card.classList.toggle("is-next", cardIndex === activeIndex + 1);
        });
      };

      animateHeading();
      activateCard(0);

      if (reducedMotion) return;

      // One lightweight scrub timeline per incoming card. Only the previous
      // card's transform and its solid dimming overlay change during scroll.
      cards.forEach((card, index) => {
        if (index === 0) return;
        const previousCard = cards[index - 1];
        const shade = previousCard.querySelector(".work-card__shade");
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: slots[index],
            start: "top 78%",
            end: "top 18%",
            scrub: 0.7,
            onEnter: () => activateCard(index),
            onEnterBack: () => activateCard(index - 1),
          },
        });
        timeline.to(previousCard, { scale: 0.95, transformOrigin: "center top", ease: "none" }, 0);
        timeline.to(shade, { opacity: 0.4, ease: "none" }, 0);
      });

      const firstImage = section.current?.querySelector(".work-card__image");
      if (firstImage?.complete) scheduleScrollRefresh();
    }, section);

    return () => ctx.revert();
  }, []);

  const cursorEnabled = typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <section id="work" className="selected-work" ref={section}>
      <div className="section-inner">
        <div className="work-head" ref={heading}>
          <div>
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
      <a className="all-projects-button" href="https://github.com/Immanuelchika099" target="_blank" rel="noreferrer">VIEW ALL PROJECTS <ExternalIcon /></a>
      {cursorEnabled && <div className="work-cursor" ref={cursorRef} aria-hidden="true">View</div>}
    </section>
  );
}

export default SelectedWork;
