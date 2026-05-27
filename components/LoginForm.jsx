"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import { useTranslation } from "@/components/i18n/LanguageProvider";
import FaIcon from "./icons/FaIcon";
import { IconCircle } from "./public-site/ui";
import SecurityTurnstile from "./SecurityTurnstile";

export default function LoginForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, turnstileToken })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t("admin.login.genericError"));
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[.075] p-7 shadow-glass backdrop-blur-xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <a href="/" className="inline-flex items-center gap-3 text-xl font-black">
            <IconCircle icon="football" className="h-12 w-12 text-xl" />
            {t("admin.login.brand")}
          </a>
          <div className="flex items-center gap-2">
            <ThemeSwitcher compact />
            <LanguageSwitcher compact />
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-black">{t("admin.login.title")}</h1>
        <p className="mb-7 text-white/60">{t("admin.login.summary")}</p>

        <form onSubmit={submit} className="grid gap-4">
          <label>
            <span className="label-dark">{t("admin.login.email")}</span>
            <input className="input-dark" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" dir="ltr" required />
          </label>
          <label>
            <span className="label-dark">{t("admin.login.password")}</span>
            <input className="input-dark" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" dir="ltr" required />
          </label>
          <SecurityTurnstile onToken={setTurnstileToken} />
          <button className="btn-red w-full" disabled={loading}>
            <span className="inline-flex items-center justify-center gap-2">
              <FaIcon name="login" className="h-4 w-4" />
              {loading ? t("admin.login.loading") : t("admin.login.button")}
            </span>
          </button>
          {error && <p className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-black text-red-200">{error}</p>}
        </form>
      </section>
    </main>
  );
}
