import { SectionBadge } from "../ui";
import { safeArray } from "../utils";

const galleryLayouts = [
  "lg:col-span-3 lg:row-span-2 lg:min-h-[600px]",
  "lg:col-span-5 lg:row-span-2 lg:min-h-[600px]",
  "lg:col-span-4 lg:row-span-2 lg:min-h-[600px]",
  "lg:col-span-4 lg:min-h-[290px]",
  "lg:col-span-4 lg:min-h-[290px]",
  "lg:col-span-4 lg:min-h-[290px]"
];

export default function MediaSection({ media }) {
  const items = safeArray(media?.items).filter((item) => item?.image);

  if (!items.length) return null;

  return (
    <section className="relative isolate overflow-hidden py-28" id="media">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(247,201,72,.12),transparent_34%),radial-gradient(circle_at_12%_45%,rgba(17,155,89,.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,.025),transparent)]" />
      <div className="absolute start-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl rtl:translate-x-1/2" />

      <div className="mx-auto w-[min(1320px,calc(100%-32px))]">
        <div className="mb-12 text-center">
          <div className="mx-auto max-w-3xl">
            <SectionBadge icon="images">{media?.label}</SectionBadge>
            <h2 className="mb-4 text-4xl font-black leading-tight tracking-tight md:text-6xl">
              {media?.title}
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-white/65 md:text-xl">{media?.summary}</p>
          </div>
        </div>

        <div className="relative rounded-[2.75rem] border border-white/10 bg-white/[.045] p-3 shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur-xl md:p-4">
          <div className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

          <div className="grid gap-4 lg:grid-cols-12 lg:auto-rows-[290px]">
            {items.map((item, index) => (
              <article
                key={index}
                className={`group relative min-h-[360px] overflow-hidden rounded-[2.25rem] border border-white/10 bg-black/30 shadow-2xl ${galleryLayouts[index] || "lg:col-span-4 lg:min-h-[290px]"}`}
              >
                <img
                  src={item.image}
                  alt={item.alt || "gallery"}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent opacity-70 transition duration-700 group-hover:opacity-35" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
