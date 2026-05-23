import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/auth";
import { deleteCloudinaryPublicIds, extractCloudinaryPublicId, isManagedCloudinaryPublicId } from "@/lib/cloudinaryAssets";
import { requireJsonRequest, safeErrorResponse } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const { admin, response } = await requireApiAdmin(request);
  if (response) return response;

  const contentError = requireJsonRequest(request, 5_000).error;
  if (contentError) return contentError;

  try {
    const body = await request.json();
    const publicId = body.public_id || body.publicId || extractCloudinaryPublicId(body.url);

    if (!publicId) {
      return NextResponse.json({ error: "رابط الملف مطلوب." }, { status: 400 });
    }

    if (!isManagedCloudinaryPublicId(publicId)) {
      return NextResponse.json({ error: "لا يمكن حذف هذا الملف." }, { status: 403 });
    }

    const result = await deleteCloudinaryPublicIds([publicId]);
    return NextResponse.json({ ok: true, cleanup: result });
  } catch (error) {
    return safeErrorResponse(error, "تعذر حذف الملف حالياً.", 500);
  }
}
