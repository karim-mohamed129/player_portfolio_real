"use client";

import { ArrayBox, Field, ImageUpload, ItemShell, TextArea } from "../AdminFields";
import { safeArray } from "../utils";

export default function OverviewTab({ content, update, addItem, removeItem }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">بيانات اللاعب</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="العنوان الصغير" value={content.overview?.label} onChange={(v) => update(["overview", "label"], v)} />
        <Field label="العنوان الرئيسي" value={content.overview?.title} onChange={(v) => update(["overview", "title"], v)} />
      </div>
      <TextArea label="الوصف المختصر" value={content.overview?.summary} onChange={(v) => update(["overview", "summary"], v)} />
      <ImageUpload label="صورة اللاعب" value={content.overview?.image} onChange={(v) => update(["overview", "image"], v, { autoSave: true })} />
      <ArrayBox title="بيانات اللاعب" items={content.overview?.rows} addLabel="بيان" onAdd={() => addItem(["overview", "rows"], { label: "بيان", value: "قيمة" })}>
        {safeArray(content.overview?.rows).map((row, index) => (
          <ItemShell key={index} title={`بيان ${index + 1}`} onRemove={() => removeItem(["overview", "rows"], index)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="العنوان الصغير" value={row.label} onChange={(v) => update(["overview", "rows", index, "label"], v)} />
              <Field label="القيمة" value={row.value} onChange={(v) => update(["overview", "rows", index, "value"], v)} />
            </div>
          </ItemShell>
        ))}
      </ArrayBox>
    </div>
  );
}
