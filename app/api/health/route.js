import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { safeErrorResponse } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const { response } = await requireApiAdmin(request);
  if (response) return response;

  try {
    await connectDB();
    return NextResponse.json({ ok: true, status: "operational", database: "connected" });
  } catch (error) {
    return safeErrorResponse(error, "تعذر التحقق من حالة الموقع حالياً.", 500);
  }
}
