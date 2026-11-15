import { SeverityNumber } from "@opentelemetry/api-logs";
import { after } from "next/server";
import { loggerProvider } from "../../../../instrumentation";

const cvUrl = "https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf";
const logger = loggerProvider?.getLogger("posthog-cv-download");

function flushLogsAfterResponse() {
  if (loggerProvider) {
    after(async () => {
      await loggerProvider.forceFlush().catch(() => {});
    });
  }
}

export async function GET() {
  logger?.emit({
    body: "CV download requested",
    severityNumber: SeverityNumber.INFO,
    attributes: { endpoint: "/api/cv", method: "GET" },
  });

  try {
    const response = await fetch(cvUrl, {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok || !response.body) {
      logger?.emit({
        body: "CV download unavailable",
        severityNumber: SeverityNumber.WARN,
        attributes: { endpoint: "/api/cv", upstream_status: response.status },
      });
      flushLogsAfterResponse();
      return new Response("Unable to download the CV right now.", { status: 502 });
    }

    logger?.emit({
      body: "CV download stream ready",
      severityNumber: SeverityNumber.INFO,
      attributes: { endpoint: "/api/cv" },
    });
    flushLogsAfterResponse();
    return new Response(response.body, {
      headers: {
        "Content-Disposition": 'attachment; filename="cv.pdf"',
        "Content-Type": "application/pdf",
      },
    });
  } catch {
    logger?.emit({
      body: "CV download failed",
      severityNumber: SeverityNumber.ERROR,
      attributes: { endpoint: "/api/cv" },
    });
    flushLogsAfterResponse();
    return new Response("Unable to download the CV right now.", { status: 502 });
  }
}
