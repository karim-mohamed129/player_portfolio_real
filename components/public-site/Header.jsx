"use client";

import { useState } from "react";
import FaIcon from "../icons/FaIcon";
import { IconCircle } from "./ui";
import { safeArray } from "./utils";

export default function Header({ site, nav }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-pitch/75 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[76px] w-[min(1140px,calc(100%-32px))] items-center justify-between gap-4">
        <a href="#home" className="inline-flex items-center gap-3 text-xl font-black tracking-wide">
          <IconCircle icon="football" className="h-11 w-11 text-lg" />
          <span>{site?.logoText || "MH10"}</span>
        </a>

        <button className="btn-muted px-4 md:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="فتح القائمة">
          <FaIcon name="bars" className="h-5 w-5" />
        </button>

        <ul className={`${menuOpen ? "flex" : "hidden"} absolute left-4 right-4 top-[76px] flex-col rounded-3xl border border-white/10 bg-pitch/95 p-3 shadow-glass md:static md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
          {safeArray(nav).map((item, index) => (
            <li key={`${item.href}-${index}`}>
              <a onClick={() => setMenuOpen(false)} className="block rounded-2xl px-3 py-3 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white md:p-0 md:hover:bg-transparent" href={item.href || "#"}>
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a onClick={() => setMenuOpen(false)} className="block rounded-2xl px-3 py-3 text-sm font-black text-gold md:p-0" href="/admin/login">لوحة التحكم</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
