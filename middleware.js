import { NextResponse } from "next/server";

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "unknown";
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

function isAllowedAdminIp(request) {
  const allowed = String(process.env.ADMIN_ALLOWED_IPS || "")
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);
  if (!allowed.length) return true;

  const ip = getClientIp(request);
  if (["127.0.0.1", "::1", "unknown"].includes(ip) && process.env.NODE_ENV !== "production") return true;

  return allowed.some((entry) => {
    if (entry === "*") return true;
    if (entry.includes("/")) return matchesCidr(ip, entry);
    return entry === ip;
  });
}

function createNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

function buildCsp(nonce) {
  const isProd = process.env.NODE_ENV === "production";
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://challenges.cloudflare.com",
    "font-src 'self' data:",
    "style-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://challenges.cloudflare.com${isProd ? "" : " 'unsafe-eval'"}`,
    "frame-src https://challenges.cloudflare.com",
    "connect-src 'self' https://res.cloudinary.com https://api.cloudinary.com https://challenges.cloudflare.com",
    "media-src 'self' https://res.cloudinary.com",
    "worker-src 'self' blob:",
    "upgrade-insecure-requests"
  ].join("; ");
}

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  if ((pathname.startsWith("/admin") || pathname.startsWith("/api/admin") || pathname.startsWith("/api/auth/login")) && !isAllowedAdminIp(request)) {
    return new NextResponse("Admin access is restricted from this network.", { status: 403 });
  }

  const nonce = createNonce();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", buildCsp(nonce));
  response.headers.set("X-Nonce", nonce);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|ico|svg|css|woff2?)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" }
      ]
    }
  ]
};
