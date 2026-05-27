"use client";

import { ArrayBox, Field, IconField, ItemShell, LocalizedField } from "../AdminFields";
import { safeArray } from "../utils";

export default function StatsTab({ content, update, addItem, removeItem, t }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">{t("admin.sections.statsTitle")}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <LocalizedField label={t("admin.fields.smallTitle")} value={content.stats?.label} onChange={(v) => update(["stats", "label"], v)} />
        <LocalizedField label={t("admin.fields.mainTitle")} value={content.stats?.title} onChange={(v) => update(["stats", "title"], v)} />
      </div>
      <ArrayBox title={t("admin.sections.statsCards")} items={content.stats?.items} addLabel={t("admin.sections.stat")} onAdd={() => addItem(["stats", "items"], { icon: "chart", value: "0", label: t("admin.sections.stat") })}>
        {safeArray(content.stats?.items).map((item, index) => (
          <ItemShell key={index} title={`${t("admin.sections.stat")} ${index + 1}`} onRemove={() => removeItem(["stats", "items"], index)}>
            <div className="grid gap-4 md:grid-cols-2">
              <IconField value={item.icon} onChange={(v) => update(["stats", "items", index, "icon"], v)} />
              <Field label={t("admin.fields.value")} value={item.value} onChange={(v) => update(["stats", "items", index, "value"], v)} />
              <LocalizedField label={t("admin.fields.smallTitle")} value={item.label} onChange={(v) => update(["stats", "items", index, "label"], v)} />
            </div>
          </ItemShell>
        ))}
      </ArrayBox>
    </div>
  );
}
