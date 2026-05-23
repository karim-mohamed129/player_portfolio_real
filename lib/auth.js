import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

const COOKIE_NAME = "admin_token";
const WEEK = 60 * 60 * 24 * 7;

function secretKey() {
  const secret = process.env.JWT_SECRET || process.env.AUTH_SECRET || "development_only_change_this_auth_secret";
  return new TextEncoder().encode(secret);
}

export async function ensureFirstAdmin() {
  await connectDB();
  const count = await Admin.countDocuments();
  if (count > 0) return;

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("No admin exists. Add ADMIN_EMAIL and ADMIN_PASSWORD to environment variables first.");
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
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: WEEK,
    path: "/"
  });
  return response;
}

export function clearAuthCookie(response) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/"
  });
  return response;
}

export async function verifyToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload;
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
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const admin = await verifyToken(token);
  if (!admin) {
    return { admin: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { admin, response: null };
}
