import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/auth";
import { deleteCloudinaryPublicIds, extractCloudinaryPublicId } from "@/lib/cloudinaryAssets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const { response } = await requireApiAdmin(request);
  if (response) return response;

  try {
    const body = await request.json();
    const publicId = body.public_id || body.publicId || extractCloudinaryPublicId(body.url);

    if (!publicId) {
      return NextResponse.json({ error: "Cloudinary public_id or URL is required." }, { status: 400 });
    }

    const result = await deleteCloudinaryPublicIds([publicId]);
    return NextResponse.json({ ok: true, cleanup: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
