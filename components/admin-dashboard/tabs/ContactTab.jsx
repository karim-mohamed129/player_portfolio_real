"use client";

import { Field, ImageUpload, TextArea } from "../AdminFields";

export default function ContactTab({ content, update }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">التواصل ونموذج الرسائل</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Label" value={content.contact?.label} onChange={(v) => update(["contact", "label"], v)} />
        <Field label="Title" value={content.contact?.title} onChange={(v) => update(["contact", "title"], v)} />
        <Field label="Email" value={content.contact?.email} onChange={(v) => update(["contact", "email"], v)} dir="ltr" />
        <Field label="Phone" value={content.contact?.phone} onChange={(v) => update(["contact", "phone"], v)} dir="ltr" />
      </div>
      <TextArea label="Summary" value={content.contact?.summary} onChange={(v) => update(["contact", "summary"], v)} />
      <ImageUpload label="Contact Image" value={content.contact?.image} onChange={(v) => update(["contact", "image"], v, { autoSave: true })} />
      <div className="admin-subpanel grid gap-4">
        <h3 className="text-xl font-black text-gold">نموذج الرسائل</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Message Label" value={content.contact?.messageLabel} onChange={(v) => update(["contact", "messageLabel"], v)} />
          <Field label="Message Title" value={content.contact?.messageTitle} onChange={(v) => update(["contact", "messageTitle"], v)} />
        </div>
        <TextArea label="Message Summary" value={content.contact?.messageSummary} onChange={(v) => update(["contact", "messageSummary"], v)} />
        <ImageUpload label="Message Image" value={content.contact?.messageImage} onChange={(v) => update(["contact", "messageImage"], v, { autoSave: true })} />
      </div>
    </div>
  );
}
