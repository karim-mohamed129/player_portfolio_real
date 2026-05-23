"use client";

import { ArrayBox, Field, ImageUpload, ItemShell, TextArea } from "../AdminFields";
import { safeArray } from "../utils";

export default function OverviewTab({ content, update, addItem, removeItem }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">بيانات اللاعب</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Label" value={content.overview?.label} onChange={(v) => update(["overview", "label"], v)} />
        <Field label="Title" value={content.overview?.title} onChange={(v) => update(["overview", "title"], v)} />
      </div>
      <TextArea label="Summary" value={content.overview?.summary} onChange={(v) => update(["overview", "summary"], v)} />
      <ImageUpload label="Profile Image" value={content.overview?.image} onChange={(v) => update(["overview", "image"], v, { autoSave: true })} />
      <ArrayBox title="Profile Rows" items={content.overview?.rows} addLabel="Row" onAdd={() => addItem(["overview", "rows"], { label: "بيان", value: "قيمة" })}>
        {safeArray(content.overview?.rows).map((row, index) => (
          <ItemShell key={index} title={`Row ${index + 1}`} onRemove={() => removeItem(["overview", "rows"], index)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Label" value={row.label} onChange={(v) => update(["overview", "rows", index, "label"], v)} />
              <Field label="Value" value={row.value} onChange={(v) => update(["overview", "rows", index, "value"], v)} />
            </div>
          </ItemShell>
        ))}
      </ArrayBox>
    </div>
  );
}
