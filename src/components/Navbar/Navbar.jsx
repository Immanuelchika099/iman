import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./Navbar.css";

const links = [
  ["01", "WORK", "work"],
  ["02", "ABOUT", "about"],
  ["03", "SERVICES", "services"],
  ["04", "CONTACT", "contact"],
  ["05", "RESUME", "resume"],
];

function Navbar() {
  const nav = useRef(null);
  const menuPanel = useRef(null);
  const accentPanel = useRef(null);
  const whitePanel = useRef(null);
  const menuItems = useRef([]);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const tl = gsap.timeline({ delay: 1.45 });
    tl.fromTo(
      nav.current,
      { yPercent: -120, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "power4.out" }
    );
    return () => tl.kill();
  }, []);

  useLayoutEffect(() => {
    let lastY = 0;
    let ticking = false;
    const threshold = 5;

    const update = (y) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = Math.max(0, y);
        if (currentY < 40) {
          gsap.to(nav.current, {
            yPercent: 0,
            opacity: 1,
            duration: 0.45,
            ease: "power3.out",
            overwrite: true,
          });
        } else if (currentY > lastY + threshold && !open) {
          gsap.to(nav.current, {
            yPercent: -110,
            opacity: 0,
            duration: 0.5,
            ease: "power3.inOut",
            overwrite: true,
          });
        } else if (currentY < lastY - threshold && !open) {
          gsap.to(nav.current, {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
            overwrite: true,
          });
        }
        lastY = currentY;
        ticking = false;
      });
    };

    const onLenisScroll = (event) => update(event.detail?.scroll ?? 0);
    const onWindowScroll = () => update(window.scrollY);
    window.addEventListener("iman-scroll", onLenisScroll);
    window.addEventListener("scroll", onWindowScroll, { passive: true });

    return () => {
      window.removeEventListener("iman-scroll", onLenisScroll);
      window.removeEventListener("scroll", onWindowScroll);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!menuPanel.current) return;

    const items = menuItems.current.filter(Boolean);
    const panel = menuPanel.current;

    if (open) {
      gsap.set(panel, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.set([accentPanel.current, whitePanel.current], { xPercent: 100 });
      gsap.set(items, { yPercent: 110, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

      tl.to(accentPanel.current, { xPercent: 0, duration: 0.55 }, 0)
        .to(whitePanel.current, { xPercent: 0, duration: 0.55 }, 0.1)
        .to(
          items,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.48
        );

      return () => tl.kill();
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        gsap.set(panel, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set([accentPanel.current, whitePanel.current], { xPercent: 100 });
        gsap.set(items, { yPercent: 110, opacity: 0 });
      },
    });

    tl.to(items, {
      yPercent: -35,
      opacity: 0,
      duration: 0.22,
      stagger: 0.025,
      ease: "power2.in",
    })
      .to([whitePanel.current, accentPanel.current], { xPercent: 100, duration: 0.48 }, 0.12);

    return () => tl.kill();
  }, [open]);

  function goTo(id) {
    setOpen(false);

    if (id === "resume") {
      window.open("/resume.pdf", "_blank", "noopener,noreferrer");
      return;
    }

    if (id === "about") {
      window.history.pushState({}, "", "/about");
      window.scrollTo(0, 0);
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "smooth" });
    });
  }

  return (
    <>
      <header ref={nav} className={open ? "navbar is-open" : "navbar"}>
        <div className="navbar__pill">
          <button
            className="navbar__brand"
            onClick={() => {
              setOpen(false);
              window.history.pushState({}, "", "/");
              window.dispatchEvent(new PopStateEvent("popstate"));
              window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }}
          >
            IMAN
          </button>

          <nav className="navbar__links">
            {links.map(([num, label, id]) => (
              <button key={id} onClick={() => goTo(id)}>
                {label}
                {id === "resume" ? (
                  <svg className="navbar__resume-arrow" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 17 17 7M7 7h10v10" />
                  </svg>
                ) : null}
              </button>
            ))}
          </nav>

          <div className="navbar__availability">
            <i /> AVAILABLE FOR SELECT PROJECTS
          </div>

          <button
            className="navbar__menu"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="iman-site-menu"
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        ref={menuPanel}
        id="iman-site-menu"
        className="navbar__menu-panel"
        aria-hidden={!open}
        inert={!open}
      >
        <div ref={accentPanel} className="navbar__menu-accent" />
        <div ref={whitePanel} className="navbar__menu-white">
          <div className="navbar__menu-content">
            <nav className="navbar__menu-links" aria-label="Main navigation">
              {links.map(([num, label, id], index) => (
                <div className="navbar__menu-item-mask" key={id}>
                  <button
                    ref={(element) => (menuItems.current[index] = element)}
                    onClick={() => goTo(id)}
                  >
                    <span>{num}</span>
                    <strong>{label}</strong>
                    <em aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M7 17 17 7M7 7h10v10" />
                      </svg>
                    </em>
                  </button>
                </div>
              ))}
            </nav>

            <div className="navbar__menu-footer">
              <span>IMAN CHIKA</span>
              <span>INDEPENDENT DESIGNER & DEVELOPER</span>
              <span>PORT HARCOURT, NG</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
