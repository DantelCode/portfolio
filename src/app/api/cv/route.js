import { SeverityNumber } from "@opentelemetry/api-logs";
import { after } from "next/server";
import { loggerProvider } from "../../../../instrumentation";

const cvUrl = "https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf";
const logger = loggerProvider?.getLogger("dantel-portfolio.cv-download");

function flushLogs() {
  if (loggerProvider) after(() => loggerProvider.forceFlush().catch(() => {}));
}

export async function GET() {
  const startedAt = Date.now();

  try {
    const response = await fetch(cvUrl, {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok || !response.body) {
      logger?.emit({
        body: "CV download upstream response unavailable",
        severityNumber: SeverityNumber.WARN,
        attributes: {
          event: "cv_download_completed",
          outcome: "upstream_unavailable",
          upstream_status_code: response.status,
          duration_ms: Date.now() - startedAt,
        },
      });
      flushLogs();
      return new Response("Unable to download the CV right now.", { status: 502 });
    }

    logger?.emit({
      body: "CV download completed",
      severityNumber: SeverityNumber.INFO,
      attributes: {
        event: "cv_download_completed",
        outcome: "success",
        duration_ms: Date.now() - startedAt,
      },
    });
    flushLogs();

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
      attributes: {
        event: "cv_download_completed",
        outcome: "fetch_failed",
        duration_ms: Date.now() - startedAt,
      },
    });
    flushLogs();
    return new Response("Unable to download the CV right now.", { status: 502 });
  }
}
