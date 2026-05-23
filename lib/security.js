import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RateLimit from "@/models/RateLimit";

const RATE_LIMIT_STATE = globalThis.__PLAYER_PORTFOLIO_RATE_LIMITS__ || new Map();
globalThis.__PLAYER_PORTFOLIO_RATE_LIMITS__ = RATE_LIMIT_STATE;

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function getAllowedAdminIps() {
  return String(process.env.ADMIN_ALLOWED_IPS || "")
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);
}

function ipToInt(ip) {
  const parts = String(ip).split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return null;
  return (((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3]) >>> 0;
}

function matchesCidr(ip, cidr) {
  const [range, bitsRaw] = String(cidr).split("/");
  const bits = Number(bitsRaw);
  const ipInt = ipToInt(ip);
  const rangeInt = ipToInt(range);
  if (ipInt === null || rangeInt === null || !Number.isInteger(bits) || bits < 0 || bits > 32) return false;
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return (ipInt & mask) === (rangeInt & mask);
}

export function isAdminIpAllowed(request) {
  const allowed = getAllowedAdminIps();
  if (!allowed.length) return true;

  const ip = getClientIp(request);
  if (["127.0.0.1", "::1", "unknown"].includes(ip) && process.env.NODE_ENV !== "production") return true;

  return allowed.some((entry) => {
    if (entry === "*") return true;
    if (entry.includes("/")) return matchesCidr(ip, entry);
    return entry === ip;
  });
}

export function adminIpDeniedResponse() {
  return NextResponse.json({ error: "الوصول غير متاح من هذه الشبكة." }, { status: 403 });
}


export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim().slice(0, 80);
  return (request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "unknown").slice(0, 80);
}

function hashKey(key) {
  return crypto.createHash("sha256").update(String(key)).digest("hex");
}

export function checkRateLimit(key, { limit = 10, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const hashedKey = hashKey(key);
  const record = RATE_LIMIT_STATE.get(hashedKey);

  if (!record || record.resetAt <= now) {
    RATE_LIMIT_STATE.set(hashedKey, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  RATE_LIMIT_STATE.set(hashedKey, record);
  return { success: true, remaining: Math.max(limit - record.count, 0), resetAt: record.resetAt };
}

export async function checkPersistentRateLimit(key, { limit = 10, windowMs = 60_000 } = {}) {
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);
  const hashedKey = hashKey(key);

  try {
    await connectDB();
    const existing = await RateLimit.findOne({ key: hashedKey });

    if (!existing || existing.expiresAt <= now) {
      await RateLimit.findOneAndUpdate(
        { key: hashedKey },
        { count: 1, expiresAt: resetAt },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return { success: true, remaining: limit - 1, resetAt: resetAt.getTime() };
    }

    if (existing.count >= limit) {
      return { success: false, remaining: 0, resetAt: existing.expiresAt.getTime() };
    }

    existing.count += 1;
    await existing.save();
    return { success: true, remaining: Math.max(limit - existing.count, 0), resetAt: existing.expiresAt.getTime() };
  } catch (error) {
    console.error("[RateLimit persistent fallback]", error);
    return checkRateLimit(`fallback:${key}`, { limit, windowMs });
  }
}

export function rateLimitResponse(resetAt) {
  const retryAfterSeconds = Math.max(Math.ceil((resetAt - Date.now()) / 1000), 1);
  return NextResponse.json(
    { error: "تم إرسال طلبات كثيرة. برجاء المحاولة بعد قليل." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "Cache-Control": "no-store"
      }
    }
  );
}

export function safeErrorResponse(error, fallbackMessage = "حدث خطأ غير متوقع. حاول مرة أخرى لاحقاً.", status = 500) {
  console.error("[API Error]", error);
  const message = process.env.NODE_ENV === "production" ? fallbackMessage : error?.message || fallbackMessage;
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

export function requireJsonRequest(request, maxLength = 50_000) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return { error: NextResponse.json({ error: "صيغة الطلب غير صحيحة." }, { status: 415 }) };
  }
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength && contentLength > maxLength) {
    return { error: NextResponse.json({ error: "حجم الطلب كبير جداً." }, { status: 413 }) };
  }
  return { error: null };
}

export function requireAdminAjaxHeader(request) {
  if (SAFE_METHODS.has(request.method)) return null;
  const header = request.headers.get("x-requested-with") || "";
  if (header.toLowerCase() !== "xmlhttprequest") {
    return NextResponse.json({ error: "تعذر تنفيذ الطلب بشكل آمن. حدّث الصفحة وحاول مرة أخرى." }, { status: 403 });
  }
  return null;
}

export function sanitizeText(value, maxLength = 500) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/<\s*script\b[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:/gi, "")
    .replace(/vbscript\s*:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim()
    .slice(0, maxLength);
}

export function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(String(email || ""));
}

export function isSafeInternalOrCloudinaryUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return true;
  if (raw.startsWith("#") || raw.startsWith("/")) return !raw.startsWith("//") && !raw.includes("\\");
  try {
    const url = new URL(raw);
    const allowedHosts = ["res.cloudinary.com", "images.unsplash.com"];
    return ["http:", "https:"].includes(url.protocol) && allowedHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
  } catch {
    return false;
  }
}

export function isSafeCloudinaryPdfUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return false;

  if (raw.startsWith("/assets/cv/") && raw.toLowerCase().endsWith(".pdf") && !raw.includes("..") && !raw.includes("\\")) {
    return true;
  }

  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com") return false;

    const pathname = decodeURIComponent(url.pathname || "").toLowerCase();
    const configuredFolder = String(process.env.CLOUDINARY_FOLDER || "player-portfolio")
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase();

    const isPdfFile = pathname.endsWith(".pdf");
    const isRawUpload = pathname.includes("/raw/upload/");
    const isCvFolder = configuredFolder ? pathname.includes(`/${configuredFolder}/cv/`) : pathname.includes("/cv/");

    // Cloudinary raw PDFs sometimes return a secure_url without a .pdf suffix.
    // Accept only files delivered from our managed CV folder; the download route
    // still verifies the real bytes start with %PDF before serving.
    return isPdfFile || (isRawUpload && isCvFolder);
  } catch {
    return false;
  }
}

export function sanitizeUrl(value, fallback = "") {
  const raw = sanitizeText(value, 1200);
  return isSafeInternalOrCloudinaryUrl(raw) ? raw : fallback;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
