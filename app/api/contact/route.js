import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import { checkPersistentRateLimit, getClientIp, isValidEmail, rateLimitResponse, requireJsonRequest, safeErrorResponse, sanitizeText } from "@/lib/security";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMITS = {
  name: 80,
  email: 120,
  phone: 30,
  subject: 150,
  message: 2000
};

export async function POST(request) {
  const contentError = requireJsonRequest(request, 20_000).error;
  if (contentError) return contentError;

  const ip = getClientIp(request);
  const contactLimit = await checkPersistentRateLimit(`contact:${ip}`, { limit: 4, windowMs: 10 * 60 * 1000 });
  if (!contactLimit.success) return rateLimitResponse(contactLimit.resetAt);

  try {
    const rawText = await request.text();
    if (rawText.length > 20_000) return NextResponse.json({ error: "Request body is too large." }, { status: 413 });

    const body = JSON.parse(rawText);
    if (String(body.companyWebsite || body.website || "").trim()) {
      return NextResponse.json({ ok: true, saved: true });
    }

    const challenge = await verifyTurnstileToken(String(body.turnstileToken || ""), ip);
    if (!challenge.ok) {
      return NextResponse.json({ error: challenge.error || "Security challenge failed." }, { status: 400 });
    }

    const original = {
      name: String(body.name || ""),
      email: String(body.email || ""),
      phone: String(body.phone || ""),
      subject: String(body.subject || ""),
      message: String(body.message || "")
    };

    if (
      original.name.length > LIMITS.name ||
      original.email.length > LIMITS.email ||
      original.phone.length > LIMITS.phone ||
      original.subject.length > LIMITS.subject ||
      original.message.length > LIMITS.message
    ) {
      return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
    }

    const name = sanitizeText(original.name, LIMITS.name);
    const email = sanitizeText(original.email, LIMITS.email).toLowerCase();
    const phone = sanitizeText(original.phone, LIMITS.phone);
    const subject = sanitizeText(original.subject, LIMITS.subject);
    const message = sanitizeText(original.message, LIMITS.message);

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Name, email, subject and message are required." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    await connectDB();
    const savedMessage = await Message.create({ name, email, phone, subject, message, source: "website", ip });

    return NextResponse.json({ ok: true, saved: true, messageId: savedMessage._id });
  } catch (error) {
    return safeErrorResponse(error, "Message could not be sent.", 500);
  }
}
