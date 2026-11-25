"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { services } from "@/data/career";
import Magnetic from "@/components/ui/Magnetic";

const ServiceObjects = dynamic(() => import("@/components/canvas/ServiceObjects"), { ssr: false });

const labels: Record<string, string> = { frontend: "Frontend", backend: "Backend", payments: "Payments", web3: "Web3" };

/**
 * "What I do": a tall section whose inner frame sticks to the screen. Scrolling walks through
 * the four services while a set of solid 3D objects swaps in for each one.
 */
export default function Services() {
  const root = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);

  // Scroll position picks the active service.
  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          // Each service owns a quarter of the scroll distance.
          const next = Math.min(Math.floor(self.progress * 4), 3);
          if (next !== idxRef.current) {
            idxRef.current = next;
            setIdx(next);
          }
        },
      });
      gsap.fromTo(".svc-progress", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true } });

      // Entrance: the big titles rise in letter by letter.
      const split = SplitText.create(".svc-title-text", { type: "chars", mask: "chars" });
      gsap.from(split.chars, { yPercent: 110, stagger: 0.015, duration: 1, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
      gsap.from(".svc-fade", { y: 30, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 60%", once: true } });
      return () => {
        st.kill();
        split.revert();
      };
    },
    { scope: root }
  );

  // Each time the active service changes: slide the titles, scramble the number, bring in the copy.
  useGSAP(
    () => {
      gsap.to(".svc-title", { x: (j: number) => (j === idx ? 28 : 0), duration: 0.8, ease: "expo.out" });
      gsap.to(".svc-dot", { scale: (j: number) => (j === idx ? 1 : 0), duration: 0.5, ease: "back.out(2)" });
      gsap.to(".svc-num", { duration: 0.7, scrambleText: { text: String(idx + 1).padStart(2, "0"), chars: "0123456789", speed: 0.6 } });
      gsap.fromTo(".svc-copy > *", { y: 26, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.8, ease: "power3.out" });
      gsap.fromTo(".svc-tag", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.05, duration: 0.6, delay: 0.15, ease: "back.out(2)" });
    },
    { scope: root, dependencies: [idx] }
  );

  const goTo = (j: number) => {
    const el = root.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + ((j + 0.5) / 4) * (el.offsetHeight - window.innerHeight);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const s = services[idx];

  return (
    <section ref={root} id="services" className="relative h-[420svh] bg-paper">
      <div className="sticky top-0 flex h-svh flex-col overflow-clip px-6 pb-8 pt-24 lg:grid lg:grid-cols-12 lg:gap-10 lg:px-16 lg:pb-14 lg:pt-28">
        {/* Left: index of services. */}
        <div className="flex flex-col lg:col-span-5 lg:justify-between">
          <div className="svc-fade flex items-center justify-between">
            <span className="eyebrow">What I do</span>
            <span className="font-mono text-xs text-ink/50">
              <span className="svc-num text-ink">01</span> / {String(services.length).padStart(2, "0")}
            </span>
          </div>

          <ul className="mt-5 lg:mt-0">
            {services.map((sv, j) => (
              <li key={sv.id}>
                <button
                  onClick={() => goTo(j)}
                  className={`svc-title flex items-center gap-3 font-display text-[12vw] leading-[0.92] transition-colors duration-500 lg:text-[6.4vw] ${j === idx ? "text-ink" : "text-ink/15 hover:text-ink/40"}`}
                  data-cursor="true"
                >
                  <span aria-hidden className="svc-dot inline-block h-2.5 w-2.5 shrink-0 scale-0 rounded-full bg-ink lg:h-3.5 lg:w-3.5" />
                  <span className="svc-title-text">{labels[sv.id]}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="svc-fade hidden lg:block">
            <Magnetic>
              <a href="#contact" className="btn btn-primary h-[64px] w-[230px]" data-cursor="true">
                Work with me
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Right: the 3D objects for the active service, with its details below. */}
        <div className="relative mt-2 flex min-h-0 flex-1 flex-col lg:col-span-7 lg:mt-0">
          <span aria-hidden className="absolute left-0 top-0 hidden h-full w-px bg-line lg:block" />
          <span aria-hidden className="svc-progress absolute left-0 top-0 hidden h-full w-px origin-top bg-ink lg:block" />
          <div className="relative min-h-0 flex-1">
            <ServiceObjects index={idx} className="absolute inset-0 lg:bottom-40 lg:left-10" />
          </div>

          <div className="pt-2 lg:absolute lg:bottom-0 lg:left-14 lg:right-0 lg:pt-0">
            <div key={s.id} className="svc-copy max-w-md">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/45">{s.title}</p>
              <p className="mt-3 text-base leading-relaxed text-ink/80 lg:text-lg">{s.desc}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <li key={t} className="svc-tag rounded-full border border-ink/20 bg-paper/80 px-3 py-1 text-[11px] text-ink/75 backdrop-blur-sm">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
