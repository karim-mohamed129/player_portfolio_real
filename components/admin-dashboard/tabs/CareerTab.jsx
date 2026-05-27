"use client";

import { ArrayBox, Field, ImageUpload, ItemShell, LocalizedField, LocalizedTextArea } from "../AdminFields";
import { safeArray } from "../utils";

export default function CareerTab({ content, update, addItem, removeItem, t }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">{t("admin.sections.careerTitle")}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <LocalizedField label={t("admin.fields.smallTitle")} value={content.career?.label} onChange={(v) => update(["career", "label"], v)} />
        <LocalizedField label={t("admin.fields.mainTitle")} value={content.career?.title} onChange={(v) => update(["career", "title"], v)} />
      </div>
      <ArrayBox title={t("admin.sections.careerSteps")} items={content.career?.items} addLabel={t("admin.sections.stage")} onAdd={() => addItem(["career", "items"], { year: "2026", title: t("admin.sections.stage"), description: t("admin.fields.description"), image: "" })}>
        {safeArray(content.career?.items).map((item, index) => (
          <ItemShell key={index} title={item.title || `${item.year || t("admin.sections.stage")}`} onRemove={() => removeItem(["career", "items"], index)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label={t("admin.fields.year")} value={item.year} onChange={(v) => update(["career", "items", index, "year"], v)} />
              <LocalizedField label={t("admin.fields.mainTitle")} value={item.title} onChange={(v) => update(["career", "items", index, "title"], v)} />
            </div>
            <LocalizedTextArea label={t("admin.fields.description")} value={item.description} onChange={(v) => update(["career", "items", index, "description"], v)} />
            <ImageUpload label={t("admin.fields.image")} value={item.image} onChange={(v) => update(["career", "items", index, "image"], v, { autoSave: true })} />
          </ItemShell>
        ))}
      </ArrayBox>
    </div>
  );
}
