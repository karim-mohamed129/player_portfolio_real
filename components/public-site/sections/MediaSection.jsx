import { SectionBadge } from "../ui";
import { safeArray } from "../utils";

export default function MediaSection({ media }) {
  const items = safeArray(media?.items).filter((item) => item?.image);

  if (!items.length) return null;

  return (
    <section className="relative isolate overflow-hidden py-24" id="media">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(247,201,72,.12),transparent_34%),radial-gradient(circle_at_12%_45%,rgba(17,155,89,.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,.025),transparent)]" />
      <div className="mx-auto w-[min(1320px,calc(100%-32px))]">
        <div className="mb-12 text-center">
          <div className="mx-auto max-w-4xl">
            <SectionBadge icon="images">{media?.label || "Media"}</SectionBadge>
            <h2 className="mt-4 mb-4 text-4xl font-black leading-tight tracking-tight md:text-6xl">
              {media?.title || "Real photo gallery"}
            </h2>
            <p
              className="mx-auto max-w-3xl text-base leading-8 md:text-lg"
              style={{ color: "var(--text-65)" }}
            >
              {media?.summary || "A selected media gallery that highlights the player's presence on and off the pitch."}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => {
            const caption = item.alt || "";
            const fallbackAlt = `${media?.title || "Gallery image"} ${index + 1}`;

            return (
              <article
                key={index}
                className="group relative overflow-hidden rounded-[2rem] border shadow-[var(--shadow-glass)] transition duration-300 hover:-translate-y-1"
                style={{
                  borderColor: "var(--line)",
                  background:
                    "linear-gradient(155deg, color-mix(in srgb, var(--surface-strong), transparent 8%), color-mix(in srgb, var(--surface-soft), transparent 4%))"
                }}
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden"
                  style={{ background: "var(--surface-contrast)" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,.04) 0%, rgba(0,0,0,.02) 40%, rgba(0,0,0,.38) 100%)"
                    }}
                  />

                  <img
                    src={item.image}
                    alt={caption || fallbackAlt}
                    className="absolute inset-0 h-full w-full object-contain"
                    loading="lazy"
                  />

                  {caption ? (
                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                      <p
                        className="text-lg font-black leading-7 md:text-xl"
                        style={{
                          color: "#ffffff",
                          textShadow: "0 2px 10px rgba(0,0,0,.65), 0 1px 2px rgba(0,0,0,.55)"
                        }}
                      >
                        {caption}
                      </p>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
