"use client";

import { ArrayBox, ImageUpload, ItemShell, LocalizedField, LocalizedTextArea } from "../AdminFields";
import { safeArray } from "../utils";

export default function OverviewTab({ content, update, addItem, removeItem, t }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">{t("admin.sections.overviewTitle")}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <LocalizedField label={t("admin.fields.smallTitle")} value={content.overview?.label} onChange={(v) => update(["overview", "label"], v)} />
        <LocalizedField label={t("admin.fields.mainTitle")} value={content.overview?.title} onChange={(v) => update(["overview", "title"], v)} />
      </div>
      <LocalizedTextArea label={t("admin.fields.shortDescription")} value={content.overview?.summary} onChange={(v) => update(["overview", "summary"], v)} />
      <ImageUpload label={t("admin.fields.playerImage")} value={content.overview?.image} onChange={(v) => update(["overview", "image"], v, { autoSave: true })} />
      <ArrayBox title={t("admin.sections.overviewRows")} items={content.overview?.rows} addLabel={t("admin.sections.overviewRow")} onAdd={() => addItem(["overview", "rows"], { label: { ar: "", en: "" }, value: { ar: "", en: "" } })}>
        {safeArray(content.overview?.rows).map((row, index) => (
          <ItemShell key={index} title={`${t("admin.sections.overviewRow")} ${index + 1}`} onRemove={() => removeItem(["overview", "rows"], index)}>
            <div className="grid gap-4 md:grid-cols-2">
              <LocalizedField label={t("admin.fields.smallTitle")} value={row.label} onChange={(v) => update(["overview", "rows", index, "label"], v)} />
              <LocalizedField label={t("admin.fields.value")} value={row.value} onChange={(v) => update(["overview", "rows", index, "value"], v)} />
            </div>
          </ItemShell>
        ))}
      </ArrayBox>
    </div>
  );
}
