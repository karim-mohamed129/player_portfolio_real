"use client";

import { ArrayBox, Field, IconField, ItemShell } from "../AdminFields";
import { safeArray } from "../utils";

export default function StatsTab({ content, update, addItem, removeItem }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">الإحصائيات</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="العنوان الصغير" value={content.stats?.label} onChange={(v) => update(["stats", "label"], v)} />
        <Field label="العنوان الرئيسي" value={content.stats?.title} onChange={(v) => update(["stats", "title"], v)} />
      </div>
      <ArrayBox title="بطاقات الإحصائيات" items={content.stats?.items} addLabel="إحصائية" onAdd={() => addItem(["stats", "items"], { icon: "chart", value: "0", label: "إحصائية" })}>
        {safeArray(content.stats?.items).map((item, index) => (
          <ItemShell key={index} title={`إحصائية ${index + 1}`} onRemove={() => removeItem(["stats", "items"], index)}>
            <div className="grid gap-4 md:grid-cols-2">
              <IconField value={item.icon} onChange={(v) => update(["stats", "items", index, "icon"], v)} />
              <Field label="القيمة" value={item.value} onChange={(v) => update(["stats", "items", index, "value"], v)} />
              <Field label="العنوان الصغير" value={item.label} onChange={(v) => update(["stats", "items", index, "label"], v)} />
            </div>
          </ItemShell>
        ))}
      </ArrayBox>
    </div>
  );
}
