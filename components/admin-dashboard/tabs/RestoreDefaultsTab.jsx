"use client";

import { useState } from "react";
import FaIcon from "../../icons/FaIcon";

export default function RestoreDefaultsTab({ restoring, onRestoreDefaults }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="admin-title">استعادة الإعدادات الافتراضية</h2>
        <p className="mt-2 max-w-3xl leading-8 text-white/60">
          من هنا تقدر ترجع محتوى الموقع لنفس الشكل والمحتوى الذي ظهر أول مرة عند تشغيل الموقع. هذا الإجراء سيستبدل النصوص، الإحصائيات، الصور، السكشنات، وروابط التواصل بالإعدادات الافتراضية.
        </p>
      </div>

      <div className="rounded-[2rem] border border-gold/20 bg-gold/10 p-6">
        <div className="mb-5 flex items-center gap-3 text-gold">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15">
            <FaIcon name="file" className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-xl font-black text-white">ما الذي سيحدث عند استعادة الافتراضي؟</h3>
            <p className="text-sm leading-7 text-white/60">هذا القسم مخصص لإرجاع محتوى الموقع كما ظهر أول مرة قبل أي تعديلات محفوظة.</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <h4 className="mb-2 font-black text-white">المحتوى الذي سيتم استبداله</h4>
            <p className="text-sm leading-7 text-white/65">سيتم رجوع سكشنات الموقع كما ظهرت أول مرة: الرئيسية، التعريف، الإحصائيات، المهارات، المسيرة، الإنجازات، الصور، وبيانات التواصل.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <h4 className="mb-2 font-black text-white">البيانات التي لن تُحذف</h4>
            <p className="text-sm leading-7 text-white/65">رسائل العملاء الموجودة في تبويب الرسائل وحساب الأدمن لن يتم حذفهم عند تطبيق الاستعادة.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <h4 className="mb-2 font-black text-white">الصور والملفات</h4>
            <p className="text-sm leading-7 text-white/65">بعد رجوع المحتوى الافتراضي، سيتم تنظيف الصور غير المستخدمة حتى لا تبقى ملفات غير مرتبطة بالموقع.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <h4 className="mb-2 font-black text-white">قبل التنفيذ</h4>
            <p className="text-sm leading-7 text-white/65">عند الضغط على زر تطبيق ستظهر رسالة تأكيد. لو ضغطت نعم سيتم التنفيذ، ولو ضغطت إلغاء لن يحدث أي تغيير.</p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-red-400/20 bg-red-400/10 p-6">
        <div className="mb-4 flex items-center gap-3 text-red-100">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-400/15">
            <FaIcon name="warning" className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-xl font-black">تنبيه مهم قبل التطبيق</h3>
            <p className="text-sm leading-7 text-red-100/75">أي تعديلات محفوظة حالياً سيتم استبدالها بمحتوى البداية الافتراضي.</p>
          </div>
        </div>
        <ul className="grid gap-2 text-sm leading-7 text-white/70">
          <li>• هذه العملية لا يمكن التراجع عنها بزر واحد بعد التنفيذ، لكن تقدر تعدل المحتوى يدويًا مرة أخرى من التابات.</li>
          <li>• الرسائل الموجودة في قسم الرسائل لن يتم حذفها.</li>
          <li>• الصور التي أصبحت غير مستخدمة سيتم تنظيفها عند تطبيق الاستعادة.</li>
          <li>• بعد الاستعادة يمكنك تعديل المحتوى مرة أخرى والضغط على حفظ التعديلات.</li>
        </ul>
      </div>

      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        disabled={restoring}
        className="btn-red w-fit min-w-44"
      >
        <span className="inline-flex items-center gap-2">
          <FaIcon name="restore" className="h-4 w-4" />
          {restoring ? "جاري التطبيق..." : "تطبيق"}
        </span>
      </button>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#171717] p-6 shadow-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15 text-gold">
                <FaIcon name="restore" className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-2xl font-black">تأكيد الاستعادة</h3>
                <p className="text-sm text-white/55">هل تريد استعادة الإعدادات الافتراضية الآن؟</p>
              </div>
            </div>
            <p className="mb-6 leading-8 text-white/70">
              سيتم رجوع الموقع كما كان أول مرة، وسيتم تنظيف الصور غير المستخدمة بعد التحديث.
            </p>
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" className="btn-muted" onClick={() => setConfirmOpen(false)} disabled={restoring}>إلغاء</button>
              <button
                type="button"
                className="btn-red"
                disabled={restoring}
                onClick={async () => {
                  const ok = await onRestoreDefaults();
                  if (ok) setConfirmOpen(false);
                }}
              >
                {restoring ? "جاري الاستعادة..." : "نعم"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
