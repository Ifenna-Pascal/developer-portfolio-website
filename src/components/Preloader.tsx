"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { profile } from "@/data/site";

import { INTRO_EVENT } from "@/lib/intro";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      document.documentElement.classList.add("is-loading");
      const counter = { v: 0 };
      let cancelled = false;
      const finish = () => {
        // setTimeout escapes this GSAP context, so listeners' selectors resolve against the
        // whole document rather than the preloader's scope.
        setTimeout(() => {
          const w = window as unknown as { __introDone?: boolean };
          if (cancelled || w.__introDone) return;
          w.__introDone = true;
          document.documentElement.classList.remove("is-loading");
          window.dispatchEvent(new Event(INTRO_EVENT));
        }, 0);
      };

      const tl = gsap.timeline({ onComplete: () => setDone(true) });
      tl.to(counter, {
        v: 100,
        duration: 1.8,
        ease: "power3.inOut",
        onUpdate: () => {
          if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
        },
      })
        .to(".pl-bar", { scaleX: 1, duration: 1.8, ease: "power3.inOut" }, 0)
        .from(".pl-name span", { yPercent: 110, stagger: 0.04, duration: 0.9, ease: "expo.out" }, 0.3)
        .to(".pl-name span", { yPercent: -110, stagger: 0.02, duration: 0.6, ease: "expo.in" }, "+=0.15")
        .to(".pl-meta", { opacity: 0, duration: 0.3 }, "<")
        .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, "-=0.15")
        .call(finish, [], "-=0.6");

      // Wait for fonts so the name doesn't reflow mid-animation.
      tl.pause();
      const start = () => {
        if (!cancelled) tl.play();
      };
      if (document.fonts) document.fonts.ready.then(start);
      else start();
      return () => {
        cancelled = true;
      };
    },
    { scope: root }
  );

  if (done) return null;
  return (
    <div
      ref={root}
      style={{ clipPath: "inset(0 0 0% 0)" }}
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-ink px-6 py-8 text-white md:px-12"
    >
      <div className="pl-meta flex justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
        <span>Portfolio · 2026</span>
        <span>{profile.location}</span>
      </div>
      <div className="pl-name flex overflow-hidden font-display text-[18vw] leading-[0.85] md:text-[12vw]">
        {profile.name.toUpperCase().split("").map((c, i) => (
          <span key={i} className="inline-block whitespace-pre">
            {c}
          </span>
        ))}
      </div>
      <div className="pl-meta">
        <div className="mb-3 flex items-end justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Loading experience</span>
          <span ref={count} className="font-display text-6xl tabular-nums md:text-8xl">
            000
          </span>
        </div>
        <div className="pl-bar h-px w-full origin-left scale-x-0 bg-white" />
      </div>
    </div>
  );
}
