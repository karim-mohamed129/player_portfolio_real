"use client";

import { ArrayBox, Field, ImageUpload, ItemShell } from "../AdminFields";
import { safeArray } from "../utils";

export default function SkillsTab({ content, update, addItem, removeItem }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">المهارات</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Label" value={content.skills?.label} onChange={(v) => update(["skills", "label"], v)} />
        <Field label="Title" value={content.skills?.title} onChange={(v) => update(["skills", "title"], v)} />
      </div>
      <ImageUpload label="Skills Image" value={content.skills?.image} onChange={(v) => update(["skills", "image"], v, { autoSave: true })} />
      <ArrayBox title="Skills" items={content.skills?.items} addLabel="Skill" onAdd={() => addItem(["skills", "items"], { label: "مهارة", percent: 80 })}>
        {safeArray(content.skills?.items).map((item, index) => (
          <ItemShell key={index} title={`Skill ${index + 1}`} onRemove={() => removeItem(["skills", "items"], index)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Label" value={item.label} onChange={(v) => update(["skills", "items", index, "label"], v)} />
              <Field label="Percent" type="number" value={item.percent} onChange={(v) => update(["skills", "items", index, "percent"], v)} />
            </div>
          </ItemShell>
        ))}
      </ArrayBox>
    </div>
  );
}
