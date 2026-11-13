"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

const updates = [
  <> <strong>Designing dependable systems</strong> &amp; shipping thoughtful full-stack products</>,
  <>Exploring <strong>resilient APIs</strong>, data flows &amp; product performance</>,
  <>Turning <strong>curiosity into craft</strong> — one considered build at a time</>,
  <>Squeezing <strong>better performance</strong> out of modern web apps</>
];

export default function StatusTicker() {
  const [activeUpdate, setActiveUpdate] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveUpdate((current) => (current + 1) % updates.length);
    }, 4200);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="ticker-wrap" aria-label="Current work status">
      <div className="status-ticker">
        <span className="ticker-dot" />
        <span className="ticker-label">CURRENTLY FOCUSED ON</span>
        <AnimatePresence mode="wait">
          <motion.p
            className="ticker-text"
            key={activeUpdate}
            aria-live="polite"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.22 }}
          >
            {updates[activeUpdate]}
          </motion.p>
        </AnimatePresence>
        <Activity size={14} color="#8f7bc9" aria-hidden="true" />
      </div>
    </div>
  );
}
