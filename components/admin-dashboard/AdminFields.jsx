"use client";

import { useState } from "react";
import FaIcon from "../icons/FaIcon";
import { safeArray } from "./utils";

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

export function IconNameHelp() {
  return (
    <p className="mt-2 text-xs leading-6 text-white/45">
      أسماء أيقونات Font Awesome المتاحة: football, shirt, running, flag, calendar, target, handshake, clock, trophy, medal, star, chart, bolt, images, file, envelope, phone.
    </p>
  );
}

export function ImageUpload({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "player-portfolio");
      if (value) formData.append("oldUrl", value);
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      onChange(data.secure_url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function clearImage() {
    onChange("");
    setError("");
  }

  return (
    <div className="admin-subpanel">
      <span className="label-dark">{label}</span>
      <div className="grid gap-3 md:grid-cols-[140px_1fr] md:items-center">
        <div className="h-28 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          {value ? <img src={value} alt="preview" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-white/35"><FaIcon name="image" className="h-7 w-7" /></div>}
        </div>
        <div className="grid gap-3">
          <input className="input-dark" value={value ?? ""} onChange={(event) => onChange(event.target.value)} placeholder="Image URL" dir="ltr" />
          <div className="flex flex-wrap gap-2">
            <label className="btn-muted w-fit cursor-pointer">
              <span className="inline-flex items-center gap-2"><FaIcon name="image" className="h-4 w-4" />{uploading ? "جاري الرفع..." : value ? "استبدال الصورة" : "رفع صورة"}</span>
              <input type="file" accept="image/*" onChange={upload} className="hidden" disabled={uploading} />
            </label>
            {value && (
              <button type="button" onClick={clearImage} className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-black text-red-100">
                <span className="inline-flex items-center gap-2"><FaIcon name="trash" className="h-4 w-4" />حذف الصورة</span>
              </button>
            )}
          </div>
          <p className="text-xs leading-6 text-white/45">
            عند الاستبدال أو حذف الصورة ثم الضغط على حفظ، سيتم حذف الصورة القديمة من Cloudinary تلقائياً لو لم تعد مستخدمة في أي سكشن.
          </p>
          {error && <p className="text-sm font-bold text-red-200">{error}</p>}
        </div>
      </div>
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
