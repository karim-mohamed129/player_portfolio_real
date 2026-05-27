"use client";

import { ArrayBox, IconField, ImageUpload, ItemShell, LocalizedField, LocalizedTextArea } from "../AdminFields";
import { safeArray } from "../utils";

export default function AchievementsTab({ content, update, addItem, removeItem, t }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">{t("admin.sections.achievementsTitle")}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <LocalizedField label={t("admin.fields.smallTitle")} value={content.achievements?.label} onChange={(v) => update(["achievements", "label"], v)} />
        <LocalizedField label={t("admin.fields.mainTitle")} value={content.achievements?.title} onChange={(v) => update(["achievements", "title"], v)} />
      </div>
      <ArrayBox title={t("admin.sections.achievementsCards")} items={content.achievements?.items} addLabel={t("admin.sections.achievement")} onAdd={() => addItem(["achievements", "items"], { icon: "trophy", title: t("admin.sections.achievement"), description: t("admin.fields.description"), image: "" })}>
        {safeArray(content.achievements?.items).map((item, index) => (
          <ItemShell key={index} title={item.title || `${t("admin.sections.achievement")} ${index + 1}`} onRemove={() => removeItem(["achievements", "items"], index)}>
            <div className="grid gap-4 md:grid-cols-2">
              <IconField value={item.icon} onChange={(v) => update(["achievements", "items", index, "icon"], v)} />
              <LocalizedField label={t("admin.fields.mainTitle")} value={item.title} onChange={(v) => update(["achievements", "items", index, "title"], v)} />
            </div>
            <LocalizedTextArea label={t("admin.fields.description")} value={item.description} onChange={(v) => update(["achievements", "items", index, "description"], v)} />
            <ImageUpload label={t("admin.fields.image")} value={item.image} onChange={(v) => update(["achievements", "items", index, "image"], v, { autoSave: true })} />
          </ItemShell>
        ))}
      </ArrayBox>
    </div>
  );
}
