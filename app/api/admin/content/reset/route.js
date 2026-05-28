import { NextResponse } from "next/server";
import { defaultContent } from "@/lib/defaultContent";
import { getContentDocument, updateContent } from "@/lib/content";
import { requireApiAdmin } from "@/lib/auth";
import { cleanupRemovedCloudinaryImages } from "@/lib/cloudinaryAssets";
import { safeErrorResponse } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const { admin, response } = await requireApiAdmin(request);
  if (response) return response;

  try {
    const oldDoc = await getContentDocument({ createIfMissing: true });
    const doc = await updateContent(defaultContent, `${admin.email} - restore defaults`);

    let removedImagesCleanup = null;
    let folderCleanup = null;

    try {
      removedImagesCleanup = await cleanupRemovedCloudinaryImages(oldDoc?.data, doc.data);
    } catch (cleanupError) {
      console.error("File cleanup warning:", cleanupError);
      removedImagesCleanup = { error: "تعذر تحديث بعض الملفات.", deleted: [], failed: [] };
    }

    return NextResponse.json({ ok: true, data: doc.data, updatedAt: doc.updatedAt, cleanup: { removedImagesCleanup, folderCleanup } });
  } catch (error) {
    return safeErrorResponse(error, "تعذرت استعادة الإعدادات حالياً..", 500);
  }
}
