"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const narrative = "I’m Ezekwenna Chukwunonso Daniel, a web developer and designer who learned by building, breaking, and shipping real things. No traditional route—just practical experience and a focus on creating thoughtful digital experiences. I’m also sharpening my skills in web design and constantly practicing to refine my craft and create better user experiences.";
const words = narrative.split(" ");

function HighlightedWord({ word, index, progress }) {
  const start = index / words.length;
  const end = Math.min(start + 0.08, 1);
  const opacity = useTransform(progress, [start, end], [0.28, 1]);
  const color = useTransform(opacity, [0.28, 1], ["#504c59", "#f4f1f8"]);

  return <motion.span className="about-word" aria-hidden="true" style={{ opacity, color }}>{word}</motion.span>;
}

export default function About() {
  const textRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start 0.8", "end 0.5"],
  });

  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="page-shell about-grid">
        <motion.div
          className="about-intro"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">A little about me</span>
          <h2 className="section-title" id="about-title">Curiosity into<br /><span className="serif-italic">craft.</span></h2>
          <p className="muted-copy">The long way around taught me how to think, not just what to type.</p>
          <div className="about-location" aria-label="Location: Nigeria" style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "24px", fontSize: "20 px" }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path
                d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
              />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span>Nigeria</span>
          </div>
        </motion.div>

        <div>
          <p className="about-text" ref={textRef} aria-label={narrative}>
            {words.map((word, index) => <HighlightedWord key={`${word}-${index}`} word={word} index={index} progress={scrollYProgress} />)}
          </p>
          <div className="about-details">
            <div className="about-detail"><span>Approach</span><strong>Intentional &amp; iterative</strong></div>
            <div className="about-detail"><span>Focus</span><strong>Full-stack product engineering</strong></div>
            <div className="about-detail"><span>Mindset</span><strong>Always learning, always shipping</strong></div>
          </div>
        </div>
      </div>
    </section>
  );
}
