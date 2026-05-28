import { SectionBadge } from "../ui";
import { safeArray } from "../utils";

export default function CareerSection({ career }) {
  return (
    <section className="py-24" id="career">
      <div className="mx-auto w-[min(900px,calc(100%-32px))]">
        <div className="mb-12 text-center">
          <SectionBadge icon="timeline">{career?.label}</SectionBadge>
          <h2 className="text-3xl font-black md:text-5xl">{career?.title}</h2>
        </div>
        <div className="grid gap-5">
          {safeArray(career?.items).map((item, index) => (
            <article key={index} className="glass-card grid items-center gap-5 rounded-[2rem] p-5 md:grid-cols-[150px_110px_1fr]">
              {item.image && <img src={item.image} alt={item.title || `${career?.title || "Career"} ${index + 1}`} className="site-image-cover h-36 rounded-3xl border border-white/15 md:h-28" loading="lazy" />}
              <div className="grid min-h-14 place-items-center rounded-2xl bg-gradient-to-br from-danger to-grass text-xl font-black">{item.year}</div>
              <div>
                <h3 className="mb-2 text-xl font-black">{item.title}</h3>
                <p className="text-white/65">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
