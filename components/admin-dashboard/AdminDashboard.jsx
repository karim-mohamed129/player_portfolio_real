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


function adminJsonHeaders(extra = {}) {
  return {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...extra
  };
}

function adminRequestHeaders(extra = {}) {
  return {
    "X-Requested-With": "XMLHttpRequest",
    ...extra
  };
}

const tabs = [
  ["general", "عام", "gauge"],
  ["hero", "الرئيسية", "football"],
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
  const [mobileTabsOpen, setMobileTabsOpen] = useState(false);
  const [content, setContent] = useState(defaultContent);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [status, setStatus] = useState("");
  const [confirmBox, setConfirmBox] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  function confirmAction({ title, message, confirmText = "نعم", cancelText = "إلغاء", onConfirm }) {
    setConfirmBox({ title, message, confirmText, cancelText, onConfirm });
  }

  function closeConfirm() {
    setConfirmBox(null);
  }

  async function runConfirmedAction() {
    if (!confirmBox?.onConfirm) return;
    const action = confirmBox.onConfirm;
    setConfirmBox(null);
    await action();
  }

  async function loadAll() {
    setLoading(true);
    try {
      const [contentResponse, messagesResponse] = await Promise.all([
        fetch("/api/admin/content", { cache: "no-store" }),
        fetch("/api/admin/messages", { cache: "no-store" })
      ]);
      const contentData = await contentResponse.json();
      const messagesData = await messagesResponse.json();
      if (!contentResponse.ok) throw new Error(contentData.error || "تعذر تحميل محتوى الموقع حالياً.");
      setContent(contentData.data || defaultContent);
      if (messagesResponse.ok) setMessages(messagesData.messages || []);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  function createUpdatedContent(path, value) {
    const next = clone(content);
    let current = next;
    for (let i = 0; i < path.length - 1; i += 1) {
      const key = path[i];
      if (current[key] === undefined || current[key] === null) current[key] = typeof path[i + 1] === "number" ? [] : {};
      current = current[key];
    }
    current[path[path.length - 1]] = value;
    return next;
  }

  function update(path, value, options = {}) {
    const next = createUpdatedContent(path, value);
    setContent(next);
    if (options.autoSave) return saveContent(next, { auto: true });
    return undefined;
  }

  function performAddItem(path, item) {
    const next = clone(content);
    let current = next;
    for (const key of path) {
      if (!current[key]) current[key] = [];
      current = current[key];
    }
    current.push(item);
    setContent(next);
  }

  function addItem(path, item) {
    confirmAction({
      title: "تأكيد الإضافة",
      message: "هل تريد إضافة عنصر جديد في هذا القسم؟",
      onConfirm: () => performAddItem(path, item)
    });
  }

  function performRemoveItem(path, index) {
    const next = clone(content);
    let current = next;
    for (const key of path) current = current[key];
    current.splice(index, 1);
    setContent(next);
  }

  function removeItem(path, index) {
    confirmAction({
      title: "تأكيد الحذف",
      message: "هل تريد حذف هذا العنصر من هذا القسم؟ يمكنك مراجعة التغيير قبل حفظ التعديلات.",
      onConfirm: () => performRemoveItem(path, index)
    });
  }

  function getCleanupMessage(cleanup) {
    const removedDeleted = cleanup?.removedImagesCleanup?.deleted?.length || 0;
    const folderDeleted = cleanup?.folderCleanup?.deleted?.length || 0;
    const failed = (cleanup?.removedImagesCleanup?.failed?.length || 0) + (cleanup?.folderCleanup?.failed?.length || 0);
    const errors = [cleanup?.removedImagesCleanup?.error, cleanup?.folderCleanup?.error].filter(Boolean);

    if (errors.length) return `تم حفظ التعديلات، مع وجود بعض الملفات التي تحتاج مراجعة لاحقاً.`;
    if (failed) return "تم حفظ التعديلات، مع وجود بعض الملفات التي تحتاج مراجعة لاحقاً.";
    if (removedDeleted || folderDeleted) return `تم حفظ التعديلات وتحديث الملفات المرتبطة بالموقع بنجاح.`;
    return "تم حفظ التعديلات بنجاح.";
  }

  async function saveContent(payload = content, options = {}) {
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: adminJsonHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر حفظ التعديلات حالياً.");
      setContent(data.data || payload);
      setStatus(options.auto ? "تم رفع الملف وتطبيق التغيير بنجاح." : getCleanupMessage(data.cleanup));
      return data;
    } catch (error) {
      setStatus(error.message);
      throw error;
    } finally {
      setSaving(false);
    }
  }

  function requestSave() {
    confirmAction({
      title: "تأكيد حفظ التعديلات",
      message: "هل تريد تطبيق كل التعديلات الحالية على الموقع؟",
      onConfirm: saveContent
    });
  }

  async function restoreDefaults() {
    setRestoring(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/content/reset", { method: "POST", headers: adminRequestHeaders() });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذرت استعادة الإعدادات حالياً.");
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

  async function performLogout() {
    await fetch("/api/auth/logout", { method: "POST", headers: adminRequestHeaders() });
    window.location.href = "/admin/login";
  }

  function logout() {
    confirmAction({
      title: "تأكيد الخروج",
      message: "هل تريد تسجيل الخروج من صفحة الإدارة؟",
      onConfirm: performLogout
    });
  }

  async function performPatchMessage(id, status) {
    const response = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: adminJsonHeaders(),
      body: JSON.stringify({ status })
    });
    if (response.ok) loadAll();
  }

  function patchMessage(id, status) {
    confirmAction({
      title: "تأكيد تعديل حالة الرسالة",
      message: status === "read" ? "هل تريد تعليم هذه الرسالة كمقروءة؟" : "هل تريد تعليم هذه الرسالة كجديدة؟",
      onConfirm: () => performPatchMessage(id, status)
    });
  }

  async function performDeleteMessage(id) {
    const response = await fetch(`/api/admin/messages/${id}`, { method: "DELETE", headers: adminRequestHeaders() });
    if (response.ok) {
      setMessages((current) => current.filter((message) => message._id !== id));
      setStatus("تم حذف الرسالة بنجاح.");
    }
  }

  function deleteMessage(id) {
    confirmAction({
      title: "تأكيد حذف الرسالة",
      message: "هل تريد حذف هذه الرسالة نهائياً؟",
      onConfirm: () => performDeleteMessage(id)
    });
  }

  const messageStats = useMemo(() => ({
    total: messages.length,
    unread: messages.filter((message) => message.status === "new").length
  }), [messages]);

  const sharedTabProps = { content, update, addItem, removeItem, confirmAction };

  const activeTab = tabs.find(([key]) => key === active) || tabs[0];

  function selectMobileTab(key) {
    setActive(key);
    setMobileTabsOpen(false);
  }

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
    return <div className="grid min-h-screen place-items-center text-xl font-black text-white">جاري تجهيز صفحة الإدارة...</div>;
  }

  return (
    <main className="min-h-screen px-4 py-6 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/[.07] p-5 shadow-glass backdrop-blur-xl">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-black text-gold"><FaIcon name="gauge" className="h-4 w-4" /> إدارة الموقع</p>
            <h1 className="text-3xl font-black">إدارة محتوى الموقع</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/" target="_blank" className="btn-muted"><span className="inline-flex items-center gap-2"><FaIcon name="eye" className="h-4 w-4" />عرض الموقع</span></a>
            <button onClick={requestSave} disabled={saving} className="btn-red"><span className="inline-flex items-center gap-2"><FaIcon name="save" className="h-4 w-4" />{saving ? "جاري الحفظ..." : "حفظ التعديلات"}</span></button>
            <button onClick={logout} className="btn-muted"><span className="inline-flex items-center gap-2"><FaIcon name="login" className="h-4 w-4" />خروج</span></button>
          </div>
        </header>

        {status && <div className="mb-5 rounded-3xl border border-gold/20 bg-gold/10 px-5 py-4 font-black text-gold">{status}</div>}

        <div className="relative mb-5 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileTabsOpen((current) => !current)}
            className="flex w-full items-center justify-between gap-3 rounded-[1.7rem] border border-white/10 bg-gradient-to-br from-white/[.12] to-white/[.04] p-3 text-start shadow-glass backdrop-blur-xl transition hover:border-gold/30"
            aria-label="اختيار قسم الإدارة"
            aria-expanded={mobileTabsOpen}
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold text-black shadow-lg shadow-gold/10">
                <FaIcon name={activeTab[2]} className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-black uppercase tracking-[.2em] text-white/45">القسم الحالي</span>
                <span className="block truncate text-lg font-black text-white">{activeTab[1]}</span>
              </span>
            </span>
            <span className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs font-black text-gold">
              تغيير
              <FaIcon name="chevron-down" className={`h-3 w-3 transition ${mobileTabsOpen ? "rotate-180" : ""}`} />
            </span>
          </button>

          {mobileTabsOpen && (
            <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 rounded-[1.7rem] border border-white/10 bg-[#07100c]/95 p-3 shadow-[0_24px_70px_rgba(0,0,0,.45)] backdrop-blur-2xl">
              <div className="mb-3 flex items-center justify-between gap-3 rounded-[1.25rem] bg-white/[.05] px-4 py-3">
                <span className="text-sm font-black text-white/80">اختر القسم المطلوب تعديله</span>
                <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-black text-gold">{tabs.length} أقسام</span>
              </div>
              <div className="grid max-h-[62vh] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
                {tabs.map(([key, label, icon]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => selectMobileTab(key)}
                    className={`flex min-h-[74px] flex-col items-center justify-center gap-2 rounded-[1.25rem] border px-3 py-3 text-center text-sm font-black transition ${active === key ? "border-gold bg-gold text-black" : "border-white/10 bg-white/[.06] text-white/75 hover:border-gold/40 hover:bg-gold/10 hover:text-gold"}`}
                  >
                    <FaIcon name={icon} className="h-5 w-5" />
                    <span className="leading-snug">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="admin-panel hidden h-fit lg:sticky lg:top-5 lg:block">
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

      {confirmBox && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#171717] p-6 shadow-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15 text-gold">
                <FaIcon name="warning" className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-2xl font-black">{confirmBox.title}</h3>
                <p className="text-sm text-white/55">{confirmBox.message}</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" className="btn-muted" onClick={closeConfirm}>{confirmBox.cancelText || "إلغاء"}</button>
              <button type="button" className="btn-red" onClick={runConfirmedAction}>{confirmBox.confirmText || "نعم"}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
