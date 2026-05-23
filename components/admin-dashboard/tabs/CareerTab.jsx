"use client";

import { ArrayBox, Field, ImageUpload, ItemShell, TextArea } from "../AdminFields";
import { safeArray } from "../utils";

export default function CareerTab({ content, update, addItem, removeItem }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">المسيرة</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Label" value={content.career?.label} onChange={(v) => update(["career", "label"], v)} />
        <Field label="Title" value={content.career?.title} onChange={(v) => update(["career", "title"], v)} />
      </div>
      <ArrayBox title="Timeline" items={content.career?.items} addLabel="مرحلة" onAdd={() => addItem(["career", "items"], { year: "2026", title: "مرحلة جديدة", description: "وصف المرحلة", image: "" })}>
        {safeArray(content.career?.items).map((item, index) => (
          <ItemShell key={index} title={`${item.year || "Stage"} - ${item.title || ""}`} onRemove={() => removeItem(["career", "items"], index)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Year" value={item.year} onChange={(v) => update(["career", "items", index, "year"], v)} />
              <Field label="Title" value={item.title} onChange={(v) => update(["career", "items", index, "title"], v)} />
            </div>
            <TextArea label="Description" value={item.description} onChange={(v) => update(["career", "items", index, "description"], v)} />
            <ImageUpload label="Image" value={item.image} onChange={(v) => update(["career", "items", index, "image"], v, { autoSave: true })} />
          </ItemShell>
        ))}
      </ArrayBox>
    </div>
  );
}
