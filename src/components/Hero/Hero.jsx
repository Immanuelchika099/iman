import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Hero.css";
import HeroGradient from "../HeroGradient/HeroGradient";

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ delay: 1.45 })
        .fromTo(".hero__eyebrow", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" })
        .fromTo(".hero__line", { yPercent: 110 }, { yPercent: 0, duration: 1.05, stagger: 0.08, ease: "power4.out" }, "-=0.25")
        .fromTo(".hero__meta", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.45")
        .fromTo(".hero__scroll", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.3")
        .fromTo(".hero__image-frame", { y: 24, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }, "-=0.45");

      gsap.to(".hero__scroll-arrow", { y: 6, duration: 1.25, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(".hero__scroll-label", { y: 6, duration: 1.25, ease: "sine.inOut", repeat: -1, yoyo: true });

      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const transition = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=125%",
            pin: true,
            scrub: 0.75,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        transition
          .to(".hero__inner", { yPercent: -7, opacity: 0.03, ease: "none", duration: 0.46 }, 0)
          .to(".hero__image-frame", {
            width: "100vw",
            height: "100svh",
            right: 0,
            bottom: 0,
            borderRadius: 0,
            ease: "power2.inOut",
            duration: 0.78,
          }, 0)
          .to(".hero__image-frame", { opacity: 0, filter: "blur(12px)", ease: "power1.in", duration: 0.18 }, 0.82);
      }

      return () => {
        intro.kill();
        gsap.killTweensOf(".hero__scroll-arrow, .hero__scroll-label");
      };
    }, root);

    return () => ctx.revert();
  }, []);

  function scrollToNext() {
    const next = root.current?.nextElementSibling;
    if (window.__imanLenis && next) window.__imanLenis.scrollTo(next, { offset: 0, duration: 1.35 });
    else next?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="hero" id="home" ref={root}>
      <HeroGradient />
      <div className="section-inner hero__inner">
        <div className="hero__eyebrow"><span>SOFTWARE ENGINEER / CREATIVE DEVELOPER</span></div>
        <h1>
          <span className="hero__line-wrap"><span className="hero__line">I BUILD</span></span>
          <span className="hero__line-wrap"><span className="hero__line hero__line--indent">WEBSITES &amp;</span></span>
          <span className="hero__line-wrap"><span className="hero__line">WEB APPS.</span></span>
        </h1>
        <div className="hero__meta"><p>WEBSITES · WEB APPS · AI</p></div>
        <button className="hero__scroll" type="button" onClick={scrollToNext} aria-label="Scroll down to explore">
          <span className="hero__scroll-label">SCROLL DOWN TO EXPLORE</span>
          <span className="hero__scroll-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 4v15M6 13l6 6 6-6" /></svg>
          </span>
        </button>
      </div>
      <div className="hero__image-frame" aria-hidden="true">
        <img className="hero__image-art" src="/images/hero-orbit.svg" alt="" fetchPriority="high" />
        <div className="hero__image-caption"><span>FORM / 001</span><span>CREATIVE SYSTEMS</span></div>
      </div>
      <div className="hero__transition-vignette" aria-hidden="true" />
    </section>
  );
}

export default Hero;
