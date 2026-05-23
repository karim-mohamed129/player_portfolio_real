import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Name, email, subject and message are required." }, { status: 400 });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    await connectDB();
    const savedMessage = await Message.create({ name, email, phone, subject, message, source: "website" });

    return NextResponse.json({
      ok: true,
      saved: true,
      messageId: savedMessage._id
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
