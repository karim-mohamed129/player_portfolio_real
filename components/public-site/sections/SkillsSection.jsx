import { SectionBadge } from "../ui";
import { safeArray } from "../utils";

export default function SkillsSection({ skills }) {
  return (
    <section className="py-24" id="skills">
      <div className="mx-auto grid w-[min(1140px,calc(100%-32px))] items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
        {skills?.image && <img src={skills.image} alt="skills" className="h-[430px] rounded-[2rem] border border-white/15 object-cover shadow-glass md:h-[560px]" />}
        <div>
          <SectionBadge icon="bolt">{skills?.label}</SectionBadge>
          <h2 className="mb-6 text-3xl font-black leading-tight md:text-5xl">{skills?.title}</h2>
          <div className="grid gap-6">
            {safeArray(skills?.items).map((skill, index) => (
              <div key={index}>
                <div className="mb-2 flex items-center justify-between gap-4 font-black">
                  <span>{skill.label}</span>
                  <strong className="text-gold">{skill.percent}%</strong>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <span className="block h-full rounded-full bg-gradient-to-l from-danger via-gold to-grass" style={{ width: `${Number(skill.percent || 0)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
