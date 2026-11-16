import { after } from "next/server";
import {
  posthogLogger,
  posthogLoggerProvider,
  SeverityNumber,
} from "../../../../instrumentation";

const cvUrl = "https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf";

function flushPostHogLogs() {
  if (posthogLoggerProvider) {
    after(() => posthogLoggerProvider.forceFlush().catch(() => {}));
  }
}

export async function GET() {
  posthogLogger?.emit({
    body: "CV download requested",
    severityNumber: SeverityNumber.INFO,
    attributes: {
      endpoint: "/api/cv",
      method: "GET",
    },
  });
  flushPostHogLogs();

  try {
    const response = await fetch(cvUrl, {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok || !response.body) {
      posthogLogger?.emit({
        body: "CV download unavailable",
        severityNumber: SeverityNumber.WARN,
        attributes: {
          endpoint: "/api/cv",
          outcome: "upstream_unavailable",
        },
      });
      return new Response("Unable to download the CV right now.", { status: 502 });
    }

    return new Response(response.body, {
      headers: {
        "Content-Disposition": 'attachment; filename="cv.pdf"',
        "Content-Type": "application/pdf",
      },
    });
  } catch {
    posthogLogger?.emit({
      body: "CV download failed",
      severityNumber: SeverityNumber.WARN,
      attributes: {
        endpoint: "/api/cv",
        outcome: "request_failed",
      },
    });
    return new Response("Unable to download the CV right now.", { status: 502 });
  }
}
