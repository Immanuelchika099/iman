import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Tech.css";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "01",
    title: "WEBSITE DEVELOPMENT",
    description: "Distinctive, responsive websites that make businesses look credible and turn attention into enquiries.",
    tags: "BUSINESS SITES · BRAND EXPERIENCES",
  },
  {
    number: "02",
    title: "WEB APPLICATIONS",
    description: "Useful, reliable web apps with thoughtful interfaces, real functionality and solid engineering underneath.",
    tags: "PRODUCTS · DASHBOARDS · TOOLS",
  },
  {
    number: "03",
    title: "E-COMMERCE",
    description: "Online stores built to make product discovery simple and the path to purchase feel effortless.",
    tags: "ONLINE STORES · PRODUCT EXPERIENCES",
  },
  {
    number: "04",
    title: "AI INTEGRATION",
    description: "Practical AI features that solve a real problem and fit naturally into your website or product.",
    tags: "AI FEATURES · AUTOMATION · API INTEGRATION",
  },
];

const stack = [
  ["REACT", "react"],
  ["JAVASCRIPT", "js"],
  ["CSS", "css"],
  ["TYPESCRIPT", "ts"],
  ["NODE.JS", "node"],
  ["EXPRESS", "express"],
  ["SUPABASE", "supabase"],
  ["GSAP", "gsap"],
  ["VERCEL", "vercel"],
  ["AI INTEGRATION", "ai"],
];

function Icon({ type }) {
  const common = { viewBox: "0 0 48 48", "aria-hidden": true };
  if (type === "react") return <svg {...common}><circle cx="24" cy="24" r="4"/><ellipse cx="24" cy="24" rx="20" ry="8"/><ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(120 24 24)"/></svg>;
  if (type === "js") return <svg {...common}><rect x="4" y="4" width="40" height="40"/><text x="13" y="36" fontSize="22" fontWeight="700" fill="#000">JS</text></svg>;
  if (type === "css") return <svg {...common}><path d="M7 5h34l-3.2 35L24 44 10.2 40 7 5Z"/><path d="m14 13 .7 7h18l-.7 7H15.5l.5 5 8 2.2 8-2.2.4-4.2" fill="#000"/></svg>;
  if (type === "ts") return <svg {...common}><rect x="4" y="4" width="40" height="40"/><text x="10" y="36" fontSize="20" fontWeight="700" fill="#000">TS</text></svg>;
  if (type === "node") return <svg {...common}><path d="m24 4 17 10v20L24 44 7 34V14L24 4Z"/><path d="m18 18 6-3.5 6 3.5v12l-6 3.5-6-3.5V18Z" fill="#000"/></svg>;
  if (type === "express") return <svg {...common}><path d="M7 24h34M10 17c3-5 8-7 14-7s11 2 14 7M10 31c3 5 8 7 14 7s11-2 14-7"/></svg>;
  if (type === "supabase") return <svg {...common}><path d="M28 4 10 27h13l-3 17 18-23H25l3-17Z"/></svg>;
  if (type === "gsap") return <svg {...common}><path d="M7 12h34M7 24h28M7 36h20"/></svg>;
  if (type === "vercel") return <svg {...common}><path d="M24 6 43 39H5L24 6Z"/></svg>;
  return <svg {...common}><circle cx="24" cy="24" r="17"/><path d="M15 29c2-7 5-11 9-11s7 4 9 11M18 18l-3-5M30 18l3-5"/></svg>;
}

function Tech() {
  const root = useRef(null);
  const viewport = useRef(null);
  const track = useRef(null);
  const setWidth = useRef(0);
  const drag = useRef(null);
  const paused = useRef(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".service-card");
      const techCards = gsap.utils.toArray(".tech__item");
      const measure = () => { setWidth.current = track.current.scrollWidth / 3; };

      measure();

      gsap.fromTo(".tech__intro > *", { y: 35, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: "power4.out",
        scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
      });

      gsap.fromTo(cards, { y: 45, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power4.out",
        scrollTrigger: { trigger: ".services-grid", start: "top 82%", once: true },
      });

      gsap.fromTo(".tech__tools-label", { y: 25, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".tech__tools", start: "top 85%", once: true },
      });

      gsap.fromTo(techCards, { y: 25, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.65, stagger: 0.035, ease: "power3.out",
        scrollTrigger: { trigger: viewport.current, start: "top 90%", once: true },
      });

      const tick = () => {
        if (!paused.current && setWidth.current) {
          viewport.current.scrollLeft += 0.75;
          if (viewport.current.scrollLeft >= setWidth.current) viewport.current.scrollLeft -= setWidth.current;
        }
      };
      gsap.ticker.add(tick);

      const down = (e) => {
        drag.current = { x: e.clientX, last: viewport.current.scrollLeft };
        paused.current = true;
        viewport.current.classList.add("is-dragging");
        viewport.current.setPointerCapture?.(e.pointerId);
      };
      const move = (e) => {
        if (!drag.current) return;
        viewport.current.scrollLeft = drag.current.last - (e.clientX - drag.current.x);
        while (viewport.current.scrollLeft < 0) viewport.current.scrollLeft += setWidth.current;
        while (viewport.current.scrollLeft >= setWidth.current) viewport.current.scrollLeft -= setWidth.current;
      };
      const up = () => {
        drag.current = null;
        paused.current = false;
        viewport.current.classList.remove("is-dragging");
      };

      const view = viewport.current;
      view.addEventListener("pointerdown", down);
      view.addEventListener("pointermove", move);
      view.addEventListener("pointerup", up);
      view.addEventListener("pointercancel", up);
      window.addEventListener("resize", measure);

      return () => {
        gsap.ticker.remove(tick);
        view.removeEventListener("pointerdown", down);
        view.removeEventListener("pointermove", move);
        view.removeEventListener("pointerup", up);
        view.removeEventListener("pointercancel", up);
        window.removeEventListener("resize", measure);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  const repeated = [...stack, ...stack, ...stack];

  return (
    <section id="services" className="tech" ref={root}>
      <div className="section-inner">
        <div className="tech__intro">
          <div>
            <span className="section-kicker">SERVICES / WHAT I BUILD</span>
            <h2>BUILT FOR<br /><em>WHAT'S NEXT.</em></h2>
          </div>
          <span>SOFTWARE ENGINEERING<br />DESIGN · CODE · AI</span>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <a className="service-card" href="/start-a-project" key={service.number}>
              <div className="service-card__top">
                <span>{service.number} / SERVICE</span>
                <span className="service-card__arrow" aria-hidden="true">↗</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div className="service-card__bottom">
                <span>{service.tags}</span>
                <span className="service-card__link">LET'S TALK <b>↗</b></span>
              </div>
            </a>
          ))}
        </div>

        <div className="tech__tools">
          <div className="tech__tools-label">
            <span className="section-kicker">THE TOOLKIT</span>
            <span>TOOLS I USE TO MAKE IT REAL.</span>
          </div>
          <div className="tech__viewport" ref={viewport} aria-label="Technologies I work with">
            <div className="tech__words" ref={track}>
              {repeated.map(([name, type], i) => (
                <div className="tech__item" key={name + i}>
                  <div className="tech__icon"><Icon type={type} /></div>
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Tech;
