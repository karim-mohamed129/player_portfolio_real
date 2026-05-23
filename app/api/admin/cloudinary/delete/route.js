import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/auth";
import { deleteCloudinaryPublicIds, extractCloudinaryPublicId, isManagedCloudinaryPublicId } from "@/lib/cloudinaryAssets";
import { requireJsonRequest, safeErrorResponse } from "@/lib/security";
import { writeAuditLog } from "@/lib/audit";

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
      return NextResponse.json({ error: "Cloudinary public_id or URL is required." }, { status: 400 });
    }

    if (!isManagedCloudinaryPublicId(publicId)) {
      return NextResponse.json({ error: "This file is outside the managed Cloudinary folder." }, { status: 403 });
    }

    const result = await deleteCloudinaryPublicIds([publicId]);
    await writeAuditLog({ request, admin, action: "cloudinary.delete", target: publicId, status: result.failed?.length ? "failed" : "success", details: result });
    return NextResponse.json({ ok: true, cleanup: result });
  } catch (error) {
    return safeErrorResponse(error, "Cloudinary delete failed.", 500);
  }
}
