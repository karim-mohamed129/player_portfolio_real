import { configureCloudinary } from "@/lib/cloudinary";

const IMAGE_FILE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|avif|svg|bmp|tif|tiff|ico)$/i;

function getConfiguredFolder() {
  return (process.env.CLOUDINARY_FOLDER || "player-portfolio").replace(/^\/+|\/+$/g, "");
}

function getConfiguredCloudName() {
  return process.env.CLOUDINARY_CLOUD_NAME || "";
}

export function extractCloudinaryPublicId(value) {
  if (!value) return null;

  if (typeof value === "object") {
    return value.public_id || value.publicId || extractCloudinaryPublicId(value.secure_url || value.url || value.image || value.src);
  }

  if (typeof value !== "string") return null;

  const raw = value.trim();
  if (!raw) return null;

  if (!/^https?:\/\//i.test(raw)) {
    return raw.replace(IMAGE_FILE_EXTENSIONS, "");
  }

  try {
    const url = new URL(raw);
    const expectedCloudName = getConfiguredCloudName();

    if (!url.hostname.includes("res.cloudinary.com")) return null;

    const parts = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);
    const cloudName = parts[0];
    if (expectedCloudName && cloudName !== expectedCloudName) return null;

    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;

    const afterUpload = parts.slice(uploadIndex + 1);
    if (!afterUpload.length) return null;

    const versionIndex = afterUpload.findIndex((part) => /^v\d+$/.test(part));
    const publicPathParts = versionIndex >= 0 ? afterUpload.slice(versionIndex + 1) : afterUpload;
    if (!publicPathParts.length) return null;

    const publicPath = publicPathParts.join("/");
    return publicPath.replace(IMAGE_FILE_EXTENSIONS, "");
  } catch {
    return null;
  }
}

export function isManagedCloudinaryPublicId(publicId) {
  if (!publicId) return false;
  const folder = getConfiguredFolder();
  if (!folder) return true;
  return publicId === folder || publicId.startsWith(`${folder}/`);
}

export function collectCloudinaryPublicIds(input, ids = new Set()) {
  if (!input) return ids;

  if (typeof input === "string") {
    const publicId = extractCloudinaryPublicId(input);
    if (publicId && isManagedCloudinaryPublicId(publicId)) ids.add(publicId);
    return ids;
  }

  if (Array.isArray(input)) {
    input.forEach((item) => collectCloudinaryPublicIds(item, ids));
    return ids;
  }

  if (typeof input === "object") {
    const directPublicId = extractCloudinaryPublicId(input.public_id || input.publicId);
    if (directPublicId && isManagedCloudinaryPublicId(directPublicId)) ids.add(directPublicId);
    Object.values(input).forEach((value) => collectCloudinaryPublicIds(value, ids));
  }

  return ids;
}

export async function deleteCloudinaryPublicIds(publicIds = []) {
  const uniquePublicIds = [...new Set(publicIds)].filter(Boolean).filter(isManagedCloudinaryPublicId);

  if (!uniquePublicIds.length) {
    return { deleted: [], notFound: [], failed: [], skipped: [] };
  }

  const cloudinary = configureCloudinary();
  const deleted = [];
  const notFound = [];
  const failed = [];
  const skipped = [];

  for (const publicId of uniquePublicIds) {
    let removed = false;
    let foundMissing = false;
    const resourceTypes = publicId.toLowerCase().includes("/cv/") ? ["raw", "image"] : ["image", "raw"];

    for (const resourceType of resourceTypes) {
      try {
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
        if (result?.result === "ok") {
          deleted.push(`${resourceType}:${publicId}`);
          removed = true;
          break;
        }
        if (result?.result === "not found") foundMissing = true;
      } catch (error) {
        failed.push({ public_id: publicId, resource_type: resourceType, error: error.message });
      }
    }

    if (!removed && foundMissing) notFound.push(publicId);
  }

  return { deleted, notFound, failed, skipped };
}

export async function cleanupRemovedCloudinaryImages(oldData, newData) {
  const oldPublicIds = collectCloudinaryPublicIds(oldData);
  const newPublicIds = collectCloudinaryPublicIds(newData);
  const removedPublicIds = [...oldPublicIds].filter((publicId) => !newPublicIds.has(publicId));
  const result = await deleteCloudinaryPublicIds(removedPublicIds);
  return { removedPublicIds, ...result };
}

async function listFolderPublicIdsByResourceType(resourceType) {
  const cloudinary = configureCloudinary();
  const folder = getConfiguredFolder();
  const publicIds = [];
  let nextCursor;

  do {
    const options = {
      type: "upload",
      resource_type: resourceType,
      max_results: 500
    };
    if (folder) options.prefix = `${folder}/`;
    if (nextCursor) options.next_cursor = nextCursor;

    const result = await cloudinary.api.resources(options);

    for (const resource of result.resources || []) {
      if (resource.public_id && isManagedCloudinaryPublicId(resource.public_id)) {
        publicIds.push(resource.public_id);
      }
    }

    nextCursor = result.next_cursor;
  } while (nextCursor);

  return publicIds;
}

async function listFolderManagedPublicIds() {
  const [imageIds, rawIds] = await Promise.allSettled([
    listFolderPublicIdsByResourceType("image"),
    listFolderPublicIdsByResourceType("raw")
  ]);

  return [
    ...(imageIds.status === "fulfilled" ? imageIds.value : []),
    ...(rawIds.status === "fulfilled" ? rawIds.value : [])
  ];
}

export async function cleanupUnregisteredCloudinaryFolderImages(currentData) {
  const registeredPublicIds = collectCloudinaryPublicIds(currentData);
  const folderPublicIds = await listFolderManagedPublicIds();
  const unregisteredPublicIds = folderPublicIds.filter((publicId) => !registeredPublicIds.has(publicId));
  const result = await deleteCloudinaryPublicIds(unregisteredPublicIds);
  return { registeredCount: registeredPublicIds.size, folderCount: folderPublicIds.length, unregisteredPublicIds, ...result };
}
