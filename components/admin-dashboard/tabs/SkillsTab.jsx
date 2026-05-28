"use client";

import { ArrayBox, Field, ImageUpload, ItemShell, LocalizedField } from "../AdminFields";
import { safeArray } from "../utils";

export default function SkillsTab({ content, update, addItem, removeItem, t }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">{t("admin.sections.skillsTitle")}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <LocalizedField label={t("admin.fields.smallTitle")} value={content.skills?.label} onChange={(v) => update(["skills", "label"], v)} />
        <LocalizedField label={t("admin.fields.mainTitle")} value={content.skills?.title} onChange={(v) => update(["skills", "title"], v)} />
      </div>
      <ImageUpload label={t("admin.sections.skillsImage")} value={content.skills?.image} onChange={(v) => update(["skills", "image"], v, { autoSave: true })} />
      <ArrayBox title={t("admin.sections.skillsList")} items={content.skills?.items} addLabel={t("admin.sections.skill")} onAdd={() => addItem(["skills", "items"], { label: { ar: "", en: "" }, percent: "" })}>
        {safeArray(content.skills?.items).map((item, index) => (
          <ItemShell key={index} title={`${t("admin.sections.skill")} ${index + 1}`} onRemove={() => removeItem(["skills", "items"], index)}>
            <div className="grid gap-4 md:grid-cols-2">
              <LocalizedField label={t("admin.fields.smallTitle")} value={item.label} onChange={(v) => update(["skills", "items", index, "label"], v)} />
              <Field label={t("admin.fields.percent")} type="number" value={item.percent} onChange={(v) => update(["skills", "items", index, "percent"], v)} />
            </div>
          </ItemShell>
        ))}
      </ArrayBox>
    </div>
  );
}
