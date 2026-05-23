import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/auth";
import { getContentDocument } from "@/lib/content";
import { cleanupUnregisteredCloudinaryFolderImages } from "@/lib/cloudinaryAssets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const { response } = await requireApiAdmin(request);
  if (response) return response;

  try {
    const doc = await getContentDocument({ createIfMissing: true });
    const cleanup = await cleanupUnregisteredCloudinaryFolderImages(doc.data);
    return NextResponse.json({ ok: true, cleanup });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
