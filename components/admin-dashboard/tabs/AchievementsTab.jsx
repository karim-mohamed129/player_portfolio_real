"use client";

import { ArrayBox, Field, IconField, ImageUpload, ItemShell, TextArea } from "../AdminFields";
import { safeArray } from "../utils";

export default function AchievementsTab({ content, update, addItem, removeItem }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">الإنجازات</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="العنوان الصغير" value={content.achievements?.label} onChange={(v) => update(["achievements", "label"], v)} />
        <Field label="العنوان الرئيسي" value={content.achievements?.title} onChange={(v) => update(["achievements", "title"], v)} />
      </div>
      <ArrayBox title="بطاقات الإنجازات" items={content.achievements?.items} addLabel="إنجاز" onAdd={() => addItem(["achievements", "items"], { icon: "trophy", title: "إنجاز جديد", description: "وصف الإنجاز", image: "" })}>
        {safeArray(content.achievements?.items).map((item, index) => (
          <ItemShell key={index} title={item.title || `Achievement ${index + 1}`} onRemove={() => removeItem(["achievements", "items"], index)}>
            <div className="grid gap-4 md:grid-cols-2">
              <IconField value={item.icon} onChange={(v) => update(["achievements", "items", index, "icon"], v)} />
              <Field label="العنوان الرئيسي" value={item.title} onChange={(v) => update(["achievements", "items", index, "title"], v)} />
            </div>
            <TextArea label="الوصف" value={item.description} onChange={(v) => update(["achievements", "items", index, "description"], v)} />
            <ImageUpload label="صورة" value={item.image} onChange={(v) => update(["achievements", "items", index, "image"], v, { autoSave: true })} />
          </ItemShell>
        ))}
      </ArrayBox>
    </div>
  );
}
