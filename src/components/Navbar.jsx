"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const links = [
  { label: "Home", href: "#top" },
  { label: "Projects", href: "#projects" },
  { label: "Timeline", href: "#timeline" },
  { label: "Architecture", href: "#architecture" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingNavigation = useRef("");

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    const updateScroll = () => setCompact(window.scrollY > 60);
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });

    const sections = links
      .map(({ href }) => document.querySelector(href))
      .filter((section) => section !== null);

    const updateActive = () => {
      const marker = window.innerHeight;
      if (pendingNavigation.current) {
        const target = document.querySelector(pendingNavigation.current);
        if (target) {
          const { top, bottom } = target.getBoundingClientRect();
          if (top <= marker && bottom > marker) {
            setActive(pendingNavigation.current);
            pendingNavigation.current = "";
            return;
          }
          if (top > marker) {
            setActive(pendingNavigation.current);
            return;
          }
        }
        pendingNavigation.current = "";
      }

      const current = sections
        .filter((section) => section.getBoundingClientRect().top <= marker)
        .at(-1);
      setActive(current ? `#${current.id}` : "");
    };

    const cancelPendingNavigation = () => {
      if (!pendingNavigation.current) return;
      pendingNavigation.current = "";
      updateActive();
    };

    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    window.addEventListener("wheel", cancelPendingNavigation, { passive: true });
    window.addEventListener("touchstart", cancelPendingNavigation, { passive: true });
    updateActive();
    const observer = new IntersectionObserver(
      updateActive,
      { rootMargin: "0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
      window.removeEventListener("wheel", cancelPendingNavigation);
      window.removeEventListener("touchstart", cancelPendingNavigation);
      observer.disconnect();
    };
  }, []);

  return (
    <motion.nav
      className={`site-nav${compact ? " compact" : ""}`}
      aria-label="Main navigation"
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.3 }}
    >
      <a
        className="nav-brand"
        href="#top"
        aria-label="Dantel, back to top"
        onClick={() => {
          pendingNavigation.current = "";
          setActive("");
          setMenuOpen(false);
        }}
      >
        <span className="nav-brand-desktop">D.</span>
        <span className="nav-brand-mobile">Dantel</span>
      </a>
      <div
        className={`nav-links${menuOpen ? " is-open" : ""}`}
        id="mobile-nav-menu"
      >
        {links.map(({ label, href }) => (
          <a
            className={`nav-link${href === "#top" ? " nav-link-home" : ""}${active === href ? " is-active" : ""}`}
            href={href}
            key={href}
            aria-current={active === href ? "location" : undefined}
            onClick={() => {
              pendingNavigation.current = href;
              setActive(href);
              setMenuOpen(false);
            }}
          >
            {active === href && (
              <motion.span
                className="nav-link-active"
                layoutId="nav-highlight"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {label}
          </a>
        ))}
      </div>
      <a
        className="nav-status"
        href="#contact"
        onClick={() => setMenuOpen(false)}
      >
        <span className="status-dot" />
        <span style={{ marginBottom: '-2px' }}>Available for work</span>
        <ArrowUpRight size={12} aria-hidden="true" />
      </a>
      <button
        className="nav-toggle"
        type="button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-controls="mobile-nav-menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? (
          <X size={18} aria-hidden="true" />
        ) : (
          <Menu size={18} aria-hidden="true" />
        )}
      </button>
    </motion.nav>
  );
}
