"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Cloud, Code2, Copy, Database, Globe2, Layers3, Server, Workflow } from "lucide-react";
import { useState } from "react";
import posthog from "posthog-js";

const layers = [
  {
    id: "frontend",
    label: "Frontend",
    count: "04 tools",
    description: "Interfaces built for clarity, accessibility, and speed — designed to feel effortless.",
    file: "app/page.jsx",
    code: [
      { text: "export", kind: "keyword" }, { text: " default ", kind: "" }, { text: "async", kind: "keyword" },
      { text: " function ", kind: "" }, { text: "Page", kind: "type" }, { text: "() {\n", kind: "" },
      { text: "  const ", kind: "keyword" }, { text: "data", kind: "property" }, { text: " = await ", kind: "" },
      { text: "getProducts", kind: "type" }, { text: "()\n\n", kind: "" },
      { text: "  return ", kind: "keyword" }, { text: "(\n    <", kind: "" }, { text: "ProductGrid", kind: "type" },
      { text: " items={data} />\n  )\n}", kind: "" },
    ],
    nodes: ["Next.js", "React", "JavaScript", "Tailwind", "Accessible UI"],
    icon: Globe2,
  },
  {
    id: "backend",
    label: "Backend",
    count: "04 tools",
    description: "Reliable APIs and focused services with explicit boundaries and predictable behavior.",
    file: "api/products.js",
    code: [
      { text: "const ", kind: "keyword" }, { text: "router", kind: "property" }, { text: " = ", kind: "" },
      { text: "Router", kind: "type" }, { text: "()\n\n", kind: "" },
      { text: "router", kind: "property" }, { text: ".", kind: "" }, { text: "get", kind: "type" }, { text: "(", kind: "" },
      { text: "'/products'", kind: "string" }, { text: ", async (req, res) => {\n", kind: "" },
      { text: "  const ", kind: "keyword" }, { text: "products", kind: "property" }, { text: " = await ", kind: "" },
      { text: "catalog", kind: "type" }, { text: ".", kind: "" }, { text: "list", kind: "type" }, { text: "()\n", kind: "" },
      { text: "  res", kind: "property" }, { text: ".", kind: "" }, { text: "json", kind: "type" },
      { text: "({ products })\n})", kind: "" },
    ],
    nodes: ["Node.js", "Express", "JavaScript", "REST API", "Validation"],
    icon: Server,
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    count: "05 tools",
    description: "Practical infrastructure that makes data durable, delivery repeatable, and growth manageable.",
    file: "compose.yaml",
    code: [
      { text: "services", kind: "property" }, { text: ":\n  ", kind: "" }, { text: "api", kind: "type" },
      { text: ":\n    ", kind: "" }, { text: "build", kind: "property" }, { text: ": ", kind: "" },
      { text: ".", kind: "string" }, { text: "\n    ", kind: "" }, { text: "depends_on", kind: "property" },
      { text: ":\n      - ", kind: "" }, { text: "postgres", kind: "type" }, { text: "\n      - ", kind: "" },
      { text: "redis", kind: "type" }, { text: "\n  ", kind: "" }, { text: "postgres", kind: "type" },
      { text: ":\n    ", kind: "" }, { text: "image", kind: "property" },
      { text: ": ", kind: "" }, { text: "postgres:16-alpine", kind: "string" },
    ],
    nodes: ["PostgreSQL", "Redis", "Docker", "AWS", "CI / CD"],
    icon: Cloud,
  },
];

export default function Architecture() {
  const [activeLayer, setActiveLayer] = useState(layers[0]);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const LayerIcon = activeLayer.icon;
  const codeText = activeLayer.code.map((part) => part.text).join("");

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setCopyError(false);
      if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
        posthog.capture("architecture_code_copied", { layer: activeLayer.id });
      }
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
    }
  };

  return (
    <section className="section architecture-section" id="architecture" aria-labelledby="architecture-title">
      <div className="page-shell">
        <div className="architecture-heading">
          <span className="eyebrow">How it fits together</span>
          <div className="section-heading">
            <h2 className="section-title" id="architecture-title">Engineering philosophy<br />&amp; <span className="serif-italic">tech stack.</span></h2>
            <p className="muted-copy">The right tool for the job. A simple, cohesive stack that stays understandable as products grow.</p>
          </div>
        </div>
        <div className="architecture-panel">
          <div className="architecture-left">
            <div className="layer-list" role="tablist" aria-label="Technology layers">
              {layers.map((layer) => {
                const Icon = layer.icon;
                return (
                  <button
                    className={`layer-button${activeLayer.id === layer.id ? " selected" : ""}`}
                    key={layer.id}
                    role="tab"
                    id={`tab-${layer.id}`}
                    aria-selected={activeLayer.id === layer.id}
                    aria-controls="architecture-detail"
                    onClick={() => {
                      setActiveLayer(layer);
                      setCopied(false);
                      setCopyError(false);
                      if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
                        posthog.capture("technology_layer_selected", { layer: layer.id });
                      }
                    }}
                  >
                    <span className="layer-label"><Icon size={16} />{layer.label}</span>
                    <span className="layer-count">{layer.count}</span>
                  </button>
                );
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                className="architecture-note"
                key={activeLayer.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <span>Design principle</span>
                {activeLayer.description}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="architecture-right" id="architecture-detail" role="tabpanel" aria-labelledby={`tab-${activeLayer.id}`}>
            <motion.div className="schema-card" key={`schema-${activeLayer.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
              <svg className="schema-network" viewBox="0 0 420 145" fill="none" aria-hidden="true">
                <line className="schema-line" x1="80" y1="38" x2="210" y2="75" />
                <line className="schema-line" x1="340" y1="38" x2="210" y2="75" />
                <line className="schema-line" x1="85" y1="122" x2="210" y2="75" />
                <line className="schema-line" x1="335" y1="122" x2="210" y2="75" />
              </svg>
              <span className="schema-node node-a"><Code2 size={12} />{activeLayer.nodes[0]}</span>
              <span className="schema-node node-b"><Database size={12} />{activeLayer.nodes[1]}</span>
              <span className="schema-node node-center"><LayerIcon size={12} />{activeLayer.label}</span>
              <span className="schema-node node-c"><Workflow size={12} />{activeLayer.nodes[2]}</span>
              <span className="schema-node node-d"><Layers3 size={12} />{activeLayer.nodes[3]}</span>
            </motion.div>
            <div className="code-card">
              <div className="code-toolbar">
                <span className="code-file">{activeLayer.file}</span>
                <button className="copy-code" onClick={copyCode} aria-label="Copy code example">
                  {copied ? <Check size={11} /> : copyError ? <Copy size={11} /> : <Copy size={11} />}
                  {copied ? "Copied" : copyError ? "Copy unavailable" : "Copy code"}
                </button>
              </div>
              <AnimatePresence mode="wait">
                <motion.pre
                  className="code-content"
                  key={activeLayer.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.18 }}
                >
                  {activeLayer.code.map((part, index) => <span className={part.kind ? `code-${part.kind}` : ""} key={`${activeLayer.id}-${index}`}>{part.text}</span>)}
                </motion.pre>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
