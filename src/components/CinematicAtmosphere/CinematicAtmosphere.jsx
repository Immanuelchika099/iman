import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CinematicAtmosphere.css";

gsap.registerPlugin(ScrollTrigger);

function CinematicAtmosphere() {
  const root = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const element = root.current;
    let pointerFrame = 0;
    const moveSpotlight = (event) => {
      if (window.matchMedia("(hover: none), (pointer: coarse)").matches || pointerFrame) return;
      const x = event.clientX;
      const y = event.clientY;
      pointerFrame = window.requestAnimationFrame(() => {
        element.style.setProperty("--spot-x", x + "px");
        element.style.setProperty("--spot-y", y + "px");
        pointerFrame = 0;
      });
    };
    window.addEventListener("pointermove", moveSpotlight, { passive: true });
    const work = document.getElementById("work");
    const contact = document.getElementById("contact");
    const triggers = [];
    [work, contact].filter(Boolean).forEach((scene) => {
      triggers.push(ScrollTrigger.create({
        trigger: scene,
        start: "top 62%",
        end: "bottom 38%",
        onEnter: () => element.classList.add("is-letterboxed"),
        onEnterBack: () => element.classList.add("is-letterboxed"),
        onLeave: () => element.classList.remove("is-letterboxed"),
        onLeaveBack: () => element.classList.remove("is-letterboxed"),
      }));
    });
    element.classList.add("is-letterboxed");
    const introTimer = window.setTimeout(() => {
      if (!work?.matches(":hover")) element.classList.remove("is-letterboxed");
    }, 3600);
    return () => {
      window.removeEventListener("pointermove", moveSpotlight);
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      window.clearTimeout(introTimer);
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return <div className="cinema-atmosphere" ref={root} aria-hidden="true"><span className="cinema-atmosphere__bar cinema-atmosphere__bar--top" /><span className="cinema-atmosphere__bar cinema-atmosphere__bar--bottom" /><span className="cinema-atmosphere__spotlight" /></div>;
}

export default CinematicAtmosphere;
