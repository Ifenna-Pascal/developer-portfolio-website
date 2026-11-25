"use client";
import { useRef } from "react";
import { gsap, useGSAP, FULL_MOTION } from "@/lib/gsap";
import { process } from "@/data/career";

export default function Process() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const panels = gsap.utils.toArray<HTMLElement>(".proc-panel");

      mm.add(FULL_MOTION, () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(".proc-progress", { scaleX: self.progress }),
          },
        });
        panels.forEach((panel) => {
          gsap.from(panel.querySelectorAll(".proc-anim"), {
            y: 60,
            opacity: 0,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 75%", end: "left 40%", scrub: true },
          });
          gsap.fromTo(
            panel.querySelector(".proc-num"),
            { xPercent: 30 },
            { xPercent: -30, ease: "none", scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left right", end: "right left", scrub: true } }
          );
        });
      });

      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        panels.forEach((panel) =>
          gsap.from(panel.querySelectorAll(".proc-anim"), {
            y: 30,
            opacity: 0,
            stagger: 0.06,
            duration: 0.8,
            scrollTrigger: { trigger: panel, start: "top 80%", once: true },
          })
        );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="process" className="dark relative overflow-clip bg-ink text-paper md:h-svh">
      <div className="flex items-center justify-between px-6 pt-20 md:absolute md:inset-x-0 md:top-0 md:z-10 md:px-16 md:pt-24">
        <span className="eyebrow">How I build</span>
        <span className="hidden font-mono text-[11px] text-white/40 md:block">Scroll →</span>
      </div>

      <div ref={track} className="flex flex-col md:h-full md:w-max md:flex-row">
        <div className="proc-panel flex shrink-0 flex-col justify-center px-6 py-14 md:h-full md:w-[55vw] md:px-16">
          <h2 className="proc-anim font-display text-7xl leading-[0.85] md:text-[9vw]">
            How I
            <br />
            build.
          </h2>
          <p className="proc-anim mt-6 max-w-md text-white/60">
            Four steps I run on every product, from a two-week MVP to a payments platform moving millions.
          </p>
        </div>
        {process.map((step) => (
          <div
            key={step.n}
            className="proc-panel relative flex shrink-0 flex-col justify-center overflow-hidden border-t border-white/15 px-6 py-14 md:h-full md:w-[70vw] md:border-l md:border-t-0 md:px-16 lg:w-[55vw]"
          >
            <span
              aria-hidden
              className="proc-num pointer-events-none absolute -bottom-10 right-0 select-none font-display text-[42vw] leading-none text-transparent md:text-[30vw]"
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.14)" }}
            >
              {step.n}
            </span>
            <span className="proc-anim font-mono text-sm text-white/50">{step.n}</span>
            <h3 className="proc-anim mt-4 font-display text-7xl leading-none md:text-[7vw]">{step.title}</h3>
            <p className="proc-anim mt-6 max-w-md text-base leading-relaxed text-white/65 md:text-lg">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-6 bottom-8 hidden h-px bg-white/15 md:inset-x-16 md:block">
        <div className="proc-progress h-full origin-left scale-x-0 bg-white" />
      </div>
    </section>
  );
}
