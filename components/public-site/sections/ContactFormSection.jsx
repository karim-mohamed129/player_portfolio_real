"use client";

import { useState } from "react";
import FaIcon from "../../icons/FaIcon";
import SecurityTurnstile from "../../SecurityTurnstile";
import { SectionBadge } from "../ui";

export default function ContactFormSection({ contact }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", companyWebsite: "" });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

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
      if (!response.ok) throw new Error(data.error || "تعذر إرسال الرسالة حالياً. برجاء المحاولة مرة أخرى.");
      setStatus({
        type: "success",
        text: "تم إرسال رسالتك بنجاح. شكراً لتواصلك، سيتم الرد عليك في أقرب وقت."
      });
      setForm({ name: "", email: "", phone: "", subject: "", message: "", companyWebsite: "" });
      setTurnstileToken("");
    } catch (error) {
      setStatus({ type: "error", text: error.message || "تعذر إرسال الرسالة حالياً. برجاء المحاولة مرة أخرى." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-20" id="message">
      <div className="mx-auto w-[min(1140px,calc(100%-32px))]">
        <div className="grid gap-8 rounded-[2.25rem] border border-white/15 bg-white/[.075] p-6 shadow-glass backdrop-blur-xl lg:grid-cols-[.9fr_1.1fr] lg:p-10">
          <div>
            {contact?.messageImage && (
              <img src={contact.messageImage} alt="contact" className="mb-6 h-64 w-full rounded-3xl border border-white/15 object-cover shadow-2xl" />
            )}
            <SectionBadge icon="envelope">{contact?.messageLabel || "رسالة مباشرة"}</SectionBadge>
            <h2 className="mb-3 text-3xl font-black leading-tight md:text-5xl">{contact?.messageTitle || "نموذج تواصل سريع"}</h2>
            <p className="text-white/70">{contact?.messageSummary || "اكتب رسالتك بوضوح، وسيتم التواصل معك في أقرب وقت ممكن."}</p>
          </div>

          <form onSubmit={submit} className="grid gap-4">
            <input type="text" name="companyWebsite" value={form.companyWebsite} onChange={updateField} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="label-dark">الاسم بالكامل</span>
                <input className="input-dark" name="name" value={form.name} onChange={updateField} placeholder="اكتب اسمك" required />
              </label>
              <label>
                <span className="label-dark">البريد الإلكتروني</span>
                <input className="input-dark" type="email" name="email" value={form.email} onChange={updateField} placeholder="example@email.com" required />
              </label>
            </div>
            <label>
              <span className="label-dark">رقم الهاتف</span>
              <input className="input-dark" name="phone" value={form.phone} onChange={updateField} placeholder="+20 100 000 0000" />
            </label>
            <label>
              <span className="label-dark">عنوان الرسالة</span>
              <input className="input-dark" name="subject" value={form.subject} onChange={updateField} placeholder="طلب تجربة / تواصل من نادي / استفسار" required />
            </label>
            <label>
              <span className="label-dark">الرسالة</span>
              <textarea className="input-dark min-h-36 resize-y" name="message" value={form.message} onChange={updateField} placeholder="اكتب رسالتك هنا..." required />
            </label>
            <SecurityTurnstile onToken={setTurnstileToken} />
            <button className="btn-red w-fit min-w-44" disabled={loading}>
              <span className="inline-flex items-center gap-2">
                <FaIcon name="send" className="h-4 w-4" />
                {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
              </span>
            </button>
            {status.text && (
              <p className={`rounded-2xl border px-4 py-3 text-sm font-black ${status.type === "success" ? "border-green-400/30 bg-green-400/10 text-green-200" : "border-red-400/30 bg-red-400/10 text-red-200"}`}>
                {status.text}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
