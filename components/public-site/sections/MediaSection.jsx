import { SectionBadge } from "../ui";
import { safeArray } from "../utils";

export default function MediaSection({ media }) {
  return (
    <section className="py-24" id="media">
      <div className="mx-auto w-[min(1140px,calc(100%-32px))]">
        <div className="mb-12 text-center">
          <SectionBadge icon="images">{media?.label}</SectionBadge>
          <h2 className="mb-3 text-3xl font-black md:text-5xl">{media?.title}</h2>
          <p className="mx-auto max-w-3xl text-white/65">{media?.summary}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {safeArray(media?.items).map((item, index) => (
            <img key={index} src={item.image} alt={item.alt || "gallery"} className="h-80 rounded-[2rem] border border-white/15 object-cover shadow-2xl" />
          ))}
        </div>
      </div>
    </section>
  );
}
