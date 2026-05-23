"use client";

import { useState } from "react";
import FaIcon from "../icons/FaIcon";
import { safeArray } from "./utils";

const AVAILABLE_ICON_NAMES = [
  "football",
  "shirt",
  "running",
  "flag",
  "calendar",
  "target",
  "handshake",
  "clock",
  "trophy",
  "medal",
  "star",
  "location",
  "chart",
  "bolt",
  "dumbbell",
  "images",
  "image",
  "file",
  "envelope",
  "message",
  "phone",
  "user",
  "users",
  "home",
  "award",
  "timeline",
  "card"
];

const ICON_LABELS = {
  football: "كرة",
  shirt: "تيشيرت",
  running: "جري",
  flag: "علم",
  calendar: "تقويم",
  target: "هدف",
  handshake: "اتفاق",
  clock: "وقت",
  trophy: "كأس",
  medal: "ميدالية",
  star: "نجمة",
  location: "موقع",
  chart: "تحليل",
  bolt: "سرعة",
  dumbbell: "قوة",
  images: "صور",
  image: "صورة",
  file: "ملف",
  envelope: "بريد",
  message: "رسالة",
  phone: "هاتف",
  user: "لاعب",
  users: "فريق",
  home: "الرئيسية",
  award: "جائزة",
  timeline: "مسيرة",
  card: "بطاقة"
};

export function IconField({ label = "Font Awesome Icon", value, onChange }) {
  const [open, setOpen] = useState(false);
  const selectedIcon = AVAILABLE_ICON_NAMES.includes(value) ? value : value || "football";

  function chooseIcon(name) {
    onChange(name);
    setOpen(false);
  }

  return (
    <div className="relative block">
      <span className="label-dark">{label}</span>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-left text-white shadow-inner shadow-black/20 transition hover:border-gold/50 hover:bg-black/45"
        aria-expanded={open}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-gold/25 bg-gold/10 text-gold transition group-hover:scale-105">
            <FaIcon name={selectedIcon} className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-black uppercase tracking-[0.18em] text-white/35">الأيقونة المختارة</span>
            <span className="mt-1 flex flex-wrap items-center gap-2">
              <span className="font-black text-white">{selectedIcon}</span>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs font-bold text-white/45">{ICON_LABELS[selectedIcon] || "أيقونة"}</span>
            </span>
          </span>
        </span>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition ${open ? "rotate-180 text-gold" : ""}`}>
          <FaIcon name="chevron-down" className="h-4 w-4" />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-[70] mt-3 overflow-hidden rounded-[1.5rem] border border-gold/20 bg-[#111] p-3 shadow-2xl shadow-black/50">
          <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <p className="text-sm font-black text-white">اختار أيقونة مناسبة</p>
              <p className="text-xs font-bold text-white/40">كل اختيار ظاهر بشكله واسمه</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-white/55 hover:border-gold/40 hover:text-white">
              إغلاق
            </button>
          </div>

          <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 [scrollbar-width:thin]">
            {AVAILABLE_ICON_NAMES.map((name) => {
              const active = value === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => chooseIcon(name)}
                  className={`group/icon flex items-center gap-2 rounded-2xl border px-3 py-2 text-left transition ${
                    active
                      ? "border-gold/70 bg-gold/15 text-gold"
                      : "border-white/10 bg-white/[0.03] text-white/70 hover:border-gold/40 hover:bg-gold/10 hover:text-white"
                  }`}
                >
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition ${active ? "border-gold/50 bg-gold/20" : "border-white/10 bg-black/30 group-hover/icon:border-gold/40"}`}>
                    <FaIcon name={name} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-black" dir="ltr">{name}</span>
                    <span className="block truncate text-[10px] font-bold text-white/35">{ICON_LABELS[name]}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function Field({ label, value, onChange, placeholder = "", type = "text", dir = "auto" }) {
  return (
    <label className="block">
      <span className="label-dark">{label}</span>
      <input
        className="input-dark"
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(type === "number" ? Number(event.target.value) : event.target.value)}
        placeholder={placeholder}
        dir={dir}
      />
    </label>
  );
}

export function TextArea({ label, value, onChange, rows = 4, dir = "auto" }) {
  return (
    <label className="block">
      <span className="label-dark">{label}</span>
      <textarea className="input-dark resize-y" rows={rows} value={value ?? ""} onChange={(event) => onChange(event.target.value)} dir={dir} />
    </label>
  );
}

function ConfirmBox({ title, message, busy, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#171717] p-6 text-white shadow-2xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15 text-gold">
            <FaIcon name="warning" className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-2xl font-black">{title}</h3>
            <p className="text-sm text-white/55">{message}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" className="btn-muted" onClick={onCancel} disabled={busy}>إلغاء</button>
          <button type="button" className="btn-red" onClick={onConfirm} disabled={busy}>{busy ? "جاري التنفيذ..." : "نعم"}</button>
        </div>
      </div>
    </div>
  );
}

export function ImageUpload({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [confirmUploadOpen, setConfirmUploadOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  async function applyChange(nextValue) {
    const result = onChange(nextValue);
    if (result && typeof result.then === "function") await result;
  }

  async function doUpload(file) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "player-portfolio");
      formData.append("resourceType", "auto");
      if (value) formData.append("oldUrl", value);
      const response = await fetch("/api/admin/upload", { method: "POST", headers: adminRequestHeaders(), body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      await applyChange(data.secure_url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setPendingFile(null);
      setConfirmUploadOpen(false);
    }
  }

  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (value) {
      setPendingFile(file);
      setConfirmUploadOpen(true);
      return;
    }

    await doUpload(file);
  }

  async function clearImage() {
    setUploading(true);
    setError("");
    try {
      await applyChange("");
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setConfirmClearOpen(false);
    }
  }

  return (
    <div className="admin-subpanel">
      <span className="label-dark">{label}</span>
      <div className="grid gap-3 md:grid-cols-[140px_1fr] md:items-center">
        <div className="h-28 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          {value ? <img src={value} alt="preview" className="h-full w-full object-contain p-2" /> : <div className="grid h-full place-items-center text-white/35"><FaIcon name="image" className="h-7 w-7" /></div>}
        </div>
        <div className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            <label className="btn-muted w-fit cursor-pointer">
              <span className="inline-flex items-center gap-2"><FaIcon name="image" className="h-4 w-4" />{uploading ? "جاري الرفع والحفظ..." : value ? "تعديل الصورة" : "رفع صورة"}</span>
              <input type="file" accept="image/*,.svg,.ico" onChange={upload} className="hidden" disabled={uploading} />
            </label>
            {value && (
              <button type="button" onClick={() => setConfirmClearOpen(true)} className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-black text-red-100" disabled={uploading}>
                <span className="inline-flex items-center gap-2"><FaIcon name="trash" className="h-4 w-4" />حذف الصورة</span>
              </button>
            )}
          </div>
          <p className="text-xs font-bold text-white/40">بعد الرفع أو الحذف يتم حفظ التغيير تلقائيًا بدون الضغط على زر حفظ التعديلات.</p>
          {error && <p className="text-sm font-bold text-red-200">{error}</p>}
        </div>
      </div>

      {confirmUploadOpen && (
        <ConfirmBox
          title="تأكيد تعديل الصورة"
          message="هل تريد تعديل الصورة الحالية بالصورة الجديدة؟ سيتم حفظ التغيير تلقائيًا."
          busy={uploading}
          onCancel={() => { setPendingFile(null); setConfirmUploadOpen(false); }}
          onConfirm={() => doUpload(pendingFile)}
        />
      )}

      {confirmClearOpen && (
        <ConfirmBox
          title="تأكيد حذف الصورة"
          message="هل تريد إزالة هذه الصورة من السكشن؟ سيتم حفظ التغيير تلقائيًا."
          busy={uploading}
          onCancel={() => setConfirmClearOpen(false)}
          onConfirm={clearImage}
        />
      )}
    </div>
  );
}

export function FileUpload({ label, value, onChange, accept = "application/pdf,.pdf" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [confirmUploadOpen, setConfirmUploadOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  async function applyChange(nextValue) {
    const result = onChange(nextValue);
    if (result && typeof result.then === "function") await result;
  }

  async function doUpload(file) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "player-portfolio/cv");
      formData.append("resourceType", "raw");
      if (value) formData.append("oldUrl", value);
      const response = await fetch("/api/admin/upload", { method: "POST", headers: adminRequestHeaders(), body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      await applyChange(data.secure_url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setPendingFile(null);
      setConfirmUploadOpen(false);
    }
  }

  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (value) {
      setPendingFile(file);
      setConfirmUploadOpen(true);
      return;
    }

    await doUpload(file);
  }

  async function deleteCurrentFileFromCloudinary() {
    if (!value) return;
    const response = await fetch("/api/admin/cloudinary/delete", {
      method: "POST",
      headers: adminJsonHeaders(),
      body: JSON.stringify({ url: value })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Could not delete the current CV from Cloudinary");
  }

  async function clearFile() {
    setUploading(true);
    setError("");
    try {
      await deleteCurrentFileFromCloudinary();
      await applyChange("");
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setConfirmClearOpen(false);
    }
  }

  return (
    <div className="admin-subpanel">
      <span className="label-dark">{label}</span>
      <div className="grid gap-3 md:grid-cols-[140px_1fr] md:items-center">
        <div className="grid h-28 place-items-center rounded-2xl border border-white/10 bg-black/20 text-white/35">
          <FaIcon name="file" className="h-8 w-8" />
        </div>
        <div className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            {value && (
              <a href="/api/download/cv?preview=1" target="_blank" className="btn-muted" rel="noreferrer">
                <span className="inline-flex items-center gap-2"><FaIcon name="eye" className="h-4 w-4" />معاينة الملف</span>
              </a>
            )}
            <label className="btn-muted w-fit cursor-pointer">
              <span className="inline-flex items-center gap-2"><FaIcon name="file" className="h-4 w-4" />{uploading ? "جاري الرفع والحفظ..." : value ? "تعديل ملف CV" : "رفع ملف CV"}</span>
              <input type="file" accept={accept} onChange={upload} className="hidden" disabled={uploading} />
            </label>
            {value && (
              <button type="button" onClick={() => setConfirmClearOpen(true)} className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-black text-red-100" disabled={uploading}>
                <span className="inline-flex items-center gap-2"><FaIcon name="trash" className="h-4 w-4" />حذف ملف CV</span>
              </button>
            )}
          </div>
          <p className="text-xs font-bold text-white/40">يمكنك رفع ملف PDF أو حذفه، وسيتم حفظ التغيير تلقائيًا مع تنظيف ملف CV القديم من Cloudinary.</p>
          {error && <p className="text-sm font-bold text-red-200">{error}</p>}
        </div>
      </div>

      {confirmUploadOpen && (
        <ConfirmBox
          title="تأكيد تعديل ملف CV"
          message="هل تريد استبدال ملف CV الحالي؟ سيتم حذف الملف الحالي من Cloudinary أولًا، ثم رفع الملف الجديد وحفظ التغيير تلقائيًا."
          busy={uploading}
          onCancel={() => { setPendingFile(null); setConfirmUploadOpen(false); }}
          onConfirm={() => doUpload(pendingFile)}
        />
      )}

      {confirmClearOpen && (
        <ConfirmBox
          title="تأكيد حذف ملف CV"
          message="هل تريد حذف ملف CV؟ سيتم حذفه من Cloudinary ثم حفظ التغيير تلقائيًا."
          busy={uploading}
          onCancel={() => setConfirmClearOpen(false)}
          onConfirm={clearFile}
        />
      )}
    </div>
  );
}

export function ArrayBox({ title, items, onAdd, addLabel = "إضافة", children }) {
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-black">{title}</h3>
        <button type="button" onClick={onAdd} className="btn-muted"><span className="inline-flex items-center gap-2"><FaIcon name="plus" className="h-4 w-4" />{addLabel}</span></button>
      </div>
      {safeArray(items).length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 p-8 text-center text-white/50">لا توجد عناصر حالياً</div>
      ) : (
        <div className="grid gap-4">{children}</div>
      )}
    </div>
  );
}

export function ItemShell({ title, onRemove, children }) {
  return (
    <div className="admin-subpanel grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-black text-gold">{title}</h4>
        <button type="button" className="rounded-2xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm font-black text-red-100" onClick={onRemove}>
          <span className="inline-flex items-center gap-2"><FaIcon name="trash" className="h-4 w-4" />حذف</span>
        </button>
      </div>
      {children}
    </div>
  );
}
