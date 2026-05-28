import { NextResponse } from "next/server";
import { configureCloudinary } from "@/lib/cloudinary";
import { requireApiAdmin } from "@/lib/auth";
import { deleteCloudinaryPublicIds, extractCloudinaryPublicId, isManagedCloudinaryPublicId } from "@/lib/cloudinaryAssets";
import { safeErrorResponse } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SAFE_IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|avif|bmp|ico)$/i;
const PDF_EXTENSIONS = /\.pdf$/i;
const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_PDF_UPLOAD_BYTES = 12 * 1024 * 1024;
const MAX_MULTIPART_OVERHEAD_BYTES = 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/bmp",
  "image/x-icon",
  "image/vnd.microsoft.icon"
]);

function getFileExtension(name = "") {
  const match = String(name).match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : "";
}

function getManagedUploadFolder(isPdf) {
  const baseFolder = (process.env.CLOUDINARY_FOLDER || "player-portfolio")
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9_\-/]/g, "");
  return isPdf ? `${baseFolder}/cv` : baseFolder;
}

function hasPdfMagic(buffer) {
  return buffer.length >= 4 && buffer.subarray(0, 4).toString("utf8") === "%PDF";
}

function hasSafeImageMagic(buffer, mimeType, fileName) {
  const hex = buffer.subarray(0, 16).toString("hex");
  const ascii = buffer.subarray(0, 16).toString("latin1");
  if (mimeType === "image/jpeg" || /\.jpe?g$/i.test(fileName)) return hex.startsWith("ffd8ff");
  if (mimeType === "image/png" || /\.png$/i.test(fileName)) return hex.startsWith("89504e470d0a1a0a");
  if (mimeType === "image/gif" || /\.gif$/i.test(fileName)) return ascii.startsWith("GIF87a") || ascii.startsWith("GIF89a");
  if (mimeType === "image/webp" || /\.webp$/i.test(fileName)) return ascii.startsWith("RIFF") && buffer.subarray(8, 12).toString("latin1") === "WEBP";
  if (mimeType === "image/avif" || /\.avif$/i.test(fileName)) return buffer.subarray(4, 12).toString("latin1").includes("ftyp");
  if (mimeType === "image/bmp" || /\.bmp$/i.test(fileName)) return ascii.startsWith("BM");
  if (mimeType === "image/x-icon" || mimeType === "image/vnd.microsoft.icon" || /\.ico$/i.test(fileName)) return hex.startsWith("00000100");
  return false;
}

export async function POST(request) {
  const { admin, response } = await requireApiAdmin(request);
  if (response) return response;

  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    const maxRequestSize = MAX_PDF_UPLOAD_BYTES + MAX_MULTIPART_OVERHEAD_BYTES;
    if (contentLength && contentLength > maxRequestSize) {
      return NextResponse.json({ error: "حجم الطلب كبير جداً. الحد الأقصى للصور 10 ميجابايت." }, { status: 413 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const fileName = file.name || "upload";
    const mimeType = file.type || "";
    const extension = getFileExtension(fileName);

    if (extension === "svg" || mimeType === "image/svg+xml") {
      return NextResponse.json({ error: "SVG uploads are disabled for security. Use PNG, JPG, WEBP, ICO, or PDF." }, { status: 400 });
    }

    const isPdf = mimeType === "application/pdf" || PDF_EXTENSIONS.test(fileName);
    const isImage = ALLOWED_IMAGE_TYPES.has(mimeType) || SAFE_IMAGE_EXTENSIONS.test(fileName);

    if (!isImage && !isPdf) {
      return NextResponse.json({ error: "Only safe image formats or PDF uploads are allowed." }, { status: 400 });
    }

    const maxSize = isPdf ? MAX_PDF_UPLOAD_BYTES : MAX_IMAGE_UPLOAD_BYTES;
    if (file.size > maxSize) {
      return NextResponse.json({ error: isPdf ? "حجم ملف PDF كبير جداً. الحد الأقصى 12 ميجابايت." : "حجم الصورة كبير جداً. الحد الأقصى 10 ميجابايت." }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (isPdf && !hasPdfMagic(buffer)) {
      return NextResponse.json({ error: "ملف PDF غير صحيح. برجاء رفع ملف صالح." }, { status: 400 });
    }

    if (isImage && !hasSafeImageMagic(buffer, mimeType, fileName)) {
      return NextResponse.json({ error: "الصورة غير صالحة أو بصيغة غير مدعومة." }, { status: 400 });
    }

    const oldUrl = String(formData.get("oldUrl") || "").trim();
    if (oldUrl && isPdf) {
      const oldPublicId = extractCloudinaryPublicId(oldUrl);
      if (oldPublicId && isManagedCloudinaryPublicId(oldPublicId)) {
        const deleteResult = await deleteCloudinaryPublicIds([oldPublicId]);
        if (deleteResult.failed?.length) {
          return NextResponse.json({ error: "تعذر حذف ملف CV القديم قبل رفع الملف الجديد." }, { status: 500 });
        }
      }
    }

    const base64 = buffer.toString("base64");
    const safeMimeType = mimeType || (extension === "ico" ? "image/x-icon" : isPdf ? "application/pdf" : "application/octet-stream");
    const dataUri = `data:${safeMimeType};base64,${base64}`;

    const cloudinary = configureCloudinary();
    const resourceType = isPdf ? "raw" : "image";
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: getManagedUploadFolder(isPdf),
      resource_type: resourceType,
      overwrite: false,
      use_filename: true,
      unique_filename: true
    });


    return NextResponse.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    });
  } catch (error) {
    return safeErrorResponse(error, "تعذر رفع الملف حالياً. حاول مرة أخرى..", 500);
  }
}
