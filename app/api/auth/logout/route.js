import { NextResponse } from "next/server";
import { clearAuthCookie, requireApiAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const { admin, response: authResponse } = await requireApiAdmin(request);
  if (authResponse) return authResponse;

  const response = NextResponse.json({ ok: true });
  return clearAuthCookie(response);
}
