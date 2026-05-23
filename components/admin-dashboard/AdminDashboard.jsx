"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultContent } from "@/lib/defaultContent";
import FaIcon from "../icons/FaIcon";
import { clone } from "./utils";
import GeneralTab from "./tabs/GeneralTab";
import HeroTab from "./tabs/HeroTab";
import OverviewTab from "./tabs/OverviewTab";
import StatsTab from "./tabs/StatsTab";
import SkillsTab from "./tabs/SkillsTab";
import CareerTab from "./tabs/CareerTab";
import AchievementsTab from "./tabs/AchievementsTab";
import MediaTab from "./tabs/MediaTab";
import ContactTab from "./tabs/ContactTab";
import MessagesTab from "./tabs/MessagesTab";
import RestoreDefaultsTab from "./tabs/RestoreDefaultsTab";

const tabs = [
  ["general", "عام", "gauge"],
  ["hero", "Hero", "football"],
  ["overview", "اللاعب", "user"],
  ["stats", "الإحصائيات", "chart"],
  ["skills", "المهارات", "bolt"],
  ["career", "المسيرة", "timeline"],
  ["achievements", "الإنجازات", "trophy"],
  ["media", "الصور", "images"],
  ["contact", "التواصل", "phone"],
  ["messages", "الرسائل", "envelope"],
  ["restore", "استعادة الافتراضي", "restore"]
];

export default function AdminDashboard({ admin }) {
  const [active, setActive] = useState("general");
  const [content, setContent] = useState(defaultContent);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [contentResponse, messagesResponse] = await Promise.all([
        fetch("/api/admin/content", { cache: "no-store" }),
        fetch("/api/admin/messages", { cache: "no-store" })
      ]);
      const contentData = await contentResponse.json();
      const messagesData = await messagesResponse.json();
      if (!contentResponse.ok) throw new Error(contentData.error || "Cannot load content");
      setContent(contentData.data || defaultContent);
      if (messagesResponse.ok) setMessages(messagesData.messages || []);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  function update(path, value) {
    const next = clone(content);
    let current = next;
    for (let i = 0; i < path.length - 1; i += 1) {
      const key = path[i];
      if (current[key] === undefined || current[key] === null) current[key] = typeof path[i + 1] === "number" ? [] : {};
      current = current[key];
    }
    current[path[path.length - 1]] = value;
    setContent(next);
  }

  function addItem(path, item) {
    const next = clone(content);
    let current = next;
    for (const key of path) {
      if (!current[key]) current[key] = [];
      current = current[key];
    }
    current.push(item);
    setContent(next);
  }

  function removeItem(path, index) {
    const next = clone(content);
    let current = next;
    for (const key of path) current = current[key];
    current.splice(index, 1);
    setContent(next);
  }

  function getCleanupMessage(cleanup) {
    const removedDeleted = cleanup?.removedImagesCleanup?.deleted?.length || 0;
    const folderDeleted = cleanup?.folderCleanup?.deleted?.length || 0;
    const failed = (cleanup?.removedImagesCleanup?.failed?.length || 0) + (cleanup?.folderCleanup?.failed?.length || 0);
    const errors = [cleanup?.removedImagesCleanup?.error, cleanup?.folderCleanup?.error].filter(Boolean);

    if (errors.length) return `تم الحفظ، لكن تنظيف Cloudinary يحتاج مراجعة: ${errors.join(" | ")}`;
    if (failed) return `تم الحفظ، وتم حذف ${removedDeleted + folderDeleted} صورة قديمة، لكن فشل حذف ${failed} صورة.`;
    if (removedDeleted || folderDeleted) return `تم حفظ التعديلات وحذف ${removedDeleted + folderDeleted} صورة غير مستخدمة من Cloudinary.`;
    return "تم حفظ التعديلات بنجاح. لا توجد صور قديمة تحتاج حذف.";
  }

  async function save() {
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed");
      setStatus(getCleanupMessage(data.cleanup));
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function cleanupCloudinary() {
    setCleaning(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/cloudinary/cleanup", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Cloudinary cleanup failed");
      const deleted = data.cleanup?.deleted?.length || 0;
      const failed = data.cleanup?.failed?.length || 0;
      setStatus(failed ? `تم حذف ${deleted} صورة غير مسجلة، وفشل حذف ${failed} صورة.` : `تم تنظيف Cloudinary وحذف ${deleted} صورة غير مسجلة في MongoDB.`);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setCleaning(false);
    }
  }

  async function restoreDefaults() {
    setRestoring(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/content/reset", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Restore defaults failed");
      setContent(data.data || defaultContent);
      setStatus(getCleanupMessage(data.cleanup).replace("تم حفظ التعديلات", "تمت استعادة الإعدادات الافتراضية"));
      return true;
    } catch (error) {
      setStatus(error.message);
      return false;
    } finally {
      setRestoring(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  async function patchMessage(id, status) {
    const response = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (response.ok) loadAll();
  }

  async function deleteMessage(id) {
    const confirmed = window.confirm("هل تريد حذف هذه الرسالة نهائياً؟");
    if (!confirmed) return;

    const response = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    if (response.ok) {
      setMessages((current) => current.filter((message) => message._id !== id));
      setStatus("تم حذف الرسالة بنجاح.");
    }
  }

  const messageStats = useMemo(() => ({
    total: messages.length,
    unread: messages.filter((message) => message.status === "new").length
  }), [messages]);

  const sharedTabProps = { content, update, addItem, removeItem };

  function renderActiveTab() {
    if (active === "general") return <GeneralTab {...sharedTabProps} />;
    if (active === "hero") return <HeroTab {...sharedTabProps} />;
    if (active === "overview") return <OverviewTab {...sharedTabProps} />;
    if (active === "stats") return <StatsTab {...sharedTabProps} />;
    if (active === "skills") return <SkillsTab {...sharedTabProps} />;
    if (active === "career") return <CareerTab {...sharedTabProps} />;
    if (active === "achievements") return <AchievementsTab {...sharedTabProps} />;
    if (active === "media") return <MediaTab {...sharedTabProps} />;
    if (active === "contact") return <ContactTab content={content} update={update} />;
    if (active === "messages") return <MessagesTab messages={messages} loadAll={loadAll} patchMessage={patchMessage} deleteMessage={deleteMessage} />;
    if (active === "restore") return <RestoreDefaultsTab restoring={restoring} onRestoreDefaults={restoreDefaults} />;
    return null;
  }

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-xl font-black text-white">جاري تحميل لوحة التحكم...</div>;
  }

  return (
    <main className="min-h-screen px-4 py-6 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/[.07] p-5 shadow-glass backdrop-blur-xl">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-black text-gold"><FaIcon name="gauge" className="h-4 w-4" /> Admin Dashboard</p>
            <h1 className="text-3xl font-black">لوحة تحكم البورتفوليو</h1>
            <p className="text-white/55">مرحباً {admin?.name || admin?.email} — تحكم كامل في كل سكشن من نفس مشروع Vercel.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/" target="_blank" className="btn-muted"><span className="inline-flex items-center gap-2"><FaIcon name="eye" className="h-4 w-4" />عرض الموقع</span></a>
            <button onClick={cleanupCloudinary} disabled={cleaning} className="btn-muted"><span className="inline-flex items-center gap-2"><FaIcon name="trash" className="h-4 w-4" />{cleaning ? "تنظيف..." : "تنظيف Cloudinary"}</span></button>
            <button onClick={save} disabled={saving} className="btn-red"><span className="inline-flex items-center gap-2"><FaIcon name="save" className="h-4 w-4" />{saving ? "جاري الحفظ..." : "حفظ التعديلات"}</span></button>
            <button onClick={logout} className="btn-muted"><span className="inline-flex items-center gap-2"><FaIcon name="login" className="h-4 w-4" />خروج</span></button>
          </div>
        </header>

        {status && <div className="mb-5 rounded-3xl border border-gold/20 bg-gold/10 px-5 py-4 font-black text-gold">{status}</div>}

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="admin-panel h-fit lg:sticky lg:top-5">
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="rounded-3xl bg-black/20 p-4 text-center">
                <FaIcon name="envelope" className="mx-auto mb-2 h-5 w-5 text-white/55" />
                <strong className="block text-2xl">{messageStats.total}</strong>
                <span className="text-xs text-white/55">رسالة</span>
              </div>
              <div className="rounded-3xl bg-black/20 p-4 text-center">
                <FaIcon name="message" className="mx-auto mb-2 h-5 w-5 text-gold" />
                <strong className="block text-2xl text-gold">{messageStats.unread}</strong>
                <span className="text-xs text-white/55">جديد</span>
              </div>
            </div>
            <nav className="grid gap-2">
              {tabs.map(([key, label, icon]) => (
                <button key={key} type="button" onClick={() => setActive(key)} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-start font-black transition ${active === key ? "bg-gold text-black" : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"}`}>
                  <FaIcon name={icon} className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          <section className="admin-panel min-h-[640px]">
            {renderActiveTab()}
          </section>
        </div>
      </div>
    </main>
  );
}
