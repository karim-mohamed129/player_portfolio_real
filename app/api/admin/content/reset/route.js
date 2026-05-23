import { NextResponse } from "next/server";
import { defaultContent } from "@/lib/defaultContent";
import { getContentDocument, updateContent } from "@/lib/content";
import { requireApiAdmin } from "@/lib/auth";
import { cleanupRemovedCloudinaryImages, cleanupUnregisteredCloudinaryFolderImages } from "@/lib/cloudinaryAssets";
import { safeErrorResponse } from "@/lib/security";
import { writeAuditLog } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const { admin, response } = await requireApiAdmin(request);
  if (response) return response;

  try {
    const oldDoc = await getContentDocument({ createIfMissing: true });
    const doc = await updateContent(defaultContent, `${admin.email} - restore defaults`);
    await writeAuditLog({ request, admin, action: "content.restore_defaults", target: "main", status: "success" });

    let removedImagesCleanup = null;
    let folderCleanup = null;

    try {
      removedImagesCleanup = await cleanupRemovedCloudinaryImages(oldDoc?.data, doc.data);
    } catch (cleanupError) {
      console.error("Cloudinary reset removed-assets cleanup failed:", cleanupError);
      removedImagesCleanup = { error: "Cleanup failed.", deleted: [], failed: [] };
    }

    try {
      folderCleanup = await cleanupUnregisteredCloudinaryFolderImages(doc.data);
    } catch (cleanupError) {
      console.error("Cloudinary reset folder cleanup failed:", cleanupError);
      folderCleanup = { error: "Cleanup failed.", deleted: [], failed: [] };
    }

    return NextResponse.json({ ok: true, data: doc.data, updatedAt: doc.updatedAt, cleanup: { removedImagesCleanup, folderCleanup } });
  } catch (error) {
    return safeErrorResponse(error, "Restore defaults failed.", 500);
  }
}
