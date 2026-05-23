import { NextResponse } from "next/server";
import { clearAuthCookie, requireApiAdmin } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const { admin, response: authResponse } = await requireApiAdmin(request);
  if (authResponse) return authResponse;

  await writeAuditLog({ request, admin, action: "logout", target: admin.email, status: "success" });
  const response = NextResponse.json({ ok: true });
  return clearAuthCookie(response);
}
