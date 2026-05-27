"use client";

import { useState } from "react";
import FaIcon from "../../icons/FaIcon";

export default function RestoreDefaultsTab({ restoring, onRestoreDefaults, t }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="admin-title">{t("admin.restore.title")}</h2>
        <p className="mt-2 max-w-3xl leading-8 text-white/60">
          {t("admin.restore.summary")}
        </p>
      </div>

      <div className="rounded-[2rem] border border-gold/20 bg-gold/10 p-6">
        <div className="mb-5 flex items-center gap-3 text-gold">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15">
            <FaIcon name="file" className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-xl font-black text-white">{t("admin.restore.whatHappensTitle")}</h3>
            <p className="text-sm leading-7 text-white/60">{t("admin.restore.whatHappensSummary")}</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <h4 className="mb-2 font-black text-white">{t("admin.restore.replaceTitle")}</h4>
            <p className="text-sm leading-7 text-white/65">{t("admin.restore.replaceText")}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <h4 className="mb-2 font-black text-white">{t("admin.restore.keepTitle")}</h4>
            <p className="text-sm leading-7 text-white/65">{t("admin.restore.keepText")}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <h4 className="mb-2 font-black text-white">{t("admin.restore.filesTitle")}</h4>
            <p className="text-sm leading-7 text-white/65">{t("admin.restore.filesText")}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <h4 className="mb-2 font-black text-white">{t("admin.restore.beforeTitle")}</h4>
            <p className="text-sm leading-7 text-white/65">{t("admin.restore.beforeText")}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-red-400/20 bg-red-400/10 p-6">
        <div className="mb-4 flex items-center gap-3 text-red-100">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-400/15">
            <FaIcon name="warning" className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-xl font-black">{t("admin.restore.warningTitle")}</h3>
            <p className="text-sm leading-7 text-red-100/75">{t("admin.restore.warningText")}</p>
          </div>
        </div>
        <ul className="grid gap-2 text-sm leading-7 text-white/70">
          <li>• {t("admin.restore.bullet1")}</li>
          <li>• {t("admin.restore.bullet2")}</li>
          <li>• {t("admin.restore.bullet3")}</li>
          <li>• {t("admin.restore.bullet4")}</li>
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
          {restoring ? t("admin.restore.applying") : t("admin.common.apply")}
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
                <h3 className="text-2xl font-black">{t("admin.restore.confirmTitle")}</h3>
                <p className="text-sm text-white/55">{t("admin.restore.confirmQuestion")}</p>
              </div>
            </div>
            <p className="mb-6 leading-8 text-white/70">
              {t("admin.restore.confirmBody")}
            </p>
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" className="btn-muted" onClick={() => setConfirmOpen(false)} disabled={restoring}>{t("admin.common.cancel")}</button>
              <button
                type="button"
                className="btn-red"
                disabled={restoring}
                onClick={async () => {
                  const ok = await onRestoreDefaults();
                  if (ok) setConfirmOpen(false);
                }}
              >
                {restoring ? t("admin.restore.restoring") : t("admin.common.yes")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
