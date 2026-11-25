"use client";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { onIntro } from "@/lib/intro";
import { profile } from "@/data/site";
import Magnetic from "@/components/ui/Magnetic";

const AtomGlobe = dynamic(() => import("@/components/canvas/AtomGlobe"), { ssr: false });

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const split = SplitText.create(".hero-name", { type: "lines,chars", mask: "lines" });
      gsap.set(split.chars, { yPercent: 115 });
      gsap.set([".hero-fade", ".hero-title"], { opacity: 0, y: 24 });
      gsap.set(".hero-rule", { scaleX: 0, transformOrigin: "left" });

      const off = onIntro(
        contextSafe!(() => {
          gsap
            .timeline({ delay: 0.1 })
            .to(split.chars, { yPercent: 0, stagger: 0.035, duration: 1.3, ease: "expo.out" })
            .to(".hero-rule", { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 0.2)
            .to(".hero-title", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.4)
            .to(".hero-title", { duration: 1.4, scrambleText: { text: profile.title, chars: "01<>/{}", speed: 0.6 } }, 0.4)
            .to(".hero-fade", { opacity: 1, y: 0, stagger: 0.08, duration: 0.9, ease: "power3.out" }, 0.6);
        })
      );

      // Gentle parallax as you scroll away.
      gsap.to(".hero-name", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-orb-wrap", {
        yPercent: 18,
        scale: 0.85,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });

      return () => {
        off();
        split.revert();
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} id="home" className="relative flex min-h-svh flex-col overflow-clip bg-paper px-6 pb-8 pt-28 md:px-12 md:pt-32">
      <div className="grid flex-1 items-center gap-6 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="hero-title font-mono text-xs uppercase tracking-[0.3em] text-ink/60 md:text-sm">{profile.title}</p>
          <h1 className="hero-name mt-6 font-display text-[23vw] leading-[0.82] tracking-tight text-ink md:text-[13vw] lg:text-[13.5vw]">
            {profile.firstName}
            <br />
            {profile.lastName}.
          </h1>
        </div>
        <div className="hero-orb-wrap md:col-span-5">
          <AtomGlobe className="mx-auto aspect-square w-[86vw] max-w-[620px] md:w-full" />
        </div>
      </div>

      <div className="hero-rule mt-8 h-px w-full bg-ink/20" />
      <div className="mt-6 grid gap-6 md:grid-cols-12 md:items-end">
        <p className="hero-fade max-w-xl text-base leading-relaxed text-ink/70 md:col-span-6 md:text-lg">{profile.intro}</p>
        <div className="hero-fade flex flex-wrap gap-3 md:col-span-6 md:justify-end">
          <Magnetic>
            <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-primary" data-cursor="true">
              Download resume <span aria-hidden>↓</span>
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#contact" className="btn btn-ghost" data-cursor="true">
              Let&apos;s talk
            </a>
          </Magnetic>
        </div>
      </div>
      <div className="hero-fade mt-8 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
        <span>{profile.focus.join(" · ")}</span>
        <span className="hidden md:inline">Based in {profile.location}</span>
        <span>Scroll ↓</span>
      </div>
    </section>
  );
}
