import { NextResponse } from "next/server";
import { getPublicContent } from "@/lib/content";
import { isSafeCloudinaryPdfUrl, safeErrorResponse } from "@/lib/security";
import { defaultEnglishContent } from "@/lib/i18nContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hasEnglishLetters(value = "") {
  return /[A-Za-z]/.test(String(value || ""));
}

function getEnglishPlayerName(value) {
  const fallbackName = defaultEnglishContent?.hero?.name || "player";

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const englishName = String(value.en || "").trim();
    return hasEnglishLetters(englishName) ? englishName : fallbackName;
  }

  const plainName = String(value || "").trim();
  return hasEnglishLetters(plainName) ? plainName : fallbackName;
}

function normalizeFileBaseName(value = "", fallback = "player") {
  const cleaned = String(value || fallback)
    .normalize("NFKC")
    .replace(/[\\/:*?"<>|;]+/g, " ")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);

  return cleaned || fallback;
}

function toAsciiFileName(value, fallback = "player CV.pdf") {
  const ascii = String(value || "")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/[\\/:*?"<>|;]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return ascii || fallback;
}

function buildContentDispositionHeader(playerName, disposition = "attachment") {
  const englishPlayerName = getEnglishPlayerName(playerName);
  const fileBaseName = normalizeFileBaseName(englishPlayerName, "player");
  const safeName = `${fileBaseName} CV.pdf`;
  const asciiName = toAsciiFileName(safeName);
  const encodedName = encodeURIComponent(safeName);
  const safeDisposition = disposition === "inline" ? "inline" : "attachment";

  return `${safeDisposition}; filename="${asciiName}"; filename*=UTF-8''${encodedName}`;
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
      return NextResponse.json({ error: "ملف CV غير متاح حالياً." }, { status: 404 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const upstream = await fetch(resolvedUrl, { cache: "no-store", signal: controller.signal });
    clearTimeout(timeout);

    if (!upstream.ok) {
      return NextResponse.json({ error: "تعذر فتح ملف CV حالياً." }, { status: 404 });
    }

    const fileBuffer = await upstream.arrayBuffer();
    const maxBytes = 15 * 1024 * 1024;
    if (fileBuffer.byteLength > maxBytes) {
      return NextResponse.json({ error: "ملف CV كبير جداً." }, { status: 413 });
    }

    const firstBytes = Buffer.from(fileBuffer.slice(0, 4)).toString("utf8");
    if (firstBytes !== "%PDF") {
      return NextResponse.json({ error: "تعذر معاينة ملف CV. برجاء رفع ملف PDF صحيح من لوحة التحكم." }, { status: 400 });
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
    return safeErrorResponse(error, "تعذر فتح ملف CV حالياً.", 500);
  }
}
