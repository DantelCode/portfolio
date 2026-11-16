"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Facebook, Github, Linkedin } from "lucide-react";
import { useRef } from "react";
import posthog from "posthog-js";

export default function Hero() {
  const glowRef = useRef(null);

  const moveGlow = (event) => {
    if (!glowRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    glowRef.current.style.setProperty("--glow-x", `${x * 55}px`);
    glowRef.current.style.setProperty("--glow-y", `${y * 35}px`);
  };

  return (
    <section
      className="hero"
      id="top"
      aria-labelledby="hero-heading"
      onMouseMove={moveGlow}
    >
      <motion.div
        className="hero-glow"
        ref={glowRef}
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      />
      <motion.div
        className="hero-content"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
        }}
      >
        <motion.div
          className="hero-badge"
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: { opacity: 1, y: 0, transition: { duration: 0.65 } },
          }}
        >
          <span
            className="badge-spark"
          >✳</span>
          <span>FULL-STACK WEB DEVELOPER &amp; DESIGNER</span>
        </motion.div>
        <h1 className="hero-title" id="hero-heading">
          <span className="hero-title-line">
            <motion.span
              variants={{
                hidden: { opacity: 0, y: 80 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 75, damping: 17 } },
              }}
            >
              Building reliable software
            </motion.span>
          </span>
          <span className="hero-title-line">
            <motion.span
              variants={{
                hidden: { opacity: 0, y: 80 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 75, damping: 17 } },
              }}
            >
              from scratch
            </motion.span>
          </span>
        </h1>
        <motion.p
          className="hero-description"
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
        >
          I’m a full-stack developer who likes building things that just work. No corporate bloat, no unnecessary complexity—just solid architecture, clean code, and software you can actually rely on
        </motion.p>
        <motion.div
          className="hero-actions"
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
        >
          <motion.a className="pill-button pill-button-primary" href="#projects" whileHover={{ scale: 1.035 }} whileTap={{ scale: 0.97 }}>
            Explore projects <ArrowUpRight size={14} aria-hidden="true" />
          </motion.a>
          <motion.a
            className="pill-button hero-contact-button"
            href="#contact"
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.97 }}
          >
            Contact me <ArrowUpRight size={14} aria-hidden="true" />
          </motion.a>
        </motion.div>

        <motion.div
          className="hero-socials"
          aria-label="Social profiles"
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
          style={{ display: "flex", gap: 10, marginTop: 32, alignItems: "center", justifyContent: "center" }}
        >
          {[
            { label: "LinkedIn", href: "https://www.linkedin.com/chukwunonso-ezekwenna-07712625b", Icon: Linkedin },
            { label: "GitHub", href: "https://github.com/DantelCode", Icon: Github },
            { label: "Facebook", href: "https://www.facebook.com/share/1MRsVoztap/", Icon: Facebook },
          ].map(({ label, href, Icon }) => (
            <motion.a
              key={label}
              className="hero-social-link"
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Visit ${label}`}
              onClick={() => posthog.capture("social_profile_opened", { platform: label, placement: "hero" })}
              whileHover={{ scale: 1.12, y: -3, rotate: -4 }}
              whileTap={{ scale: 0.9, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              style={{
                display: "grid",
                placeItems: "center",
                width: 36,
                height: 36,
                border: "1px solid currentColor",
                borderRadius: "50%",
              }}
            >
              <Icon size={15} aria-hidden="true" />
            </motion.a>
          ))}
        </motion.div>

        <motion.a
          className="hero-footnote"
          href="#projects"
          aria-label="Scroll to selected work"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.8 } },
          }}
        >
          Independent by design <ArrowDown size={11} style={{ marginTop: '-1px' }} aria-hidden="true" />
        </motion.a>
      </motion.div>
    </section>
  );
}
