import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/auth";
import { getContentDocument } from "@/lib/content";
import { cleanupUnregisteredCloudinaryFolderImages } from "@/lib/cloudinaryAssets";
import { safeErrorResponse } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const { admin, response } = await requireApiAdmin(request);
  if (response) return response;

  try {
    const doc = await getContentDocument({ createIfMissing: true });
    const cleanup = await cleanupUnregisteredCloudinaryFolderImages(doc.data);
    return NextResponse.json({ ok: true, cleanup });
  } catch (error) {
    return safeErrorResponse(error, "تعذر تنظيف الملفات غير المستخدمة حالياً.", 500);
  }
}
