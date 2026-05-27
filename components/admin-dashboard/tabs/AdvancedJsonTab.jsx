"use client";

import { useTranslation } from "@/components/i18n/LanguageProvider";

export default function AdvancedJsonTab({ content, jsonText, setJsonText, setContent, setStatus }) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-5">
      <h2 className="admin-title">{t("admin.json.title")}</h2>
      <p className="text-white/60">{t("admin.json.summary")}</p>
      <textarea className="min-h-[520px] w-full rounded-3xl border border-white/10 bg-black/40 p-5 font-mono text-sm text-green-100 outline-none focus:border-gold/60" value={jsonText} onChange={(event) => setJsonText(event.target.value)} dir="ltr" />
      <div className="flex flex-wrap gap-3">
        <button className="btn-muted" onClick={() => setJsonText(JSON.stringify(content, null, 2))}>{t("admin.json.restoreCurrent")}</button>
        <button className="btn-red" onClick={() => {
          try {
            const parsed = JSON.parse(jsonText);
            setContent(parsed);
            setStatus(t("admin.json.applied"));
          } catch (error) {
            setStatus(`JSON Error: ${error.message}`);
          }
        }}>{t("admin.json.apply")}</button>
      </div>
    </div>
  );
}
