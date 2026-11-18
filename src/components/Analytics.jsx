"use client";

import posthog from "posthog-js";
import { useEffect, useState, useSyncExternalStore } from "react";

const posthogConfigured = Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST);
const optOutKey = "dantel-analytics-opt-out";
const sectionIds = ["top", "projects", "timeline", "architecture", "about", "contact"];
const subscribeToAnalyticsPreference = (callback) => {
  window.addEventListener("analytics-preference-change", callback);
  return () => window.removeEventListener("analytics-preference-change", callback);
};
const getAnalyticsOptOut = () => {
  try {
    return window.localStorage.getItem(optOutKey) === "true";
  } catch (error) {
    console.error("Unable to read the analytics preference.", error);
    return false;
  }
};

export default function Analytics() {
  useEffect(() => {
    if (!posthogConfigured) return undefined;

    let optedOut;
    try {
      optedOut = window.localStorage.getItem(optOutKey) === "true";
    } catch (error) {
      console.error("Analytics is disabled because its preference cannot be read.", error);
      return undefined;
    }

    if (optedOut) posthog.opt_out_capturing();
    else posthog.opt_in_capturing();

    let enabled = !optedOut;
    let visitActive = true;
    let activeSince = null;
    let activeMilliseconds = 0;
    const visibleSections = new Set();
    const viewedSections = new Set();
    const sectionStarts = new Map();
    const track = (event, properties, options) => {
      if (!enabled) return;
      posthog.capture(event, properties, options);
    };

    const startPageTimer = () => {
      if (enabled && !document.hidden && activeSince === null) {
        activeSince = performance.now();
      }
    };

    const pausePageTimer = () => {
      if (activeSince !== null) {
        activeMilliseconds += performance.now() - activeSince;
        activeSince = null;
      }
    };

    const finishSection = (sectionId, now = performance.now()) => {
      const startedAt = sectionStarts.get(sectionId);
      if (startedAt === undefined) return;

      sectionStarts.delete(sectionId);
      const visibleSeconds = Math.round((now - startedAt) / 100) / 10;
      if (visibleSeconds >= 1) {
        track("section_dwell", { section_id: sectionId, visible_seconds: visibleSeconds });
      }
    };

    const startSection = (sectionId) => {
      if (enabled && !document.hidden && !sectionStarts.has(sectionId)) {
        sectionStarts.set(sectionId, performance.now());
      }
    };

    const recordVisibleSections = () => {
      for (const sectionId of visibleSections) {
        if (enabled && !viewedSections.has(sectionId)) {
          viewedSections.add(sectionId);
          track("section_impression", { section_id: sectionId });
        }
        startSection(sectionId);
      }
    };

    const beginVisit = () => {
      visitActive = true;
      activeMilliseconds = 0;
      activeSince = null;
      viewedSections.clear();
      startPageTimer();
      track("page_view", {
        page_path: window.location.pathname,
        opted_in_mid_visit: false,
      });
      recordVisibleSections();
    };

    const pauseVisibleActivity = () => {
      pausePageTimer();
      for (const sectionId of sectionStarts.keys()) finishSection(sectionId);
    };

    const resumeVisibleActivity = () => {
      startPageTimer();
      recordVisibleSections();
    };

    const finishVisit = () => {
      pauseVisibleActivity();
      if (!visitActive) return;
      visitActive = false;
      track(
        "page_leave",
        {
          page_path: window.location.pathname,
          active_seconds: Math.round((activeMilliseconds / 1000) * 10) / 10,
        },
        { send_instantly: true },
      );
    };

    const sectionElements = sectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter((element) => element !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const sectionId = entry.target.id;
          const visibleThreshold = Math.min(entry.target.clientHeight, window.innerHeight) * 0.5;
          if (!document.hidden && entry.isIntersecting && entry.intersectionRect.height >= visibleThreshold) {
            visibleSections.add(sectionId);
            if (enabled && !viewedSections.has(sectionId)) {
              viewedSections.add(sectionId);
              track("section_impression", { section_id: sectionId });
            }
            startSection(sectionId);
          } else {
            visibleSections.delete(sectionId);
            finishSection(sectionId);
          }
        }
      },
      { threshold: [0, 0.01, 0.05, 0.1, 0.25, 0.5] },
    );
    sectionElements.forEach((element) => observer.observe(element));

    const onDocumentVisibilityChange = () => {
      if (document.hidden) pauseVisibleActivity();
      else resumeVisibleActivity();
    };

    const onClick = (event) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest("a, button, [role='tab']");
      if (!target || target.closest("[data-analytics-ignore]")) return;
      if (target.closest("input, textarea, [contenteditable='true']")) return;

      let destination;
      if (target instanceof HTMLAnchorElement && target.href) {
        const url = new URL(target.href, window.location.href);
        destination = url.origin === window.location.origin
          ? `${url.pathname}${url.hash}`
          : url.hostname;
      }

      track("engagement", {
        element_type: target.getAttribute("role") || target.tagName.toLowerCase(),
        section_id: target.closest("section[id], footer[id]")?.id || null,
        destination,
      });
    };

    const onPreferenceChange = () => {
      let nextOptOut;
      try {
        nextOptOut = window.localStorage.getItem(optOutKey) === "true";
      } catch (error) {
        console.error("Analytics is disabled because its preference cannot be read.", error);
        pauseVisibleActivity();
        sectionStarts.clear();
        enabled = false;
        return;
      }

      if (nextOptOut === !enabled) return;

      if (nextOptOut) {
        posthog.opt_out_capturing();
        pauseVisibleActivity();
        sectionStarts.clear();
        enabled = false;
        return;
      }

      posthog.opt_in_capturing();
      enabled = true;
      activeMilliseconds = 0;
      activeSince = null;
      track("page_view", {
        page_path: window.location.pathname,
        opted_in_mid_visit: true,
      });
      resumeVisibleActivity();
    };

    const onPageShow = (event) => {
      if (event.persisted) beginVisit();
    };

    beginVisit();
    document.addEventListener("visibilitychange", onDocumentVisibilityChange);
    document.addEventListener("click", onClick);
    window.addEventListener("pagehide", finishVisit);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("analytics-preference-change", onPreferenceChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onDocumentVisibilityChange);
      document.removeEventListener("click", onClick);
      window.removeEventListener("pagehide", finishVisit);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("analytics-preference-change", onPreferenceChange);
    };
  }, []);

  return null;
}

export function AnalyticsNotice() {
  const optedOut = useSyncExternalStore(
    subscribeToAnalyticsPreference,
    getAnalyticsOptOut,
    () => false,
  );
  const [preferenceError, setPreferenceError] = useState(false);
  const configured = posthogConfigured;

  const toggleAnalytics = () => {
    const nextOptedOut = !optedOut;
    try {
      window.localStorage.setItem(optOutKey, String(nextOptedOut));
      setPreferenceError(false);
      window.dispatchEvent(new Event("analytics-preference-change"));
    } catch (error) {
      console.error("Unable to save the analytics preference.", error);
      setPreferenceError(true);
    }
  };

  return <></>
}
