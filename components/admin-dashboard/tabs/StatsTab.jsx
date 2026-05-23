"use client";

import { ArrayBox, Field, IconField, ItemShell } from "../AdminFields";
import { safeArray } from "../utils";

export default function StatsTab({ content, update, addItem, removeItem }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">الإحصائيات</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Label" value={content.stats?.label} onChange={(v) => update(["stats", "label"], v)} />
        <Field label="Title" value={content.stats?.title} onChange={(v) => update(["stats", "title"], v)} />
      </div>
      <ArrayBox title="Stats Cards" items={content.stats?.items} addLabel="Stat" onAdd={() => addItem(["stats", "items"], { icon: "chart", value: "0", label: "Stat" })}>
        {safeArray(content.stats?.items).map((item, index) => (
          <ItemShell key={index} title={`Stat ${index + 1}`} onRemove={() => removeItem(["stats", "items"], index)}>
            <div className="grid gap-4 md:grid-cols-2">
              <IconField value={item.icon} onChange={(v) => update(["stats", "items", index, "icon"], v)} />
              <Field label="Value" value={item.value} onChange={(v) => update(["stats", "items", index, "value"], v)} />
              <Field label="Label" value={item.label} onChange={(v) => update(["stats", "items", index, "label"], v)} />
            </div>
          </ItemShell>
        ))}
      </ArrayBox>
    </div>
  );
}
