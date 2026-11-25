"use client";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { experience } from "@/data/career";
import { profile } from "@/data/site";
import Magnetic from "@/components/ui/Magnetic";

/** Original Experience layout: dark band, giant title, resume gutter | ruled job list. */
export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".exp-title", { type: "lines,words", mask: "lines" });
      gsap.from(split.words, { yPercent: 110, stagger: 0.06, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".exp-title", start: "top 85%", once: true } });
      gsap.from(".exp-rule-x", { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: ".exp-table", start: "top 85%", once: true } });
      // The left rule fills as you read down the list.
      gsap.fromTo(".exp-progress", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".exp-list", start: "top 70%", end: "bottom 70%", scrub: true } });
      gsap.utils.toArray<HTMLElement>(".exp-item").forEach((el) => {
        gsap.from(el.querySelectorAll(".exp-anim"), {
          x: 50,
          opacity: 0,
          stagger: 0.06,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        });
        gsap.from(el.querySelector(".exp-dash"), { scaleX: 0, transformOrigin: "left", duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 82%", once: true } });
      });
      return () => split.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="experience" className="dark min-h-[500px] w-full bg-[#151515] pb-16 text-white lg:pb-24">
      <h2 className="exp-title px-8 pb-4 pt-12 font-display text-[56px] leading-none tracking-wider text-white lg:w-[900px] lg:px-16 lg:pt-20 lg:text-[120px] lg:leading-[124px]">
        My work experience
      </h2>
      <div className="exp-table px-6 lg:px-16">
        <div className="relative flex">
          <span aria-hidden className="exp-rule-x absolute left-0 top-0 hidden h-px w-full bg-white/25 lg:block" />
          <div className="hidden w-[25%] justify-center py-12 lg:flex">
            <div className="sticky top-28 h-fit">
              <Magnetic>
                <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-primary mt-4 h-[70px] w-[250px] max-w-full" data-cursor="true">
                  Download resume
                </a>
              </Magnetic>
            </div>
          </div>
          <ol className="exp-list relative w-full px-4 lg:w-[75%] lg:py-12">
            <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-white/15" />
            <span aria-hidden className="exp-progress absolute left-0 top-0 h-full w-px origin-top bg-white" />
            {experience.map((job) => (
              <li key={job.company} className="exp-item flex flex-col px-2 py-6 lg:py-6">
                <div className="relative mb-2 flex items-center">
                  <span aria-hidden className="exp-dash absolute -left-6 top-1/2 h-px w-3 bg-white lg:-left-8" />
                  <h3 className="exp-anim text-[18px] font-semibold text-white lg:text-[20px]">
                    {job.role}
                    <span className="pl-1 text-[13px] font-normal text-white/60">
                      {" "}
                      @
                      {"url" in job && job.url ? (
                        <a href={job.url} target="_blank" rel="noreferrer" className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white" data-cursor="true">
                          {job.company}
                        </a>
                      ) : (
                        job.company
                      )}
                    </span>
                  </h3>
                  {job.current && (
                    <span className="exp-anim ml-3 flex items-center gap-1.5 rounded-full border border-white/30 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/80">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                      Current
                    </span>
                  )}
                </div>
                <span className="exp-anim text-[13px] italic text-white/60">
                  {job.period} · {job.location}
                </span>
                <ul className="mt-3 space-y-2 lg:w-[800px] lg:max-w-full">
                  {job.points.map((pt) => (
                    <li key={pt} className="exp-anim text-[15px] leading-relaxed text-white/80">
                      {pt}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
