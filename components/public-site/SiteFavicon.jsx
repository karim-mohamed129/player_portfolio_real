"use client";

import { useEffect } from "react";

export default function SiteFavicon({ href }) {
  useEffect(() => {
    const iconHref = href || "/favicon.svg";
    const rels = ["icon", "shortcut icon", "apple-touch-icon"];

    rels.forEach((rel) => {
      let link = document.querySelector(`link[rel=\"${rel}\"]`);
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        document.head.appendChild(link);
      }
      link.setAttribute("href", iconHref);
      if (iconHref.endsWith(".svg")) link.setAttribute("type", "image/svg+xml");
      else link.removeAttribute("type");
    });
  }, [href]);

  return null;
}
