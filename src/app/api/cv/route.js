const cvUrl = "https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf";

export async function GET() {
  try {
    const response = await fetch(cvUrl, {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok || !response.body) {
      return new Response("Unable to download the CV right now.", { status: 502 });
    }

    return new Response(response.body, {
      headers: {
        "Content-Disposition": 'attachment; filename="cv.pdf"',
        "Content-Type": "application/pdf",
      },
    });
  } catch {
    return new Response("Unable to download the CV right now.", { status: 502 });
  }
}
