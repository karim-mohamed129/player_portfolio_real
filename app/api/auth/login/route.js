import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";
import { connectDB } from "@/lib/db";
import { createAdminToken, ensureFirstAdmin, setAuthCookie } from "@/lib/auth";
import { adminIpDeniedResponse, checkPersistentRateLimit, getClientIp, isAdminIpAllowed, isValidEmail, rateLimitResponse, requireJsonRequest, safeErrorResponse, sleep } from "@/lib/security";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { writeAuditLog } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!isAdminIpAllowed(request)) return adminIpDeniedResponse();

  const contentError = requireJsonRequest(request, 12_000).error;
  if (contentError) return contentError;

  const ip = getClientIp(request);
  let email = "unknown";

  try {
    const rawText = await request.text();
    if (rawText.length > 12_000) return NextResponse.json({ error: "Request body is too large." }, { status: 413 });

    const body = JSON.parse(rawText);
    email = String(body.email || "").toLowerCase().trim().slice(0, 120);
    const password = String(body.password || "");
    const turnstileToken = String(body.turnstileToken || "");

    const ipLimit = await checkPersistentRateLimit(`login:ip:${ip}`, { limit: 12, windowMs: 15 * 60 * 1000 });
    const accountLimit = await checkPersistentRateLimit(`login:account:${email || "unknown"}:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
    if (!ipLimit.success || !accountLimit.success) {
      await writeAuditLog({ request, action: "login.rate_limited", target: email, status: "failed", details: { ip } });
      return rateLimitResponse(Math.max(ipLimit.resetAt, accountLimit.resetAt));
    }

    const challenge = await verifyTurnstileToken(turnstileToken, ip);
    if (!challenge.ok) {
      await sleep(450);
      await writeAuditLog({ request, action: "login.turnstile_failed", target: email, status: "failed" });
      return NextResponse.json({ error: challenge.error || "Security challenge failed." }, { status: 400 });
    }

    if (!email || !password || password.length > 256 || !isValidEmail(email)) {
      await sleep(450);
      await writeAuditLog({ request, action: "login.invalid_input", target: email, status: "failed" });
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    await ensureFirstAdmin();
    await connectDB();

    const admin = await Admin.findOne({ email, active: true });
    if (!admin) {
      await sleep(450);
      await writeAuditLog({ request, action: "login.unknown_admin", target: email, status: "failed" });
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      await sleep(450);
      await writeAuditLog({ request, admin: { id: String(admin._id), email: admin.email }, action: "login.bad_password", target: admin.email, status: "failed" });
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }


    admin.lastLoginAt = new Date();
    await admin.save();

    const token = await createAdminToken(admin);
    await writeAuditLog({ request, admin: { id: String(admin._id), email: admin.email, name: admin.name, role: admin.role }, action: "login.success", target: admin.email, status: "success" });
    const response = NextResponse.json({ ok: true, admin: { email: admin.email, name: admin.name, role: admin.role } });
    return setAuthCookie(response, token);
  } catch (error) {
    await writeAuditLog({ request, action: "login.error", target: email, status: "failed" });
    return safeErrorResponse(error, "Login failed.", 500);
  }
}
