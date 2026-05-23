import { NextResponse } from "next/server";
import { getPublicContent } from "@/lib/content";
import { isSafeCloudinaryPdfUrl, safeErrorResponse } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizePlayerName(value = "") {
  return String(value || "player")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "player";
}

function buildContentDispositionHeader(playerName, disposition = "attachment") {
  const safeName = `${normalizePlayerName(playerName)}-CV.pdf`;
  const encodedName = encodeURIComponent(safeName);
  const safeDisposition = disposition === "inline" ? "inline" : "attachment";
  return `${safeDisposition}; filename="player-CV.pdf"; filename*=UTF-8''${encodedName}`;
}

function resolveCvUrl(cvUrl, requestUrl) {
  const raw = String(cvUrl || "").trim();
  if (!isSafeCloudinaryPdfUrl(raw)) return null;

  if (raw.startsWith("/assets/cv/")) {
    return new URL(raw, requestUrl).toString();
  }

  return raw;
}

export async function GET(request) {
  try {
    const content = await getPublicContent();
    const requestUrl = new URL(request.url);
    const disposition = requestUrl.searchParams.get("preview") === "1" ? "inline" : "attachment";
    const cvUrl = content?.hero?.primaryButtonUrl;
    const resolvedUrl = resolveCvUrl(cvUrl, request.url);

    if (!resolvedUrl) {
      return NextResponse.json({ error: "CV file is not available." }, { status: 404 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const upstream = await fetch(resolvedUrl, { cache: "no-store", signal: controller.signal });
    clearTimeout(timeout);

    if (!upstream.ok) {
      return NextResponse.json({ error: "CV file could not be downloaded." }, { status: 404 });
    }

    const contentType = upstream.headers.get("content-type") || "application/pdf";
    if (!contentType.includes("pdf") && !resolvedUrl.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "CV file is not a PDF." }, { status: 400 });
    }

    const fileBuffer = await upstream.arrayBuffer();
    const maxBytes = 15 * 1024 * 1024;
    if (fileBuffer.byteLength > maxBytes) {
      return NextResponse.json({ error: "CV file is too large." }, { status: 413 });
    }

    const firstBytes = Buffer.from(fileBuffer.slice(0, 4)).toString("utf8");
    if (firstBytes !== "%PDF") {
      return NextResponse.json({ error: "Invalid PDF file." }, { status: 400 });
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(fileBuffer.byteLength),
        "Content-Disposition": buildContentDispositionHeader(content?.hero?.name, disposition),
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error) {
    return safeErrorResponse(error, "CV download failed.", 500);
  }
}
