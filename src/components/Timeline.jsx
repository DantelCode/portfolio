"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Award, ExternalLink, X } from "lucide-react";
import posthog from "posthog-js";
import { useEffect, useRef, useState } from "react";

const posthogConfigured = Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST);

const achievements = [
  {
    date: "15 Jul 2022",
    dateTime: "2022-03-15",
    title: "Responsive Web Design",
    issuer: "FreeCodeCamp",
    description: "Legacy Responsive Web Design V8",
    certificateUrl: "https://www.freecodecamp.org/certification/fcc16c15ca7-75ae-41a0-a3cf-8fac80c75f44/responsive-web-design",
    type: "Certificate",
  },
  {
    date: "25 Sept 2022",
    dateTime: "2022-09-25",
    title: "JavaScript Algorithms and Data Structures",
    issuer: "FreeCodeCamp",
    description: "Legacy JavaScript Algorithms and Data Structures V7",
    certificateUrl: "https://freecodecamp.org/certification/fcc16c15ca7-75ae-41a0-a3cf-8fac80c75f44/javascript-algorithms-and-data-structures",
    type: "Certificate",
  },
  {
    date: "17 Dec 2022",
    dateTime: "2022-12-17",
    title: "Front-End Development Libraries",
    issuer: "FreeCodeCamp",
    description: "Front-End Development Libraries V8",
    certificateUrl: "https://freecodecamp.org/certification/fcc16c15ca7-75ae-41a0-a3cf-8fac80c75f44/front-end-development-libraries",
    type: "Certificate",
  },
  {
    date: "20 Dec 2022",
    dateTime: "2022-12-20",
    title: "Data Visualization",
    issuer: "FreeCodeCamp",
    description: "Data Visualization V8",
    certificateUrl: "https://freecodecamp.org/certification/fcc16c15ca7-75ae-41a0-a3cf-8fac80c75f44/data-visualization",
    type: "Certificate",
  },
  {
    date: "07 Jan 2023",
    dateTime: "2023-01-07",
    title: "Relational Database",
    issuer: "FreeCodeCamp",
    description: "Relational Database V8",
    certificateUrl: "https://freecodecamp.org/certification/fcc16c15ca7-75ae-41a0-a3cf-8fac80c75f44/relational-database-v8",
    type: "Certificate",
  },
  {
    date: "24 Jan 2023",
    dateTime: "2023-01-24",
    title: "Back-End Development and APIs",
    issuer: "FreeCodeCamp",
    description: "Back-End Development and APIs V8",
    certificateUrl: "https://freecodecamp.org/certification/fcc16c15ca7-75ae-41a0-a3cf-8fac80c75f44/back-end-development-and-apis",
    type: "Certificate",
  },
  {
    date: "16 Aug 2023",
    dateTime: "2023-08-16",
    title: "Scientific Computing with Python",
    issuer: "FreeCodeCamp",
    description: "Scientific Computing with Python V7",
    certificateUrl: "https://freecodecamp.org/certification/fcc16c15ca7-75ae-41a0-a3cf-8fac80c75f44/scientific-computing-with-python-v7",
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
    if (posthogConfigured) posthog.capture("certificate_opened", { certificate_type: achievement.type });
    setSelectedAchievement(achievement);
  };

  return (
    <section className="section timeline-section page-shell" id="timeline" aria-labelledby="timeline-title">
      <div className="timeline-heading">
        <div>
          <span className="eyebrow">Timeline</span>
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
                <time className="achievement-card-date" dateTime={achievement.dateTime}>{achievement.date}</time>
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
