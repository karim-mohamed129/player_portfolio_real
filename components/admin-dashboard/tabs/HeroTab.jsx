"use client";

import { ArrayBox, Field, FileUpload, IconField, ImageUpload, ItemShell, LocalizedField, LocalizedTextArea } from "../AdminFields";
import { safeArray } from "../utils";

export default function HeroTab({ content, update, addItem, removeItem, t }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">{t("admin.sections.heroTitle")}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <LocalizedField label={t("admin.fields.tag")} value={content.hero?.tag} onChange={(v) => update(["hero", "tag"], v)} />
        <LocalizedField label={t("admin.fields.playerName")} value={content.hero?.name} onChange={(v) => update(["hero", "name"], v)} />
        <LocalizedField label={t("admin.fields.position")} value={content.hero?.position} onChange={(v) => update(["hero", "position"], v)} />
      </div>
      <div className="rounded-[1.5rem] border border-gold/15 bg-gold/[.06] p-4">
        <p className="mb-3 text-sm font-black text-gold">{t("admin.fields.playerStatusCard")}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <LocalizedField label={t("admin.fields.playerStatus")} value={content.hero?.statusTitle} onChange={(v) => update(["hero", "statusTitle"], v)} />
          <LocalizedField label={t("admin.fields.season")} value={content.hero?.statusSubtitle} onChange={(v) => update(["hero", "statusSubtitle"], v)} />
        </div>
      </div>
      <LocalizedTextArea label={t("admin.fields.description")} value={content.hero?.summary} onChange={(v) => update(["hero", "summary"], v)} />
      <div className="grid gap-4 md:grid-cols-2">
        <LocalizedField label={t("admin.fields.primaryButton")} value={content.hero?.primaryButtonText} onChange={(v) => update(["hero", "primaryButtonText"], v)} />
        <LocalizedField label={t("admin.fields.secondaryButton")} value={content.hero?.secondaryButtonText} onChange={(v) => update(["hero", "secondaryButtonText"], v)} />
      </div>
      <ImageUpload label={t("admin.fields.backgroundImage")} value={content.hero?.backgroundImage} onChange={(v) => update(["hero", "backgroundImage"], v, { autoSave: true })} />
      <ImageUpload label={t("admin.fields.playerImage")} value={content.hero?.playerImage} onChange={(v) => update(["hero", "playerImage"], v, { autoSave: true })} />
      <FileUpload label={t("admin.fields.cvFile")} value={content.hero?.primaryButtonUrl} onChange={(v) => update(["hero", "primaryButtonUrl"], v, { autoSave: true })} />
      <ArrayBox title={t("admin.sections.quickInfo")} items={content.hero?.quickInfo} addLabel={t("admin.common.add")} onAdd={() => addItem(["hero", "quickInfo"], { icon: "football", label: t("admin.fields.smallTitle"), value: t("admin.fields.value") })}>
        {safeArray(content.hero?.quickInfo).map((item, index) => (
          <ItemShell key={index} title={`Item ${index + 1}`} onRemove={() => removeItem(["hero", "quickInfo"], index)}>
            <div className="grid gap-4 md:grid-cols-2">
              <IconField value={item.icon} onChange={(v) => update(["hero", "quickInfo", index, "icon"], v)} />
              <LocalizedField label={t("admin.fields.smallTitle")} value={item.label} onChange={(v) => update(["hero", "quickInfo", index, "label"], v)} />
              <LocalizedField label={t("admin.fields.value")} value={item.value} onChange={(v) => update(["hero", "quickInfo", index, "value"], v)} />
            </div>
          </ItemShell>
        ))}
      </ArrayBox>
    </div>
  );
}
