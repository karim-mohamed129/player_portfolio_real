import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import AuditLog from "@/models/AuditLog";
import { safeErrorResponse } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const { response } = await requireApiAdmin(request);
  if (response) return response;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || 150), 1), 300);
    const logs = await AuditLog.find({}).sort({ createdAt: -1 }).limit(limit).lean();
    return NextResponse.json({ logs: JSON.parse(JSON.stringify(logs)) });
  } catch (error) {
    return safeErrorResponse(error, "Audit logs could not be loaded.", 500);
  }
}
