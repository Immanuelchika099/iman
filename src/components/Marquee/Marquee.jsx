import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./Marquee.css";

function Marquee() {
  const track = useRef(null);

  useLayoutEffect(() => {
    const tween = gsap.to(track.current, {
      xPercent: -50,
      duration: 24,
      ease: "none",
      repeat: -1,
    });

    const onScroll = (e) => {
      const velocity = Math.min(Math.abs(e.detail?.velocity || 0), 3);
      gsap.to(tween, {
        timeScale: 1 + velocity * 0.45,
        duration: 0.25,
        ease: "power2.out",
        overwrite: true,
      });
      gsap.to(tween, {
        timeScale: 1,
        delay: 0.28,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("iman-scroll", onScroll);

    return () => {
      window.removeEventListener("iman-scroll", onScroll);
      tween.kill();
    };
  }, []);

  return (
    <section className="marquee">
      <div className="marquee__track" ref={track}>
        <span>05+ PROJECTS</span>
        <b aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/></svg></b>
        <span>40+ SATISFIED CLIENTS</span>
        <b aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/></svg></b>
        <span>05+ TECHNOLOGIES</span>
        <b aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/></svg></b>
        <span>05+ PROJECTS</span>
        <b aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/></svg></b>
        <span>40+ SATISFIED CLIENTS</span>
        <b aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/></svg></b>
        <span>05+ TECHNOLOGIES</span>
        <b aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/></svg></b>
      </div>
    </section>
  );
}

export default Marquee;
