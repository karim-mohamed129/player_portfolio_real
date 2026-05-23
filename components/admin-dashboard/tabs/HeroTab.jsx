"use client";

import { ArrayBox, Field, IconNameHelp, ImageUpload, ItemShell, TextArea } from "../AdminFields";
import { safeArray } from "../utils";

export default function HeroTab({ content, update, addItem, removeItem }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">Hero Section</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Tag" value={content.hero?.tag} onChange={(v) => update(["hero", "tag"], v)} />
        <Field label="اسم اللاعب" value={content.hero?.name} onChange={(v) => update(["hero", "name"], v)} />
        <Field label="المركز" value={content.hero?.position} onChange={(v) => update(["hero", "position"], v)} />
        <Field label="Status Title" value={content.hero?.statusTitle} onChange={(v) => update(["hero", "statusTitle"], v)} />
        <Field label="Status Subtitle" value={content.hero?.statusSubtitle} onChange={(v) => update(["hero", "statusSubtitle"], v)} />
      </div>
      <TextArea label="الوصف" value={content.hero?.summary} onChange={(v) => update(["hero", "summary"], v)} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Primary Button Text" value={content.hero?.primaryButtonText} onChange={(v) => update(["hero", "primaryButtonText"], v)} />
        <Field label="Primary Button URL" value={content.hero?.primaryButtonUrl} onChange={(v) => update(["hero", "primaryButtonUrl"], v)} dir="ltr" />
        <Field label="Secondary Button Text" value={content.hero?.secondaryButtonText} onChange={(v) => update(["hero", "secondaryButtonText"], v)} />
        <Field label="Secondary Button URL" value={content.hero?.secondaryButtonUrl} onChange={(v) => update(["hero", "secondaryButtonUrl"], v)} dir="ltr" />
      </div>
      <ImageUpload label="صورة خلفية Hero" value={content.hero?.backgroundImage} onChange={(v) => update(["hero", "backgroundImage"], v)} />
      <ImageUpload label="صورة اللاعب" value={content.hero?.playerImage} onChange={(v) => update(["hero", "playerImage"], v)} />
      <ArrayBox title="Quick Info Cards" items={content.hero?.quickInfo} addLabel="Card" onAdd={() => addItem(["hero", "quickInfo"], { icon: "football", label: "عنوان", value: "قيمة" })}>
        {safeArray(content.hero?.quickInfo).map((item, index) => (
          <ItemShell key={index} title={`Card ${index + 1}`} onRemove={() => removeItem(["hero", "quickInfo"], index)}>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Field label="Font Awesome Icon" value={item.icon} onChange={(v) => update(["hero", "quickInfo", index, "icon"], v)} dir="ltr" />
                <IconNameHelp />
              </div>
              <Field label="Label" value={item.label} onChange={(v) => update(["hero", "quickInfo", index, "label"], v)} />
              <Field label="Value" value={item.value} onChange={(v) => update(["hero", "quickInfo", index, "value"], v)} />
            </div>
          </ItemShell>
        ))}
      </ArrayBox>
    </div>
  );
}
