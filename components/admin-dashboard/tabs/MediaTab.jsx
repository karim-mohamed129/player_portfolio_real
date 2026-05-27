"use client";

import { ArrayBox, ImageUpload, ItemShell, LocalizedField, LocalizedTextArea } from "../AdminFields";
import { safeArray } from "../utils";

export default function MediaTab({ content, update, addItem, removeItem, t }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">{t("admin.sections.mediaTitle")}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <LocalizedField label={t("admin.fields.smallTitle")} value={content.media?.label} onChange={(v) => update(["media", "label"], v)} />
        <LocalizedField label={t("admin.fields.mainTitle")} value={content.media?.title} onChange={(v) => update(["media", "title"], v)} />
      </div>
      <LocalizedTextArea label={t("admin.fields.shortDescription")} value={content.media?.summary} onChange={(v) => update(["media", "summary"], v)} />
      <ArrayBox title={t("admin.sections.galleryImages")} items={content.media?.items} addLabel={t("admin.fields.image")} onAdd={() => addItem(["media", "items"], { image: "", alt: t("admin.fields.image") })}>
        {safeArray(content.media?.items).map((item, index) => (
          <ItemShell key={index} title={`${t("admin.fields.image")} ${index + 1}`} onRemove={() => removeItem(["media", "items"], index)}>
            <LocalizedField label={t("admin.fields.altText")} value={item.alt} onChange={(v) => update(["media", "items", index, "alt"], v)} />
            <ImageUpload label={t("admin.fields.image")} value={item.image} onChange={(v) => update(["media", "items", index, "image"], v, { autoSave: true })} />
          </ItemShell>
        ))}
      </ArrayBox>
    </div>
  );
}
