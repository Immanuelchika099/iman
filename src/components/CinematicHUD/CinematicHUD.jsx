import { useEffect, useRef, useState } from "react";
import "./CinematicHUD.css";

const chapters = [
  { label: "OPENING", target: "home" },
  { label: "THE POINT OF VIEW", target: "intro" },
  { label: "SELECTED WORK", target: "work" },
  { label: "CAPABILITIES", target: "services" },
  { label: "CONTACT", target: "contact" },
];

function formatTimecode(progress) {
  const totalFrames = Math.round(Math.max(0, Math.min(1, progress)) * 60 * 60 * 24);
  const frames = totalFrames % 24;
  const seconds = Math.floor(totalFrames / 24) % 60;
  const minutes = Math.floor(totalFrames / (24 * 60)) % 60;
  const hours = Math.floor(totalFrames / (24 * 60 * 60));
  return [hours, minutes, seconds, frames].map((value) => String(value).padStart(2, "0")).join(":");
}

function CinematicHUD() {
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const hud = useRef(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        setProgress(Math.min(1, Math.max(0, window.scrollY / max)));
        frame = 0;
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("iman-scroll", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("iman-scroll", update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function jump(target) {
    setMenuOpen(false);
    const element = document.getElementById(target);
    if (!element) return;
    if (window.__imanLenis) window.__imanLenis.scrollTo(element, { offset: 0, duration: 1.25 });
    else element.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="cinema-hud" ref={hud}>
      <div className="cinema-hud__topline" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
      <div className="cinema-hud__readout">
        <a className="cinema-hud__brand" href="#home" onClick={(event) => { event.preventDefault(); jump("home"); }} aria-label="IMAN — back to opening">IMAN<span>®</span></a>
        <div className="cinema-hud__time" aria-label={`Scroll timecode ${formatTimecode(progress)}`}>
          <span className="cinema-hud__rec" aria-hidden="true" />
          <span>{formatTimecode(progress)}</span>
        </div>
        <button className={menuOpen ? "cinema-hud__toggle is-open" : "cinema-hud__toggle"} type="button" aria-expanded={menuOpen} aria-controls="cinema-chapters" onClick={() => setMenuOpen((value) => !value)}>
          <span>{menuOpen ? "CLOSE" : "CHAPTERS"}</span><i aria-hidden="true"><b /><b /></i>
        </button>
      </div>
      <nav id="cinema-chapters" className={menuOpen ? "cinema-hud__chapters is-open" : "cinema-hud__chapters"} aria-label="Portfolio chapters" aria-hidden={!menuOpen}>
        {chapters.map((chapter, index) => (
          <button key={chapter.target} type="button" onClick={() => jump(chapter.target)} tabIndex={menuOpen ? 0 : -1}>
            <span>0{index + 1}</span>{chapter.label}<i aria-hidden="true">↗</i>
          </button>
        ))}
        <a href="/about" onClick={(event) => { event.preventDefault(); setMenuOpen(false); window.history.pushState({}, "", "/about"); window.dispatchEvent(new PopStateEvent("popstate")); window.scrollTo(0, 0); }}>ABOUT IMAN <i aria-hidden="true">↗</i></a>
        <a href="/resume.pdf" target="_blank" rel="noreferrer">RESUME <i aria-hidden="true">↗</i></a>
      </nav>
    </div>
  );
}

export default CinematicHUD;
