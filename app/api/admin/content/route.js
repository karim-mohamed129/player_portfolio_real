import { NextResponse } from "next/server";
import { getContentDocument, updateContent } from "@/lib/content";
import { requireApiAdmin } from "@/lib/auth";
import { cleanupRemovedCloudinaryImages } from "@/lib/cloudinaryAssets";
import { requireJsonRequest, safeErrorResponse } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const { response } = await requireApiAdmin(request);
  if (response) return response;

  try {
    const doc = await getContentDocument({ createIfMissing: true });
    return NextResponse.json({ data: doc.data, updatedAt: doc.updatedAt, updatedBy: doc.updatedBy });
  } catch (error) {
    return safeErrorResponse(error, "تعذر تحميل محتوى الموقع حالياً.", 500);
  }
}

export async function PUT(request) {
  const { admin, response } = await requireApiAdmin(request);
  if (response) return response;

  const contentError = requireJsonRequest(request, 350_000).error;
  if (contentError) return contentError;

  try {
    const rawText = await request.text();
    if (rawText.length > 350_000) {
      return NextResponse.json({ error: "Content payload is too large." }, { status: 413 });
    }

    const data = JSON.parse(rawText);
    const oldDoc = await getContentDocument({ createIfMissing: true });
    const doc = await updateContent(data, admin.email);

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
    return safeErrorResponse(error, "تعذر حفظ محتوى الموقع حالياً.", 500);
  }
}
