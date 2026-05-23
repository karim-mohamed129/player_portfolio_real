import { NextResponse } from "next/server";
import { configureCloudinary } from "@/lib/cloudinary";
import { requireApiAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const { response } = await requireApiAdmin(request);
  if (response) return response;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || process.env.CLOUDINARY_FOLDER || "player-portfolio";

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    if (!file.type?.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are allowed from this dashboard." }, { status: 400 });
    }

    const maxSize = 8 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Image is too large. Max size is 8MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const cloudinary = configureCloudinary();
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: String(folder),
      resource_type: "image",
      overwrite: false
    });

    return NextResponse.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
