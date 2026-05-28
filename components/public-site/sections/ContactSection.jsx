"use client";

import { useTranslation } from "@/components/i18n/LanguageProvider";
import FaIcon from "../../icons/FaIcon";
import { ButtonLink, SectionBadge } from "../ui";

export default function ContactSection({ contact }) {
  const { t } = useTranslation();

  return (
    <section className="py-24" id="contact">
      <div className="mx-auto grid w-[min(1140px,calc(100%-32px))] items-center gap-7 rounded-[2.25rem] border border-white/15 bg-gradient-to-br from-danger/25 to-grass/20 p-7 shadow-glass backdrop-blur-xl lg:grid-cols-[260px_1fr_auto] lg:p-10">
        {contact?.image && <img src={contact.image} alt={contact?.title || t("contact.imageAlt")} className="site-image-cover h-64 rounded-3xl border border-white/15 lg:h-60" loading="lazy" />}
        <div>
          <SectionBadge icon="file">{contact?.label}</SectionBadge>
          <h2 className="mb-3 text-3xl font-black leading-tight md:text-5xl">{contact?.title}</h2>
          <p className="text-white/70">{contact?.summary}</p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <ButtonLink href={`mailto:${contact?.email || ""}`}>
            <span className="inline-flex items-center gap-2" dir="ltr"><FaIcon name="envelope" className="h-4 w-4" />{contact?.email}</span>
          </ButtonLink>
          <ButtonLink href={`tel:${contact?.phone || ""}`} variant="secondary">
            <span className="inline-flex items-center gap-2" dir="ltr"><FaIcon name="phone" className="h-4 w-4" />{contact?.phone}</span>
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
