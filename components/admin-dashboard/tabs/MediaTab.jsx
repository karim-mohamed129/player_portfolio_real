"use client";

import { ArrayBox, Field, ImageUpload, ItemShell, TextArea } from "../AdminFields";
import { safeArray } from "../utils";

export default function MediaTab({ content, update, addItem, removeItem }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">معرض الصور</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Label" value={content.media?.label} onChange={(v) => update(["media", "label"], v)} />
        <Field label="Title" value={content.media?.title} onChange={(v) => update(["media", "title"], v)} />
      </div>
      <TextArea label="Summary" value={content.media?.summary} onChange={(v) => update(["media", "summary"], v)} />
      <ArrayBox title="Gallery Images" items={content.media?.items} addLabel="صورة" onAdd={() => addItem(["media", "items"], { image: "", alt: "صورة" })}>
        {safeArray(content.media?.items).map((item, index) => (
          <ItemShell key={index} title={`Image ${index + 1}`} onRemove={() => removeItem(["media", "items"], index)}>
            <Field label="Alt Text" value={item.alt} onChange={(v) => update(["media", "items", index, "alt"], v)} />
            <ImageUpload label="Image" value={item.image} onChange={(v) => update(["media", "items", index, "image"], v, { autoSave: true })} />
          </ItemShell>
        ))}
      </ArrayBox>
    </div>
  );
}
