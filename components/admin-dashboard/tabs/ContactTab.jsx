"use client";

import { Field, ImageUpload, LocalizedField, LocalizedTextArea } from "../AdminFields";

export default function ContactTab({ content, update, t }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">{t("admin.sections.contactTitle")}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <LocalizedField label={t("admin.fields.smallTitle")} value={content.contact?.label} onChange={(v) => update(["contact", "label"], v)} />
        <LocalizedField label={t("admin.fields.mainTitle")} value={content.contact?.title} onChange={(v) => update(["contact", "title"], v)} />
        <Field label={t("admin.fields.email")} value={content.contact?.email} onChange={(v) => update(["contact", "email"], v)} dir="ltr" />
        <Field label={t("admin.fields.phone")} value={content.contact?.phone} onChange={(v) => update(["contact", "phone"], v)} dir="ltr" />
      </div>
      <LocalizedTextArea label={t("admin.fields.shortDescription")} value={content.contact?.summary} onChange={(v) => update(["contact", "summary"], v)} />
      <ImageUpload label={t("admin.sections.contactImage")} value={content.contact?.image} onChange={(v) => update(["contact", "image"], v, { autoSave: true })} />
      <div className="admin-subpanel grid gap-4">
        <h3 className="text-xl font-black text-gold">{t("admin.sections.messageForm")}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <LocalizedField label={t("admin.sections.messageFormLabel")} value={content.contact?.messageLabel} onChange={(v) => update(["contact", "messageLabel"], v)} />
          <LocalizedField label={t("admin.sections.messageFormTitle")} value={content.contact?.messageTitle} onChange={(v) => update(["contact", "messageTitle"], v)} />
        </div>
        <LocalizedTextArea label={t("admin.sections.messageFormSummary")} value={content.contact?.messageSummary} onChange={(v) => update(["contact", "messageSummary"], v)} />
        <ImageUpload label={t("admin.sections.messageFormImage")} value={content.contact?.messageImage} onChange={(v) => update(["contact", "messageImage"], v, { autoSave: true })} />
      </div>
    </div>
  );
}
