import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

let lenisInstance = null;

export function initSmoothScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  // Keep touch scrolling native; Lenis is reserved for fine-pointer devices.
  if (window.matchMedia("(pointer: coarse)").matches) return () => {};
  if (lenisInstance) return () => {};

  const lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 0.9,
    touchMultiplier: 1,
    anchors: true,
  });

  const update = () => ScrollTrigger.update();

  const raf = (time) => {
    lenis.raf(time * 1000);
  };

  const onScroll = (event) => {
    window.dispatchEvent(
      new CustomEvent("iman-scroll", {
        detail: {
          velocity: event.velocity || 0,
          progress: event.progress || 0,
          scroll: event.scroll || 0,
        },
      })
    );
  };

  lenis.on("scroll", ScrollTrigger.update);
  lenis.on("scroll", onScroll);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  lenisInstance = lenis;
  window.__imanLenis = lenis;

  return () => {
    lenis.off("scroll", ScrollTrigger.update);
    lenis.off("scroll", onScroll);
    gsap.ticker.remove(raf);
    lenis.destroy();
    lenisInstance = null;
    delete window.__imanLenis;
  };
}

export function getLenis() {
  return lenisInstance;
}