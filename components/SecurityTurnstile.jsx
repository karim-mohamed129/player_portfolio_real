"use client";

import { useEffect, useRef, useState } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

export default function SecurityTurnstile({ onToken, className = "" }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!SITE_KEY) return undefined;

    function markReady() {
      setReady(Boolean(window.turnstile));
    }

    if (window.turnstile) {
      markReady();
      return undefined;
    }

    const existing = document.querySelector('script[data-turnstile="true"]');
    if (existing) {
      existing.addEventListener("load", markReady);
      return () => existing.removeEventListener("load", markReady);
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.turnstile = "true";
    script.addEventListener("load", markReady);
    document.head.appendChild(script);

    return () => script.removeEventListener("load", markReady);
  }, []);

  useEffect(() => {
    if (!SITE_KEY || !ready || !containerRef.current || widgetIdRef.current) return undefined;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      theme: "dark",
      callback: (token) => onToken?.(token || ""),
      "expired-callback": () => onToken?.(""),
      "error-callback": () => onToken?.("")
    });

    return () => {
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
      }
      widgetIdRef.current = null;
    };
  }, [ready, onToken]);

  if (!SITE_KEY) return null;

  return (
    <div className={`rounded-2xl border border-white/10 bg-black/20 p-3 ${className}`}>
      <div ref={containerRef} className="min-h-[65px]" />
    </div>
  );
}
