import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/auth";
import { getContentDocument } from "@/lib/content";
import { cleanupUnregisteredCloudinaryFolderImages } from "@/lib/cloudinaryAssets";
import { safeErrorResponse } from "@/lib/security";
import { writeAuditLog } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const { admin, response } = await requireApiAdmin(request);
  if (response) return response;

  try {
    const doc = await getContentDocument({ createIfMissing: true });
    const cleanup = await cleanupUnregisteredCloudinaryFolderImages(doc.data);
    await writeAuditLog({ request, admin, action: "cloudinary.cleanup", target: "managed-folder", status: cleanup.failed?.length ? "failed" : "success", details: cleanup });
    return NextResponse.json({ ok: true, cleanup });
  } catch (error) {
    return safeErrorResponse(error, "Cloudinary cleanup failed.", 500);
  }
}
