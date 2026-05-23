import { connectDB } from "@/lib/db";
import Content from "@/models/Content";
import { defaultContent } from "@/lib/defaultContent";

function toPlain(doc) {
  return JSON.parse(JSON.stringify(doc));
}

export async function getContentDocument({ createIfMissing = true } = {}) {
  await connectDB();
  let content = await Content.findOne({ key: "main" }).lean();

  if (!content && createIfMissing) {
    content = await Content.create({ key: "main", data: defaultContent, updatedBy: "seed" });
    content = content.toObject();
  }

  return toPlain(content);
}

export async function getPublicContent() {
  try {
    const doc = await getContentDocument({ createIfMissing: true });
    return doc?.data || defaultContent;
  } catch (error) {
    console.warn("Using default content because database is not ready:", error.message);
    return defaultContent;
  }
}

export async function updateContent(data, updatedBy = "admin") {
  await connectDB();
  const content = await Content.findOneAndUpdate(
    { key: "main" },
    { data, updatedBy },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();
  return toPlain(content);
}
