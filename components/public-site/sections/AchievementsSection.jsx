import FaIcon from "../../icons/FaIcon";
import { SectionBadge } from "../ui";
import { safeArray } from "../utils";

export default function AchievementsSection({ achievements }) {
  return (
    <section className="py-24" id="achievements">
      <div className="mx-auto w-[min(1140px,calc(100%-32px))]">
        <div className="mb-12 text-center">
          <SectionBadge icon="trophy">{achievements?.label}</SectionBadge>
          <h2 className="text-3xl font-black md:text-5xl">{achievements?.title}</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {safeArray(achievements?.items).map((item, index) => (
            <article key={index} className="glass-card overflow-hidden rounded-[2rem]">
              {item.image && <img src={item.image} alt={item.title} className="h-56 w-full object-cover" />}
              <div className="p-6">
                <div className="mb-4 inline-grid h-14 w-14 place-items-center rounded-3xl bg-gold/10 text-gold">
                  <FaIcon name={item.icon || "trophy"} className="h-7 w-7" />
                </div>
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
