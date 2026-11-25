"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Hairline that draws itself in when scrolled into view. */
export default function DrawLine({ className = "", vertical = false }: { className?: string; vertical?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, {
      [vertical ? "scaleY" : "scaleX"]: 0,
      transformOrigin: vertical ? "top" : "left",
      duration: 1.4,
      ease: "expo.inOut",
      scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
    });
  });
  return <div ref={ref} aria-hidden className={`${vertical ? "w-px" : "h-px w-full"} bg-current opacity-20 ${className}`} />;
}
