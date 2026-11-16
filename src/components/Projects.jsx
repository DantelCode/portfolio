"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, ExternalLink, Github } from "lucide-react";
import posthog from "posthog-js";
import StatusTicker from "@/components/StatusTicker";

const posthogConfigured = Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST);
const projects = [
  {
    id: "01",
    category: "Product analytics · concept build",
    name: "Pulseboard",
    description: "A focused analytics workspace for seeing what matters, with clear metrics, event streams, and a calmer view of product health.",
    tags: ["Next.js", "JavaScript", "PostgreSQL", "Tailwind"],
    featured: true,
  },
  {
    id: "02",
    category: "Commerce · systems study",
    name: "Forma",
    description: "A considered storefront experience backed by a composable catalogue and reliable checkout flows.",
    tags: ["React", "Node.js", "Stripe"],
    featured: false,
  },
  {
    id: "03",
    category: "Developer tools · concept build",
    name: "Relay",
    description: "A compact API observability dashboard for tracing requests, inspecting errors, and finding slow paths.",
    tags: ["JavaScript", "Redis", "Docker"],
    featured: false,
  },
];

const pulseboardProgress = [
  {
    title: "Product direction",
    description: "Core audience, key signals, and the product flow are mapped.",
    status: "Complete",
  },
  {
    title: "Dashboard foundations",
    description: "Building the overview, event stream, and product health metrics.",
    status: "In progress",
    current: true,
  },
  {
    title: "Interaction polish",
    description: "Responsive states, chart details, and final quality checks are next.",
    status: "Up next",
  },
];

function DashboardPreview() {
  return (
    <div className="project-preview" aria-hidden="true">
      <div className="preview-orbit" />
      <div className="dashboard-mock">
        <div className="mock-topbar">
          <div className="mock-dots"><i /><i /><i /></div>
          <span className="mock-title">pulseboard / overview</span>
          <span className="mock-title">● live</span>
        </div>
        <div className="mock-body">
          <div className="mock-sidebar">
            {Array.from({ length: 6 }, (_, index) => <span className="mock-side-line" key={index} />)}
          </div>
          <div className="mock-content">
            <span className="mock-overline">PRODUCT OVERVIEW</span>
            <div className="mock-stat-row">
              <div className="mock-stat"><span>Active users</span><strong>12,486</strong></div>
              <div className="mock-stat"><span>Conversion</span><strong>4.82%</strong></div>
              <div className="mock-stat"><span>Retention</span><strong>68.4%</strong></div>
            </div>
            <div className="chart">
              <svg viewBox="0 0 340 66" preserveAspectRatio="none">
                <defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#a183f4" stopOpacity=".24" /><stop offset="100%" stopColor="#a183f4" stopOpacity="0" /></linearGradient></defs>
                <path d="M0 53 C20 49 24 40 43 43 S73 52 92 34 S121 43 142 30 S167 38 188 23 S215 34 238 17 S274 31 293 12 S322 18 340 5 V66 H0Z" fill="url(#chart-fill)" />
                <path d="M0 53 C20 49 24 40 43 43 S73 52 92 34 S121 43 142 30 S167 38 188 23 S215 34 238 17 S274 31 293 12 S322 18 340 5" fill="none" stroke="#ad91ff" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SmallPreview({ variant }) {
  return (
    <div className="project-preview" aria-hidden="true">
      <div className="preview-orbit" />
      <div className="mock-cards-row">
        <div className="mini-card" style={{ background: variant === 1 ? undefined : "linear-gradient(150deg, rgba(64, 105, 131, .2), rgba(20, 19, 29, .8))" }} />
        <div className="mini-card" style={{ background: variant === 1 ? "linear-gradient(150deg, rgba(51, 120, 109, .21), rgba(20, 19, 29, .8))" : undefined }} />
      </div>
    </div>
  );
}

function ProjectProgress() {
  return (
    <section className="project-progress" aria-label="Pulseboard build progress">
      <div className="project-progress-heading">
        <h4>Build progress</h4>
        <span>3 stages</span>
      </div>
      <ol className="progress-timeline">
        {pulseboardProgress.map((step) => (
          <li
            className={`progress-step${step.current ? " progress-step-current" : ""}`}
            aria-current={step.current ? "step" : undefined}
            key={step.title}
          >
            <span className="progress-step-marker" aria-hidden="true" />
            <div className="progress-step-copy">
              <div className="progress-step-title-row">
                <h5>{step.title}</h5>
                <span className="progress-step-status">{step.status}</span>
              </div>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function updateSpotlight(event) {
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
  event.currentTarget.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
}

export default function Projects() {
  return (
    <section className="section projects-section page-shell" id="projects" aria-labelledby="projects-title">
      <StatusTicker />

      <div className="projects-heading-row">
        <div className="section-heading">
          <span className="eyebrow">Selected work · 2025—26</span>
          <h2 className="section-title" id="projects-title">Built with intent.<br /><span className="serif-italic">Made to matter.</span></h2>
        </div>
        <p className="projects-note"><ArrowDownRight size={14} /> Independent explorations &amp; builds</p>
      </div>

      <div className="project-grid">
        <style>{`
          .project-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            align-items: stretch;
          }

          .project-grid .project-column {
            min-width: 0;
          }

          .project-grid .project-column-left {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .project-grid .project-column-right {
            display: grid;
            grid-template-rows: repeat(2, minmax(0, 1fr));
            gap: 24px;
          }

          @media (max-width: 700px) {
            .project-grid {
              grid-template-columns: 1fr;
            }

            .project-grid .project-column {
              display: contents;
            }

            .project-grid .project-column-right {
              grid-template-rows: none;
            }

            .project-grid .technology-card {
              order: 1;
            }
          }
        `}</style>
        <div className="project-column project-column-left">
        {projects.map((project, index) => (
          project.featured && (
          <motion.article
            key={project.id}
            className={`project-card${project.featured ? " project-featured" : ""}`}
            onMouseMove={updateSpotlight}
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.16 }}
            transition={{ duration: 0.65, delay: index * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {project.featured ? <DashboardPreview /> : <SmallPreview variant={index} />}
            <div className="project-content">
              <div className="project-meta"><span>{project.category}</span><span>{project.id} / 04</span></div>
              <div className="project-title-row">
                <h3 className="project-title">{project.name}</h3>
                <span className="project-arrow"><ArrowUpRight size={16} aria-hidden="true" /></span>
              </div>
              <p className="project-description">{project.description}</p>
              {project.featured && <ProjectProgress />}
              <div className="project-tags">
                {project.tags.map((tag) => <span className="project-tag" key={tag}>{tag}</span>)}
              </div>
              <div className="project-links">
                <a
                  className="project-link"
                  href="#contact"
                  aria-label={`Ask about ${project.name}`}
                  onClick={() => posthogConfigured && posthog.capture("project_contact_requested", { project_id: project.id })}
                >
                  <ExternalLink size={12} /> Discuss project
                </a>
                <a
                  className="project-link"
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Browse GitHub repositories"
                  onClick={() => posthogConfigured && posthog.capture("project_repository_opened", { project_id: project.id })}
                >
                  <Github size={12} /> GitHub
                </a>
              </div>
            </div>
          </motion.article>
          )
        ))}
        
        <motion.article
          className="project-card technology-card"
          aria-label="Technologies used"
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 0.65, delay: projects.length * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="project-content">
            <div className="project-meta"><span>Tools &amp; technologies</span><span>04 / 04</span></div>
            <h3 className="project-title">My tech stack</h3>
            <p className="project-description">The tools I use to design, build, and ship digital experiences.</p>
            <div className="project-tags" style={{ gap: "8px" }} aria-label="Technologies">
              {["Next.js", "Node.js", "React", "MongoDB", "Firebase", "Render"].map((technology) => (
                <motion.span
                  className="project-tag"
                  style={{ fontSize: "16px", borderRadius: "4px", cursor: "pointer" }}
                  whileHover={{ scale: 1.08, y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 16 }}
                  key={technology}
                >
                  {technology}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.article>
        </div>
        <div className="project-column project-column-right">
        {projects.map((project, index) => (
          !project.featured && (
          <motion.article
            key={project.id}
            className="project-card"
            onMouseMove={updateSpotlight}
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.16 }}
            transition={{ duration: 0.65, delay: index * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <SmallPreview variant={index} />
            <div className="project-content">
              <div className="project-meta"><span>{project.category}</span><span>{project.id} / 04</span></div>
              <div className="project-title-row">
                <h3 className="project-title">{project.name}</h3>
                <span className="project-arrow"><ArrowUpRight size={16} aria-hidden="true" /></span>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => <span className="project-tag" key={tag}>{tag}</span>)}
              </div>
              <div className="project-links">
                <a
                  className="project-link"
                  href="#contact"
                  aria-label={`Ask about ${project.name}`}
                  onClick={() => posthogConfigured && posthog.capture("project_contact_requested", { project_id: project.id })}
                >
                  <ExternalLink size={12} /> Discuss project
                </a>
                <a
                  className="project-link"
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Browse GitHub repositories"
                  onClick={() => posthogConfigured && posthog.capture("project_repository_opened", { project_id: project.id })}
                >
                  <Github size={12} /> GitHub
                </a>
              </div>
            </div>
          </motion.article>
          )
        ))}
        </div>
      </div>
    </section>
  );
}
