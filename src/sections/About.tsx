"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { certificates, education, profile, stats } from "@/data/site";
import Reveal from "@/components/ui/Reveal";

/** Same ruled-table structure as the original About section: photo cell | text cell. */
export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Table rules draw in.
      gsap.utils.toArray<HTMLElement>(".rule-x").forEach((el) =>
        gsap.from(el, { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 90%", once: true } })
      );
      gsap.utils.toArray<HTMLElement>(".rule-y").forEach((el) =>
        gsap.from(el, { scaleY: 0, transformOrigin: "top", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 85%", once: true } })
      );

      gsap.fromTo(
        ".about-photo",
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: ".about-photo", start: "top 80%", once: true } }
      );
      gsap.fromTo(
        ".about-photo img",
        { yPercent: -8, scale: 1.18 },
        { yPercent: 8, scale: 1.05, ease: "none", scrollTrigger: { trigger: ".about-photo", start: "top bottom", end: "bottom top", scrub: true } }
      );

      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        const end = Number(el.dataset.value);
        const decimals = Number(el.dataset.decimals ?? 0);
        const o = { v: 0 };
        gsap.to(o, {
          v: end,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => (el.textContent = o.v.toFixed(decimals)),
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="about" className="relative bg-paper px-6 pt-16 md:px-16 md:pt-24">
      <div className="rule-x h-px w-full bg-line" />
      <div className="flex min-h-[480px] flex-col-reverse lg:flex-row">
        <div className="relative flex items-center justify-center py-8 lg:w-[30%] lg:py-12">
          <div className="about-photo group relative aspect-[3/4] w-full overflow-hidden lg:w-[80%]" data-cursor="true">
            <Image
              src={profile.photo}
              alt={`Portrait of ${profile.name}`}
              fill
              sizes="(min-width: 1024px) 25vw, 100vw"
              className="object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
            />
          </div>
          <div className="rule-y absolute right-0 top-0 hidden h-full w-px bg-line lg:block" />
        </div>
        <div className="w-full pb-2 pt-8 lg:px-16 lg:py-16">
          <h2 className="eyebrow">About me</h2>
          <Reveal as="p" mode="fill" className="pb-8 pt-6 text-xl leading-snug tracking-wide text-ink md:text-2xl lg:w-[92%] lg:text-[28px]">
            {profile.bio}
          </Reveal>
          <div className="grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
            <div>
              <p className="eyebrow mb-3">Certificates</p>
              <ul className="space-y-2 text-sm text-ink/80">
                {certificates.map((c) => (
                  <li key={c.name} className="flex justify-between gap-4">
                    <span>{c.name}</span>
                    <span className="font-mono text-ink/40">{c.year}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-3">Education</p>
              <p className="flex justify-between gap-4 text-sm text-ink/80">
                <span>
                  {education.degree}
                  <br />
                  <span className="text-ink/50">{education.school}</span>
                </span>
                <span className="font-mono text-ink/40">{education.year}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats: one ruled row of cells. */}
      <div className="rule-x h-px w-full bg-line" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s, i) => (
          <div key={s.label} className={`relative py-8 pr-4 md:py-10 ${i > 0 ? "pl-4 md:pl-6" : ""}`}>
            {i > 0 && (
              <div
                className={`rule-y absolute left-0 top-0 h-full w-px bg-line ${i % 2 === 1 ? "block" : "hidden"} ${i % 3 !== 0 ? "md:block" : "md:hidden"} lg:block`}
              />
            )}
            <div className="font-display text-5xl leading-none text-ink md:text-6xl">
              {s.prefix}
              <span className="stat-num tabular-nums" data-value={s.value} data-decimals={s.decimals ?? 0}>
                0
              </span>
              {s.suffix}
            </div>
            <p className="mt-3 text-xs leading-snug text-ink/55">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="rule-x h-px w-full bg-line" />
    </section>
  );
}
