"use client";

import { ImageUpload, LocalizedField, LocalizedTextArea } from "../AdminFields";
import { safeArray } from "../utils";
import { getLocalizedText } from "@/lib/localizedText";

export default function GeneralTab({ content, update, confirmAction, t, locale }) {
  function text(key) {
    return t(key);
  }

  function format(template, values) {
    return Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, value), template);
  }

  function toggleNavItem(index, item) {
    const willHide = !item.hidden;
    const actionLabel = willHide ? text("admin.sections.hide") : text("admin.sections.unhide");
    const run = () => update(["nav", index, "hidden"], willHide);

    if (confirmAction) {
      confirmAction({
        title: format(text("admin.sections.confirmHideTitle"), { action: actionLabel }),
        message: format(text("admin.sections.confirmHideMessage"), { action: actionLabel, label: getLocalizedText(item.label, locale, text("admin.sections.noName")) }),
        confirmText: text("admin.common.yes"),
        onConfirm: run
      });
      return;
    }

    run();
  }

  return (
    <div className="grid gap-5">
      <h2 className="admin-title">{text("admin.sections.generalTitle")}</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <LocalizedField label={text("admin.fields.pageTitle")} value={content.site?.title} onChange={(v) => update(["site", "title"], v)} />
        <LocalizedField label={text("admin.fields.logoText")} value={content.site?.logoText} onChange={(v) => update(["site", "logoText"], v)} />
      </div>

      <LocalizedTextArea label={text("admin.fields.shortDescription")} value={content.site?.description} onChange={(v) => update(["site", "description"], v)} />

      <ImageUpload label={text("admin.fields.logoImage")} value={content.site?.logoImage || "/logo-mark.svg"} onChange={(v) => update(["site", "logoImage"], v || "/logo-mark.svg", { autoSave: true })} />

      <ImageUpload label={text("admin.fields.favicon")} value={content.site?.faviconUrl || "/favicon.svg"} onChange={(v) => update(["site", "faviconUrl"], v || "/favicon.svg", { autoSave: true })} />

      <LocalizedField label={text("admin.fields.footerText")} value={content.site?.footerText} onChange={(v) => update(["site", "footerText"], v)} />

      <div className="grid gap-4">
        <div>
          <h3 className="text-xl font-black">{text("admin.sections.navTitle")}</h3>
          <p className="mt-2 text-sm leading-7 text-white/55">
            {text("admin.sections.navHelp")}
          </p>
        </div>

        {safeArray(content.nav).map((item, index) => (
          <div key={`${item.href}-${index}`} className="admin-subpanel grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-black text-gold">{text("admin.sections.navItem")} {index + 1}</h4>
                <p className="text-xs text-white/40">{item.hidden ? text("admin.sections.hidden") : text("admin.sections.visible")}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleNavItem(index, item)}
                className={item.hidden ? "btn-red" : "btn-muted"}
              >
                {item.hidden ? text("admin.sections.unhide") : text("admin.sections.hide")}
              </button>
            </div>
            <LocalizedField label={text("admin.fields.labelName")} value={item.label} onChange={(v) => update(["nav", index, "label"], v)} />
          </div>
        ))}
      </div>
    </div>
  );
}
