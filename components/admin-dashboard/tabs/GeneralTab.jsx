"use client";

import { ArrayBox, Field, ItemShell, TextArea } from "../AdminFields";
import { safeArray } from "../utils";

export default function GeneralTab({ content, update, addItem, removeItem }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">الإعدادات العامة</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="عنوان الصفحة" value={content.site?.title} onChange={(v) => update(["site", "title"], v)} />
        <Field label="Logo Text" value={content.site?.logoText} onChange={(v) => update(["site", "logoText"], v)} dir="ltr" />
      </div>
      <TextArea label="SEO Description" value={content.site?.description} onChange={(v) => update(["site", "description"], v)} />
      <Field label="Footer Text" value={content.site?.footerText} onChange={(v) => update(["site", "footerText"], v)} />
      <ArrayBox title="القائمة العلوية" items={content.nav} addLabel="لينك" onAdd={() => addItem(["nav"], { label: "لينك جديد", href: "#" })}>
        {safeArray(content.nav).map((item, index) => (
          <ItemShell key={index} title={`لينك ${index + 1}`} onRemove={() => removeItem(["nav"], index)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Label" value={item.label} onChange={(v) => update(["nav", index, "label"], v)} />
              <Field label="Href" value={item.href} onChange={(v) => update(["nav", index, "href"], v)} dir="ltr" />
            </div>
          </ItemShell>
        ))}
      </ArrayBox>
    </div>
  );
}
