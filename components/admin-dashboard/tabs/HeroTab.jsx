"use client";

import { ArrayBox, Field, FileUpload, IconField, ImageUpload, ItemShell, TextArea } from "../AdminFields";
import { safeArray } from "../utils";

export default function HeroTab({ content, update, addItem, removeItem }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">Hero Section</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Tag" value={content.hero?.tag} onChange={(v) => update(["hero", "tag"], v)} />
        <Field label="اسم اللاعب" value={content.hero?.name} onChange={(v) => update(["hero", "name"], v)} />
        <Field label="المركز" value={content.hero?.position} onChange={(v) => update(["hero", "position"], v)} />
      </div>
      <div className="rounded-[1.5rem] border border-gold/15 bg-gold/[.06] p-4">
        <p className="mb-3 text-sm font-black text-gold">بيانات بطاقة حالة اللاعب</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="حالة اللاعب" value={content.hero?.statusTitle} onChange={(v) => update(["hero", "statusTitle"], v)} />
          <Field label="الموسم" value={content.hero?.statusSubtitle} onChange={(v) => update(["hero", "statusSubtitle"], v)} />
        </div>
      </div>
      <TextArea label="الوصف" value={content.hero?.summary} onChange={(v) => update(["hero", "summary"], v)} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Primary Button Text" value={content.hero?.primaryButtonText} onChange={(v) => update(["hero", "primaryButtonText"], v)} />
        <Field label="Secondary Button Text" value={content.hero?.secondaryButtonText} onChange={(v) => update(["hero", "secondaryButtonText"], v)} />
      </div>
      <ImageUpload label="صورة خلفية Hero" value={content.hero?.backgroundImage} onChange={(v) => update(["hero", "backgroundImage"], v, { autoSave: true })} />
      <ImageUpload label="صورة اللاعب" value={content.hero?.playerImage} onChange={(v) => update(["hero", "playerImage"], v, { autoSave: true })} />
      <FileUpload label="ملف CV" value={content.hero?.primaryButtonUrl} onChange={(v) => update(["hero", "primaryButtonUrl"], v, { autoSave: true })} />
      <ArrayBox title="Quick Info Cards" items={content.hero?.quickInfo} addLabel="Add" onAdd={() => addItem(["hero", "quickInfo"], { icon: "football", label: "عنوان", value: "قيمة" })}>
        {safeArray(content.hero?.quickInfo).map((item, index) => (
          <ItemShell key={index} title={`Item ${index + 1}`} onRemove={() => removeItem(["hero", "quickInfo"], index)}>
            <div className="grid gap-4 md:grid-cols-2">
              <IconField value={item.icon} onChange={(v) => update(["hero", "quickInfo", index, "icon"], v)} />
              <Field label="Label" value={item.label} onChange={(v) => update(["hero", "quickInfo", index, "label"], v)} />
              <Field label="Value" value={item.value} onChange={(v) => update(["hero", "quickInfo", index, "value"], v)} />
            </div>
          </ItemShell>
        ))}
      </ArrayBox>
    </div>
  );
}
