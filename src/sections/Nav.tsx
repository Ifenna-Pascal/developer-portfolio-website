"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { getLenis, scrollToHash } from "@/lib/lenis";
import { onIntro } from "@/lib/intro";
import { navLinks, profile, socials } from "@/data/site";
import Magnetic from "@/components/ui/Magnetic";

export default function Nav() {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    (_ctx, contextSafe) => {
      gsap.set(".nav-bar", { yPercent: -120 });
      const off = onIntro(contextSafe!(() => gsap.to(".nav-bar", { yPercent: 0, duration: 1, ease: "expo.out", delay: 0.4 })));

      tl.current = gsap
        .timeline({ paused: true })
        .set(".nav-menu", { visibility: "visible" })
        .fromTo(".nav-menu", { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.inOut" })
        .from(".nav-inner", { yPercent: 110, stagger: 0.05, duration: 0.8, ease: "expo.out" }, "-=0.35")
        .from(".nav-foot", { opacity: 0, y: 20, duration: 0.6 }, "-=0.5");

      // Hide the bar while scrolling down, show it when scrolling up.
      let last = 0;
      const onScroll = () => {
        const y = window.scrollY;
        if (!tl.current?.isActive() && !tl.current?.progress()) {
          gsap.to(".nav-bar", { yPercent: y > last && y > 200 ? -120 : 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
        }
        last = y;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        off();
        window.removeEventListener("scroll", onScroll);
      };
    },
    { scope: root }
  );

  const toggle = (next = !open) => {
    setOpen(next);
    const lenis = getLenis();
    if (next) {
      lenis?.stop();
      tl.current?.timeScale(1).play();
    } else {
      lenis?.start();
      tl.current?.timeScale(1.6).reverse();
    }
  };

  const go = (href: string) => {
    toggle(false);
    setTimeout(() => scrollToHash(href), 450);
  };

  return (
    <div ref={root}>
      <header className="nav-bar fixed inset-x-0 top-0 z-[70] flex items-center justify-between px-6 py-5 text-white mix-blend-difference md:px-12">
        <a href="#home" className="font-display text-2xl tracking-wide text-white" aria-label="Back to top">
          {profile.firstName[0]}
          {profile.lastName[0]}
          <span>.</span>
        </a>
        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-2 rounded-full border border-white/40 px-3 py-1.5 text-xs text-white md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Available for work
          </span>
          <Magnetic>
            <button
              onClick={() => toggle()}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex h-11 items-center gap-3 rounded-full border border-white/60 px-5 text-sm font-semibold text-white transition hover:border-white"
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span className="relative block h-2.5 w-5">
                <span className={`absolute left-0 h-px w-full bg-white transition-all duration-500 ${open ? "top-1/2 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px w-full bg-white transition-all duration-500 ${open ? "top-1/2 -rotate-45" : "bottom-0"}`} />
              </span>
            </button>
          </Magnetic>
        </div>
      </header>

      <nav
        id="site-menu"
        aria-hidden={!open}
        className="nav-menu invisible fixed inset-0 z-[60] flex flex-col justify-between bg-ink px-6 pb-8 pt-28 md:px-12"
      >
        <ul className="grid gap-1 md:grid-cols-2 md:gap-x-16">
          {navLinks.map((l, i) => (
            <li key={l.href} className="nav-link overflow-hidden border-b border-white/10">
              <button
                onClick={() => go(l.href)}
                tabIndex={open ? 0 : -1}
                className="group flex w-full items-baseline gap-4 py-2 text-left font-display text-5xl text-white/80 transition hover:text-white md:text-7xl"
              >
                <span className="nav-inner inline-flex items-baseline gap-4">
                  <span className="font-mono text-xs text-white/40">0{i + 1}</span>
                  <span className="transition-transform duration-500 group-hover:translate-x-3">{l.label}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="nav-foot flex flex-col gap-4 text-sm text-white/60 md:flex-row md:items-end md:justify-between">
          <a href={`mailto:${profile.email}`} tabIndex={open ? 0 : -1} className="text-lg text-white underline-offset-4 hover:underline">
            {profile.email}
          </a>
          <div className="flex gap-6">
            {socials.slice(1).map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} className="hover:text-white">
                {s.label} ↗
              </a>
            ))}
            <a href={profile.resume} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} className="hover:text-white">
              Resume ↗
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
