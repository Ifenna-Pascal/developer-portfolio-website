"use client";
import { useRef, useState } from "react";
import { gsap, Flip, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { categories, projects, type Category } from "@/data/projects";
import ProjectRow from "@/components/projects/ProjectRow";
import Terminal from "@/components/projects/Terminal";
import dynamic from "next/dynamic";

const CategoryEmblem = dynamic(() => import("@/components/canvas/CategoryEmblem"), { ssr: false });

type Filter = "all" | Category;

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="grid items-center gap-10 border-y border-line py-12 lg:grid-cols-8">
      <div className="lg:col-span-2" />
      <div className="lg:col-span-3 lg:px-8">
        <p className="eyebrow mb-4">In the workshop</p>
        <h3 className="font-display text-6xl leading-none text-ink">
          {label} projects
          <br />
          coming soon.
        </h3>
        <p className="mt-5 max-w-md text-sm text-ink/60">I&apos;m building in public. New {label.toLowerCase()} work lands here first.</p>
      </div>
      <div className="lg:col-span-3 lg:px-8">
        <Terminal
          title="~/workshop"
          minHeight={150}
          lines={[
            { t: "cmd", s: `ls ./${label.toLowerCase().replace(/\s+/g, "-")}` },
            { t: "dim", s: "  (empty)" },
            { t: "cmd", s: 'git commit -m "building in public… soon"' },
            { t: "ok", s: "✔ stay tuned" },
          ]}
        />
      </div>
    </div>
  );
}

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const rowTimelines = useRef(new WeakMap<HTMLElement, gsap.core.Timeline>());
  const [filter, setFilter] = useState<Filter>("all");

  const visible = projects.filter((p) => filter === "all" || p.categories.includes(filter));
  const counts = Object.fromEntries(
    categories.map((c) => [c.id, c.id === "all" ? projects.length : projects.filter((p) => p.categories.includes(c.id as Category)).length])
  );

  // Heading + tabs entrance.
  useGSAP(
    () => {
      // Title letters flip up in 3D, one after another.
      const split = SplitText.create(".proj-title", { type: "chars" });
      gsap.from(split.chars, {
        rotationX: -95,
        opacity: 0,
        transformOrigin: "50% 100% -30px",
        transformPerspective: 700,
        stagger: 0.035,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".proj-title", start: "top 85%", once: true },
      });
      // Then they ripple gently as the section scrolls past.
      gsap.to(split.chars, {
        yPercent: (i) => (i % 2 ? -12 : 12),
        ease: "none",
        scrollTrigger: { trigger: ".proj-title", start: "top 40%", end: "bottom top", scrub: true },
      });
      gsap.from(".proj-emblem", { scale: 0.4, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".proj-title", start: "top 85%", once: true } });
      gsap.from(".proj-tabs > button", {
        y: 16,
        opacity: 0,
        stagger: 0.04,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: ".proj-tabs", start: "top 90%", once: true },
      });
      return () => split.revert();
    },
    { scope: root }
  );

  // Each row draws its table rules and lifts its content in the first time it's seen.
  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>(".proj-row");
      rows.forEach((row) => {
        if (row.dataset.animated) return;
        row.dataset.animated = "1";
        const tl = gsap.timeline({ paused: true });
        rowTimelines.current.set(row, tl);
        tl.from(row.querySelectorAll(".row-rule-top, .row-rule-b"), { scaleX: 0, duration: 1.2, ease: "expo.inOut" }, 0)
          .from(row.querySelectorAll(".row-rule-l"), { scaleY: 0, duration: 1.2, ease: "expo.inOut" }, 0.1)
          .from(row.querySelectorAll(".row-anim"), { y: 30, opacity: 0, stagger: 0.06, duration: 0.9, ease: "power3.out" }, 0.3)
          .from(row.querySelector(".row-num"), { yPercent: 60, opacity: 0, duration: 1.2, ease: "expo.out" }, 0.3);
        ScrollTrigger.create({ trigger: row, start: "top 80%", once: true, onEnter: () => tl.play() });
        // Media tilts in 3D toward the cursor.
        const media = row.querySelector<HTMLElement>(".row-media");
        if (media && window.matchMedia("(hover: hover)").matches) {
          const rx = gsap.quickTo(media, "rotationX", { duration: 0.6, ease: "power3" });
          const ry = gsap.quickTo(media, "rotationY", { duration: 0.6, ease: "power3" });
          gsap.set(media, { transformPerspective: 1000 });
          media.addEventListener("pointermove", (e) => {
            const r = media.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 10);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
          });
          media.addEventListener("pointerleave", () => {
            rx(0);
            ry(0);
          });
        }
        // Gutter number drifts against the scroll.
        gsap.to(row.querySelector(".row-num"), {
          yPercent: -40,
          ease: "none",
          scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root }
  );

  // Flip the table when the filter changes.
  useGSAP(
    () => {
      if (!flipState.current) return;
      Flip.from(flipState.current, {
        targets: ".proj-item",
        duration: 0.8,
        ease: "power3.inOut",
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.2 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.35 }),
        onComplete: () => {
          // Rows that were hidden when first scrolled past still need their entrance played.
          gsap.utils.toArray<HTMLElement>(".proj-row", root.current).forEach((r) => {
            if (r.offsetParent) rowTimelines.current.get(r)?.play();
          });
          ScrollTrigger.refresh();
        },
      });
      flipState.current = null;
    },
    { scope: root, dependencies: [filter] }
  );

  // Slide the black pill under the active tab and count the visible projects.
  const counter = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const place = (instant: boolean) => {
        const btn = root.current!.querySelector<HTMLElement>(`[data-tab="${filter}"]`);
        if (!btn) return;
        gsap.to(".tab-pill", { x: btn.offsetLeft, y: btn.offsetTop, width: btn.offsetWidth, height: btn.offsetHeight, duration: instant ? 0 : 0.6, ease: "expo.out" });
      };
      place(!counter.current?.dataset.ready);
      const o = { v: Number(counter.current?.textContent ?? 0) };
      gsap.to(o, { v: visible.length, duration: 0.8, ease: "power2.out", onUpdate: () => { if (counter.current) counter.current.textContent = String(Math.round(o.v)).padStart(2, "0"); } });
      if (counter.current) counter.current.dataset.ready = "1";
      const onResize = () => place(true);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { scope: root, dependencies: [filter] }
  );

  const choose = (f: Filter) => {
    if (f === filter) return;
    flipState.current = Flip.getState(root.current!.querySelectorAll(".proj-item"));
    setFilter(f);
  };

  const active = categories.find((c) => c.id === filter)!;

  return (
    <section ref={root} id="projects" className="relative overflow-clip bg-paper px-6 pb-12 pt-24 md:px-16 lg:pb-24">
      <div className="flex items-end justify-between gap-6 border-b border-line pb-3 lg:border-b-0 lg:pb-10">
        <h2 className="proj-title pt-4 font-display text-[40px] tracking-wider text-ink lg:text-[120px] lg:leading-[120px]">MY PAST PROJECTS</h2>
        <div className="hidden items-center gap-4 lg:flex">
          <div className="text-right">
            <span ref={counter} className="block font-display text-6xl leading-none text-ink">00</span>
            <span className="eyebrow">{active.label === "All" ? "Projects" : active.label}</span>
          </div>
          <CategoryEmblem kind={filter} className="proj-emblem h-[150px] w-[150px]" />
        </div>
      </div>

      <div className="mb-8 mt-6 flex flex-col gap-4 lg:mb-10 lg:mt-0 lg:flex-row lg:items-center lg:justify-between">
        <div className="proj-tabs relative flex flex-wrap gap-2" role="tablist" aria-label="Project categories">
          <span aria-hidden className="tab-pill pointer-events-none absolute left-0 top-0 rounded-full bg-ink" />
          {categories.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={filter === c.id}
              onClick={() => choose(c.id)}
              data-cursor="true"
              data-tab={c.id}
              className={`relative flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${
                filter === c.id ? "border-ink text-paper" : "border-line text-ink/70 hover:border-ink hover:text-ink"
              }`}
            >
              {c.label}
              <span className={`font-mono text-[10px] ${filter === c.id ? "text-paper/70" : "text-ink/35"}`}>{counts[c.id]}</span>
            </button>
          ))}
        </div>
        <p className="text-sm text-ink/55">{active.blurb}</p>
      </div>

      <div className="relative">
        {projects.map((p) => {
          const k = visible.indexOf(p);
          return (
            <div key={p.slug} className="proj-item" data-flip-id={p.slug} style={{ display: k === -1 ? "none" : undefined }}>
              <ProjectRow p={p} index={Math.max(k, 0)} first={k === 0} />
            </div>
          );
        })}
      </div>
      {visible.length === 0 && <ComingSoon label={active.label} />}
    </section>
  );
}
