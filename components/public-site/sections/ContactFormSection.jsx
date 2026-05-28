"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/components/i18n/LanguageProvider";
import FaIcon from "../../icons/FaIcon";
import SecurityTurnstile from "../../SecurityTurnstile";
import { SectionBadge } from "../ui";

function FloatingPublicMessage({ status }) {
  if (!status?.text) return null;
  const isSuccess = status.type === "success";

  return (
    <div className="pointer-events-none fixed start-1/2 top-5 z-[120] w-[min(620px,calc(100%-24px))] -translate-x-1/2 px-1 rtl:translate-x-1/2">
      <div className={`pointer-events-auto flex items-start gap-3 rounded-[1.5rem] border px-5 py-4 shadow-[0_18px_60px_rgba(0,0,0,.45)] backdrop-blur-2xl ${isSuccess ? "border-green-400/30 bg-[#07150d]/95 text-green-100" : "border-red-400/30 bg-[#190b0b]/95 text-red-100"}`}>
        <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-2xl ${isSuccess ? "bg-green-400 text-black" : "bg-red-400 text-white"}`}>
          <FaIcon name={isSuccess ? "check" : "warning"} className="h-4 w-4" />
        </span>
        <p className="flex-1 text-sm font-black leading-7 md:text-base">{status.text}</p>
      </div>
    </div>
  );
}

export default function ContactFormSection({ contact }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", companyWebsite: "" });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!status.text) return undefined;
    const timer = window.setTimeout(() => setStatus({ type: "", text: "" }), 5200);
    return () => window.clearTimeout(timer);
  }, [status]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "", text: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t("form.genericError"));
      setStatus({
        type: "success",
        text: t("form.success")
      });
      setForm({ name: "", email: "", phone: "", subject: "", message: "", companyWebsite: "" });
      setTurnstileToken("");
    } catch (error) {
      setStatus({ type: "error", text: error.message || t("form.genericError") });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <FloatingPublicMessage status={status} />
      <section className="py-20" id="message">
        <div className="mx-auto w-[min(1140px,calc(100%-32px))]">
          <div className="grid gap-8 rounded-[2.25rem] border border-white/15 bg-white/[.075] p-6 shadow-glass backdrop-blur-xl lg:grid-cols-[.9fr_1.1fr] lg:p-10">
            <div>
              {contact?.messageImage && (
                <img src={contact.messageImage} alt={contact?.messageTitle || t("contact.imageAlt")} className="site-image-cover mb-6 h-64 rounded-3xl border border-white/15 shadow-2xl" loading="lazy" />
              )}
              <SectionBadge icon="envelope">{contact?.messageLabel || t("form.directMessage")}</SectionBadge>
              <h2 className="mb-3 text-3xl font-black leading-tight md:text-5xl">{contact?.messageTitle || t("form.title")}</h2>
              <p className="text-white/70">{contact?.messageSummary || t("form.summary")}</p>
            </div>

            <form onSubmit={submit} className="grid gap-4">
              <input type="text" name="companyWebsite" value={form.companyWebsite} onChange={updateField} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="label-dark">{t("form.fullName")}</span>
                  <input className="input-dark" name="name" value={form.name} onChange={updateField} placeholder={t("form.fullNamePlaceholder")} required />
                </label>
                <label>
                  <span className="label-dark">{t("form.email")}</span>
                  <input className="input-dark" type="email" name="email" value={form.email} onChange={updateField} placeholder="example@email.com" required />
                </label>
              </div>
              <label>
                <span className="label-dark">{t("form.phone")}</span>
                <input className="input-dark" name="phone" value={form.phone} onChange={updateField} placeholder="+20 100 000 0000" />
              </label>
              <label>
                <span className="label-dark">{t("form.subject")}</span>
                <input className="input-dark" name="subject" value={form.subject} onChange={updateField} placeholder={t("form.subjectPlaceholder")} required />
              </label>
              <label>
                <span className="label-dark">{t("form.message")}</span>
                <textarea className="input-dark min-h-36 resize-y" name="message" value={form.message} onChange={updateField} placeholder={t("form.messagePlaceholder")} required />
              </label>
              <SecurityTurnstile onToken={setTurnstileToken} />
              <button className="btn-red w-fit min-w-44" disabled={loading}>
                <span className="inline-flex items-center gap-2">
                  <FaIcon name="send" className="h-4 w-4" />
                  {loading ? t("form.sending") : t("form.send")}
                </span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
