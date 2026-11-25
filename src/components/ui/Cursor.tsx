"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Dot + ring cursor. Elements with data-cursor grow it; data-cursor="View" shows a label. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, opacity: 0 });

    let current: Element | null = null;
    let px = -100, py = -100;
    const update = (target: Element | null) => {
      const t = target?.closest("[data-cursor], a, button") ?? null;
      if (t === current) return;
      current = t;
      const text = t?.getAttribute("data-cursor") ?? "";
      label.current!.textContent = text && text !== "true" ? text : "";
      gsap.to(ring.current, {
        scale: text && text !== "true" ? 2.6 : t ? 1.7 : 1,
        backgroundColor: text && text !== "true" ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
        borderColor: "rgba(255,255,255,1)",
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(dot.current, { scale: t ? 0 : 1, duration: 0.25 });
    };
    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3, overwrite: "auto" });
      dx(px); dy(py); rx(px); ry(py);
      update(e.target as Element);
    };
    // Content moves under a still cursor while scrolling, so re-check what it is over.
    const onScroll = () => update(document.elementFromPoint(px, py));
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 });
    window.addEventListener("pointermove", move);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  });

  return (
    <>
      <div ref={ring} className="cursor-el pointer-events-none fixed left-0 top-0 z-[100] flex h-10 w-10 items-center justify-center rounded-full border border-white mix-blend-difference">
        <span ref={label} className="text-[5px] font-semibold uppercase tracking-[0.15em] text-black" />
      </div>
      <div ref={dot} className="cursor-el pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference" />
    </>
  );
}
