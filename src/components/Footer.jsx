"use client";

import { ArrowRight, ArrowUp, Check, Facebook, Github, Linkedin, Mail, Send } from "lucide-react";
import posthog from "posthog-js";
import { useState } from "react";
import { AnalyticsNotice } from "@/components/Analytics";

const email = "ezekwennacd@gmail.com";
const posthogConfigured = Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST);
const viewDate = new Date().getFullYear();

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [command, setCommand] = useState("");
  const [entries, setEntries] = useState([]);
  const [matrixPlaying, setMatrixPlaying] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      if (posthogConfigured) posthog.capture("contact_email_copied");
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyError(true);
    }
  };

  const runCommand = (event) => {
    event.preventDefault();
    const input = command.trim();
    if (!input) return;
    const normalized = input.toLowerCase();
    let response;

    if (normalized === "clear") {
      setEntries([]);
      setCommand("");
      return;
    } else if (normalized === "help") {
      response = <>Commands: <span className="code-string">help</span>, <span className="code-string">contact</span>, <span className="code-string">socials</span>, <span className="code-string">projects</span>, <span className="code-string">about</span>, <span className="code-string">matrix</span>, <span className="code-string">matrix stop</span>, <span className="code-string">clear</span></>;
    } else if (normalized === "contact") {
      response = <>Reach me at <a href={`mailto:${email}`}>{email}</a></>;
    } else if (normalized === "socials") {
      response = <>GitHub: <a href="https://github.com/DantelCode" target="_blank" rel="noreferrer">DantelCode</a> • LinkedIn: <a href="https://www.linkedin.com/chukwunonso-ezekwenna-07712625b" target="_blank" rel="noreferrer">LinkedIn</a> • Facebook: <a href="https://www.facebook.com/share/1MRsVoztap/" target="_blank" rel="noreferrer">Facebook</a></>;
    } else if (normalized === "projects") {
      response = <>Jump to <a href="#projects">selected projects</a>.</>;
    } else if (normalized === "about") {
      response = <>Jump to <a href="#about">about me</a>.</>;
    } else if (normalized === "matrix") {
      setMatrixPlaying(true);
      response = <>Matrix animation started. Type <span className="code-string">matrix stop</span> to stop it.</>;
    } else if (normalized === "matrix stop") {
      setMatrixPlaying(false);
      response = <>Matrix animation stopped.</>;
    } else {
      response = <>Command not found: <span className="code-string">{input}</span>. Try <span className="code-string">help</span>.</>;
    }

    setEntries((previous) => [...previous.slice(-5), { command: input, response }]);
    setCommand("");
  };

  return (
    <footer className="footer" id="contact">
      <div className="page-shell">
        <div className="footer-content">
          <div>
            <span className="eyebrow">Have something in mind?</span>
            <h2 className="footer-title">Let’s build<br /><span className="serif-italic">something good.</span></h2>
            <p className="footer-copy">Got an interesting problem to solve, a project in mind, or just want to talk code? My inbox is open.</p>
            <div className="footer-contact-row">
              <button className="pill-button pill-button-primary" onClick={copyEmail}>
                {copied ? <Check size={14} /> : <Mail size={14} />}
                {copied ? "Copied!" : copyError ? "Copy unavailable" : email}
              </button>
              <a
                className="pill-button"
                href={`mailto:${email}`}
                onClick={() => posthogConfigured && posthog.capture("contact_email_started")}
              >
                Send an email <ArrowRight size={13} />
              </a>
            </div>
            <div className="footer-socials" aria-label="Social profiles">
              <a className="icon-button" href="https://github.com/DantelCode" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={15} /></a>
              <a className="icon-button" href="https://www.linkedin.com/in/chukwunonso-ezekwenna-07712625b/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={15} /></a>
              <a className="icon-button" href="https://www.facebook.com/share/1MRsVoztap/" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={15} /></a>
            </div>
          </div>

          <div className="terminal" aria-label="Interactive terminal">
            <div className="terminal-header">
              <div className="mock-dots"><i /><i /><i /></div>
              <span className="terminal-name">Dantel — interactive shell</span>
            </div>
            <div className="terminal-body" aria-live="polite">
              <p className="terminal-output">Welcome. Type <span className="code-string">help</span> to see what you can do.</p>
              {entries.map((entry, index) => (
                <div key={`${entry.command}-${index}`}>
                  <p className="terminal-line"><span className="terminal-prompt">›</span><span>{entry.command}</span></p>
                  <p className="terminal-output">{entry.response}</p>
                </div>
              ))}
              {matrixPlaying && (
                <div className="terminal-matrix" aria-hidden="true">
                  {Array.from({ length: 8 }, (_, index) => (
                    <span key={index} style={{ "--matrix-column": index }}>
                      0<br />1<br />1<br />0<br />1<br />0<br />0<br />1
                    </span>
                  ))}
                </div>
              )}
              <form className="terminal-form" onSubmit={runCommand}>
                <span className="terminal-prompt">›</span>
                <input
                  value={command}
                  onChange={(event) => setCommand(event.target.value)}
                  aria-label="Enter terminal command"
                  placeholder="Type a command..."
                  autoComplete="off"
                  spellCheck={false}
                />
                <button className="icon-button" type="submit" aria-label="Run command"><Send size={12} /></button>
              </form>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span style={{ letterSpacing: "-1px" }}><span style={{ fontSize: "18px" }}>©</span> {viewDate} Dantel. Built with care.</span>
          <a className="back-top" href="#top">Back to top <ArrowUp size={12} /></a>
        </div>
        <AnalyticsNotice />
      </div>
    </footer>
  );
}
