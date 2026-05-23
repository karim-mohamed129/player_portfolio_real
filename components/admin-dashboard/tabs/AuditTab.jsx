"use client";

import FaIcon from "../../icons/FaIcon";

function actionLabel(action) {
  const labels = {
    "login.success": "دخول ناجح",
    "login.bad_password": "كلمة مرور خاطئة",
    "login.turnstile_failed": "فشل Turnstile",
    "login.rate_limited": "محاولات كثيرة",
    "logout": "تسجيل خروج",
    "content.update": "تعديل المحتوى",
    "content.restore_defaults": "استعادة الافتراضي",
    "message.status": "تعديل حالة رسالة",
    "message.delete": "حذف رسالة",
    "cloudinary.delete": "حذف Cloudinary",
    "upload.file": "رفع ملف"
  };
  return labels[action] || action;
}

export default function AuditTab({ auditLogs, loadAuditLogs }) {
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="admin-title">سجل الأمان والتعديلات</h2>
          <p className="mt-2 max-w-3xl leading-8 text-white/60">
            هنا يظهر سجل دخول الأدمن، التعديلات، الحذف، رفع الملفات، ومحاولات الدخول المرفوضة. السجل يساعدك تراجع أي عملية حصلت داخل الداشبورد.
          </p>
        </div>
        <button onClick={loadAuditLogs} className="btn-muted"><span className="inline-flex items-center gap-2"><FaIcon name="refresh" className="h-4 w-4" />تحديث</span></button>
      </div>

      {auditLogs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-white/50">لا توجد عمليات مسجلة حتى الآن</div>
      ) : (
        <div className="grid gap-3">
          {auditLogs.map((log) => (
            <article key={log._id} className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${log.status === "success" ? "bg-green-400/15 text-green-200" : "bg-red-400/15 text-red-200"}`}>
                      <FaIcon name={log.status === "success" ? "check" : "warning"} className="h-3 w-3" />
                      {log.status === "success" ? "نجاح" : "فشل"}
                    </span>
                    <h3 className="text-lg font-black">{actionLabel(log.action)}</h3>
                  </div>
                  <p className="text-sm text-white/60" dir="ltr">{log.adminEmail} — {log.ip}</p>
                  <p className="text-sm text-white/45">{new Date(log.createdAt).toLocaleString("ar-EG")}</p>
                </div>
                <div className="rounded-2xl bg-white/[.06] px-3 py-2 text-xs font-black text-white/55" dir="ltr">{log.target}</div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
