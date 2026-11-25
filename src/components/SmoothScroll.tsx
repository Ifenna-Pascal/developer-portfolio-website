"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { setLenis, scrollToHash } from "@/lib/lenis";

export default function SmoothScroll() {
  useEffect(() => {
    // Hash links anywhere on the page scroll smoothly.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a || a.getAttribute("href") === "#") return;
      e.preventDefault();
      scrollToHash(a.getAttribute("href")!);
    };
    document.addEventListener("click", onClick);

    // Content can change height after load (fonts, images, filtered project lists). When it does,
    // recompute every ScrollTrigger so pinned and scroll-driven sections stay in sync.
    let lastH = document.body.scrollHeight;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight;
      if (Math.abs(h - lastH) < 2) return;
      lastH = h;
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(document.body);
    const cleanupRefresh = () => {
      ro.disconnect();
      clearTimeout(timer);
    };

    if (prefersReducedMotion())
      return () => {
        document.removeEventListener("click", onClick);
        cleanupRefresh();
      };

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9 });
    setLenis(lenis);
    if (process.env.NODE_ENV !== "production") (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      document.removeEventListener("click", onClick);
      cleanupRefresh();
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
