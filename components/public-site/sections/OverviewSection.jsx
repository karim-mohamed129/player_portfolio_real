import { SectionBadge } from "../ui";
import { safeArray } from "../utils";

export default function OverviewSection({ overview }) {
  return (
    <section className="py-24" id="overview">
      <div className="mx-auto grid w-[min(1140px,calc(100%-32px))] items-center gap-10 lg:grid-cols-[1.2fr_.8fr]">
        <div>
          <SectionBadge icon="user">{overview?.label}</SectionBadge>
          <h2 className="mb-4 text-3xl font-black leading-tight md:text-5xl">{overview?.title}</h2>
          <p className="text-lg leading-9 text-white/70">{overview?.summary}</p>
        </div>
        <div className="glass-card rounded-[2rem] p-6">
          {overview?.image && <img src={overview.image} alt="profile" className="mb-5 h-56 rounded-3xl border border-white/15 object-cover" />}
          {safeArray(overview?.rows).map((row, index) => (
            <div key={index} className="flex items-center justify-between gap-4 border-b border-white/10 py-4 last:border-0">
              <span className="text-white/60">{row.label}</span>
              <strong className="text-gold">{row.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
