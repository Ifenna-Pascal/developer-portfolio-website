"use client";
import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** chars | words | lines: what rises out of the mask. */
  by?: "chars" | "words" | "lines";
  /** "fill": words fade from dim to full as you scroll (scrubbed). */
  mode?: "rise" | "fill";
  delay?: number;
  stagger?: number;
  start?: string;
};

export default function Reveal({ children, as: Tag = "div", className, by = "lines", mode = "rise", delay = 0, stagger, start = "top 85%" }: Props) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      if (mode === "fill") {
        const split = SplitText.create(el, { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } }
        );
        return () => split.revert();
      }
      const split = SplitText.create(el, { type: by === "chars" ? "lines,chars" : by === "words" ? "lines,words" : "lines", mask: "lines", autoSplit: true,
        onSplit(self) {
          const targets = by === "chars" ? self.chars : by === "words" ? self.words : self.lines;
          return gsap.from(targets, {
            yPercent: 110,
            duration: 1.1,
            ease: "expo.out",
            delay,
            stagger: stagger ?? (by === "chars" ? 0.025 : by === "words" ? 0.04 : 0.09),
            scrollTrigger: { trigger: el, start, once: true },
          });
        },
      });
      return () => split.revert();
    },
    { scope: ref }
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
