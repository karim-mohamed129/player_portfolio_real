import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { adminIpDeniedResponse, isAdminIpAllowed, isValidEmail, requireAdminAjaxHeader } from "@/lib/security";

const COOKIE_NAME = "admin_token";
const WEEK = 60 * 60 * 24 * 7;
const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function secretKey() {
  const secret = process.env.JWT_SECRET || process.env.AUTH_SECRET;
  if (!secret || secret.length < 48) {
    throw new Error("JWT_SECRET or AUTH_SECRET must be set and at least 48 characters long.");
  }
  return new TextEncoder().encode(secret);
}

function getAllowedOrigin(request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || process.env.VERCEL_URL;
  if (configured) {
    const normalized = configured.startsWith("http") ? configured : `https://${configured}`;
    try {
      return new URL(normalized).origin;
    } catch {
      return null;
    }
  }
  try {
    return new URL(request.url).origin;
  } catch {
    return null;
  }
}

function isSameOriginRequest(request) {
  if (!UNSAFE_METHODS.has(request.method)) return true;
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const allowedOrigin = getAllowedOrigin(request);

  if (!allowedOrigin) return false;
  if (origin && origin !== allowedOrigin) return false;
  if (!origin && referer) {
    try {
      if (new URL(referer).origin !== allowedOrigin) return false;
    } catch {
      return false;
    }
  }
  return true;
}

async function getActiveAdminFromPayload(payload) {
  if (!payload?.sub || !mongoose.Types.ObjectId.isValid(String(payload.sub))) return null;
  await connectDB();
  const admin = await Admin.findOne({ _id: payload.sub, active: true }).lean();
  if (!admin) return null;
  return { id: String(admin._id), email: admin.email, name: admin.name, role: admin.role };
}

export async function ensureFirstAdmin() {
  await connectDB();
  const count = await Admin.countDocuments();
  if (count > 0) return;

  const email = String(process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = String(process.env.ADMIN_PASSWORD || "");

  if (!email || !password) {
    throw new Error("No admin exists. Add ADMIN_EMAIL and ADMIN_PASSWORD to environment variables first.");
  }
  if (!isValidEmail(email)) {
    throw new Error("ADMIN_EMAIL is not a valid email address.");
  }
  if (password.length < 12 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters and include uppercase, lowercase, and numbers.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ name: process.env.ADMIN_NAME || "Main Admin", email, passwordHash, role: "super_admin" });
}

export async function createAdminToken(admin) {
  return new SignJWT({ email: admin.email, name: admin.name, role: admin.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(admin._id))
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export function setAuthCookie(response, token) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: WEEK,
    path: "/"
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export function clearAuthCookie(response) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/"
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function verifyToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    return getActiveAdminFromPayload(payload);
  } catch {
    return null;
  }
}

export async function getCurrentAdminFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifyToken(token);
}

export async function requireApiAdmin(request) {
  if (!isAdminIpAllowed(request)) {
    return { admin: null, response: adminIpDeniedResponse() };
  }

  if (!isSameOriginRequest(request)) {
    return { admin: null, response: NextResponse.json({ error: "تعذر تنفيذ الطلب من هذا المصدر." }, { status: 403 }) };
  }

  const ajaxError = requireAdminAjaxHeader(request);
  if (ajaxError) return { admin: null, response: ajaxError };

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const admin = await verifyToken(token);
  if (!admin) {
    return { admin: null, response: NextResponse.json({ error: "انتهت الجلسة. برجاء تسجيل الدخول مرة أخرى." }, { status: 401 }) };
  }
  return { admin, response: null };
}
