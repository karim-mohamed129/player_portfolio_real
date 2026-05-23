"use client";

import { Field, ImageUpload } from "../AdminFields";
import { safeArray } from "../utils";

export default function GeneralTab({ content, update, confirmAction }) {
  function toggleNavItem(index, item) {
    const willHide = !item.hidden;
    const actionLabel = willHide ? "إخفاء" : "إلغاء الإخفاء";
    const run = () => update(["nav", index, "hidden"], willHide);

    if (confirmAction) {
      confirmAction({
        title: `تأكيد ${actionLabel}`,
        message: `هل تريد ${actionLabel} عنصر القائمة: ${item.label || "بدون اسم"}؟`,
        confirmText: "نعم",
        onConfirm: run
      });
      return;
    }

    run();
  }

  return (
    <div className="grid gap-5">
      <h2 className="admin-title">الإعدادات العامة</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="عنوان الصفحة" value={content.site?.title} onChange={(v) => update(["site", "title"], v)} />
        <Field label="Logo Text" value={content.site?.logoText} onChange={(v) => update(["site", "logoText"], v)} dir="ltr" />
      </div>

      <ImageUpload label="صورة اللوجو في القائمة العلوية" value={content.site?.logoImage || "/logo-mark.svg"} onChange={(v) => update(["site", "logoImage"], v || "/logo-mark.svg", { autoSave: true })} />

      <ImageUpload label="أيقونة التايتل بار" value={content.site?.faviconUrl || "/favicon.svg"} onChange={(v) => update(["site", "faviconUrl"], v || "/favicon.svg", { autoSave: true })} />

      <Field label="Footer Text" value={content.site?.footerText} onChange={(v) => update(["site", "footerText"], v)} />

      <div className="grid gap-4">
        <div>
          <h3 className="text-xl font-black">القائمة العلوية</h3>
          <p className="mt-2 text-sm leading-7 text-white/55">
            هنا يمكنك تعديل اسم كل عنصر في القائمة أو إخفاؤه/إلغاء إخفائه فقط. روابط الأقسام ثابتة داخل الكود لضمان عدم كسر التنقل في الموقع.
          </p>
        </div>

        {safeArray(content.nav).map((item, index) => (
          <div key={`${item.href}-${index}`} className="admin-subpanel grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-black text-gold">عنصر القائمة {index + 1}</h4>
                <p className="text-xs text-white/40">{item.hidden ? "مخفي من القائمة العلوية" : "ظاهر في القائمة العلوية"}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleNavItem(index, item)}
                className={item.hidden ? "btn-red" : "btn-muted"}
              >
                {item.hidden ? "إلغاء الإخفاء" : "إخفاء"}
              </button>
            </div>
            <Field label="اسم الليبل" value={item.label} onChange={(v) => update(["nav", index, "label"], v)} />
          </div>
        ))}
      </div>
    </div>
  );
}
