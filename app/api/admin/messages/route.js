import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import { requireApiAdmin } from "@/lib/auth";
import { safeErrorResponse } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const { response } = await requireApiAdmin(request);
  if (response) return response;

  try {
    await connectDB();
    const messages = await Message.find({}).sort({ createdAt: -1 }).limit(200).lean();
    return NextResponse.json({ messages: JSON.parse(JSON.stringify(messages)) });
  } catch (error) {
    return safeErrorResponse(error, "Messages could not be loaded.", 500);
  }
}
