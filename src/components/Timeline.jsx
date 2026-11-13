"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Award, ExternalLink, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const achievements = [
  {
    date: "20 Mar 2024",
    dateTime: "2024-03-20",
    title: "abc",
    issuer: "feec",
    description: "desccc",
    certificateUrl: "https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf",
    type: "Certificate",
  },
  {
    date: "20 Mar 2025",
    dateTime: "2024-03-21",
    title: "abcd",
    issuer: "feec",
    description: "desccc",
    certificateUrl: "https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf",
    type: "Certificate",
  },
];

function updateSpotlight(event) {
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--timeline-spot-x", `${event.clientX - bounds.left}px`);
  event.currentTarget.style.setProperty("--timeline-spot-y", `${event.clientY - bounds.top}px`);
}

export default function Timeline() {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const closeButtonRef = useRef(null);
  const triggerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!selectedAchievement) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedAchievement(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      triggerRef.current?.focus();
    };
  }, [selectedAchievement]);

  const openCertificate = (achievement, event) => {
    triggerRef.current = event.currentTarget;
    setSelectedAchievement(achievement);
  };

  return (
    <section className="section timeline-section page-shell" id="timeline" aria-labelledby="timeline-title">
      <div className="timeline-heading">
        <div>
          <span className="eyebrow">Learning, made tangible</span>
          <h2 className="section-title" id="timeline-title">
            Milestones &amp;<br /><span className="serif-italic">proof.</span>
          </h2>
        </div>
        <p className="timeline-intro">
          A few markers along the way — each one a little proof of the work, curiosity, and commitment behind it.
        </p>
      </div>

      <div className="achievement-timeline">
        <svg className="timeline-thread" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M50 0 C8 19 91 31 50 50 S9 81 50 100" />
        </svg>
        <div className="timeline-thread-glow" aria-hidden="true" />
        <ol className="achievement-list">
          {achievements.map((achievement, index) => (
            <motion.li
              className="achievement-item"
              key={`${achievement.dateTime}-${achievement.title}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.55, delay: shouldReduceMotion ? 0 : index * 0.12 }}
            >
              <div className="achievement-date">
                <span className="achievement-node" aria-hidden="true" />
                <time dateTime={achievement.dateTime}>{achievement.date}</time>
                <span className="achievement-index">{String(index + 1).padStart(2, "0")} / {String(achievements.length).padStart(2, "0")}</span>
              </div>

              <article className="achievement-card" onMouseMove={updateSpotlight}>
                <div className="achievement-card-top">
                  <span className="achievement-type"><Award size={13} aria-hidden="true" />{achievement.type}</span>
                  <span className="achievement-issuer">{achievement.issuer}</span>
                </div>
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                <button
                  className="achievement-open"
                  type="button"
                  onClick={(event) => openCertificate(achievement, event)}
                  aria-label={`Open ${achievement.title} certificate`}
                >
                  <span>View certificate</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </button>
              </article>
            </motion.li>
          ))}
        </ol>
      </div>

      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            className="certificate-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedAchievement(null);
            }}
          >
            <motion.div
              className="certificate-window"
              role="dialog"
              aria-modal="true"
              aria-labelledby="certificate-window-title"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 18, rotateX: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12, rotateX: 3 }}
              transition={{ type: "spring", stiffness: 260, damping: 25, duration: shouldReduceMotion ? 0 : undefined }}
            >
              <div className="certificate-window-bar">
                <div className="certificate-window-controls" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <h3 id="certificate-window-title">{selectedAchievement.title}</h3>
                <a
                  className="certificate-external"
                  href={selectedAchievement.certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open certificate in a new tab"
                >
                  <ExternalLink size={14} />
                </a>
                <button
                  className="certificate-close"
                  type="button"
                  onClick={() => setSelectedAchievement(null)}
                  ref={closeButtonRef}
                  aria-label="Close certificate"
                >
                  <X size={15} />
                </button>
              </div>
              <iframe
                className="certificate-frame"
                src={selectedAchievement.certificateUrl}
                title={`${selectedAchievement.title} certificate`}
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
