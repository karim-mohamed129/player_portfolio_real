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
                  <svg className="h-full w-full" viewBox="0 0 100 3" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id={`skill-gradient-${index}`} x1="100%" x2="0%" y1="0" y2="0">
                        <stop offset="0%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="100%" stopColor="currentColor" />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width={Math.max(0, Math.min(100, Number(skill.percent || 0)))} height="3" rx="1.5" className="text-gold" fill="currentColor" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
