"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FaIcon from "./icons/FaIcon";
import { IconCircle } from "./public-site/ui";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");
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
        <a href="/" className="mb-8 inline-flex items-center gap-3 text-xl font-black">
          <IconCircle icon="football" className="h-12 w-12 text-xl" />
          Player Admin
        </a>
        <h1 className="mb-2 text-3xl font-black">تسجيل دخول لوحة التحكم</h1>
        <p className="mb-7 text-white/60">ادخل بيانات الأدمن المتخزنة في MongoDB.</p>

        <form onSubmit={submit} className="grid gap-4">
          <label>
            <span className="label-dark">Email</span>
            <input className="input-dark" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required />
          </label>
          <label>
            <span className="label-dark">Password</span>
            <input className="input-dark" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </label>
          <button className="btn-red w-full" disabled={loading}>
            <span className="inline-flex items-center justify-center gap-2">
              <FaIcon name="login" className="h-4 w-4" />
              {loading ? "جاري الدخول..." : "دخول"}
            </span>
          </button>
          {error && <p className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-black text-red-200">{error}</p>}
        </form>
      </section>
    </main>
  );
}
