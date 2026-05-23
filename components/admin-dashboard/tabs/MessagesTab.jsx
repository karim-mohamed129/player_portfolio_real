"use client";

import FaIcon from "../../icons/FaIcon";

export default function MessagesTab({ messages, loadAll, patchMessage, deleteMessage }) {
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="admin-title">رسائل التواصل</h2>
          <p className="mt-2 max-w-3xl leading-8 text-white/60">
            هنا تظهر رسائل الزوار الواردة من نموذج التواصل في الموقع. يمكنك متابعة الرسائل الجديدة، تعليمها كمقروءة، أو حذف الرسائل غير المطلوبة.
          </p>
        </div>
        <button onClick={loadAll} className="btn-muted"><span className="inline-flex items-center gap-2"><FaIcon name="refresh" className="h-4 w-4" />تحديث</span></button>
      </div>
      {messages.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-white/50">لا توجد رسائل جديدة حالياً</div>
      ) : (
        <div className="grid gap-4">
          {messages.map((message) => (
            <article key={message._id} className="admin-subpanel">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-black">{message.subject}</h3>
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${message.status === "new" ? "bg-gold text-black" : "bg-white/10 text-white/60"}`}>
                      <FaIcon name={message.status === "new" ? "message" : "envelope"} className="h-3 w-3" />
                      {message.status === "new" ? "جديد" : "مقروء"}
                    </span>
                  </div>
                  <p className="text-sm text-white/55" dir="ltr">{message.email} — {message.phone || "لا يوجد رقم هاتف"}</p>
                  <p className="text-sm text-white/55">{message.name} — {new Date(message.createdAt).toLocaleString("ar-EG")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="btn-muted min-h-10 px-3 py-2 text-sm" onClick={() => patchMessage(message._id, message.status === "new" ? "read" : "new")}>{message.status === "new" ? "تمييز كمقروء" : "تمييز كجديدة"}</button>
                  <button className="rounded-2xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm font-black text-red-100" onClick={() => deleteMessage(message._id)}><span className="inline-flex items-center gap-2"><FaIcon name="trash" className="h-4 w-4" />حذف</span></button>
                </div>
              </div>
              <p className="whitespace-pre-wrap rounded-2xl bg-black/20 p-4 leading-8 text-white/80">{message.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
