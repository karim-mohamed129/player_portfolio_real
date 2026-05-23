import FaIcon from "../../icons/FaIcon";
import { SectionBadge } from "../ui";
import { safeArray } from "../utils";

export default function StatsSection({ stats }) {
  return (
    <section className="py-24" id="stats">
      <div className="mx-auto w-[min(1140px,calc(100%-32px))]">
        <div className="mb-12 text-center">
          <SectionBadge icon="chart">{stats?.label}</SectionBadge>
          <h2 className="text-3xl font-black md:text-5xl">{stats?.title}</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {safeArray(stats?.items).map((item, index) => (
            <article key={index} className="glass-card rounded-[2rem] p-7 text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-gold/10 text-gold">
                <FaIcon name={item.icon || "chart"} className="h-8 w-8" />
              </div>
              <strong className="block text-5xl font-black">{item.value}</strong>
              <span className="font-bold text-white/60">{item.label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
