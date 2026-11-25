"use client";
import { useRef, useState } from "react";
import { gsap, Draggable, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { stack, type StackGroup } from "@/data/career";

const groups: ("All" | StackGroup)[] = ["All", "Frontend", "Backend", "Data", "DevOps", "Web3", "Tools"];

export default function Stack() {
  const root = useRef<HTMLElement>(null);
  const arena = useRef<HTMLDivElement>(null);
  const [group, setGroup] = useState<"All" | StackGroup>("All");
  const [hover, setHover] = useState<number | null>(null);
  const groupRef = useRef<"All" | StackGroup>("All");
  const layoutRef = useRef<(g: "All" | StackGroup, instant?: boolean) => void>(() => {});

  useGSAP(
    () => {
      const box = arena.current!;
      const tiles = gsap.utils.toArray<HTMLElement>(".stack-tile", box);
      const desktop = window.matchMedia("(min-width: 768px)").matches;

      // Scattered "pile" positions, or a tidy cluster for the selected group.
      const layout = (g: "All" | StackGroup, instant = false) => {
        const W = box.clientWidth;
        const H = box.clientHeight;
        const chosen = tiles.filter((_, i) => g === "All" || stack[i].group === g);
        const cols = Math.max(1, Math.ceil(Math.sqrt(chosen.length * 1.6)));
        tiles.forEach((t, i) => {
          const w = t.offsetWidth;
          const h = t.offsetHeight;
          let x: number, y: number, rot: number, alpha: number;
          const k = chosen.indexOf(t);
          if (g === "All") {
            // Seeded pile along the floor.
            const r1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
            const r2 = Math.abs(Math.sin(i * 78.233) * 12543.123) % 1;
            x = r1 * (W - w);
            y = H - h - r2 * H * 0.62;
            rot = (r1 - 0.5) * 30;
            alpha = 1;
          } else if (k >= 0) {
            const gap = 12;
            const row = Math.floor(k / cols);
            const col = k % cols;
            const rowCount = Math.min(cols, chosen.length - row * cols);
            const totalW = rowCount * 150 + (rowCount - 1) * gap;
            x = W / 2 - totalW / 2 + col * (150 + gap) + (150 - w) / 2;
            y = H / 2 - (Math.ceil(chosen.length / cols) * (h + gap)) / 2 + row * (h + gap);
            rot = 0;
            alpha = 1;
          } else {
            const side = i % 2 ? 1 : -1;
            x = side > 0 ? W - w - (i % 3) * 30 : (i % 3) * 30;
            y = H - h - ((i * 37) % (H * 0.5));
            rot = side * 18;
            alpha = 0.22;
          }
          gsap.to(t, { x, y, rotation: rot, opacity: alpha, duration: instant ? 0 : 1, ease: instant ? "none" : "elastic.out(1, 0.75)", delay: instant ? 0 : k >= 0 ? k * 0.02 : 0 });
        });
      };
      layoutRef.current = layout;

      if (!desktop) return; // Mobile uses the plain wrapped layout below.

      gsap.set(tiles, { position: "absolute", left: 0, top: 0 });
      layout("All", true);
      // Drop the tiles in from above the first time the arena comes into view.
      const ys = tiles.map((t) => gsap.getProperty(t, "y") as number);
      gsap.set(tiles, { y: (i) => ys[i] - box.clientHeight - 200, opacity: 1 });
      ScrollTrigger.create({
        trigger: box,
        start: "top 75%",
        once: true,
        onEnter: () => gsap.to(tiles, { y: (i) => ys[i], duration: 1.4, ease: "bounce.out", stagger: { each: 0.035, from: "random" } }),
      });

      Draggable.create(tiles, {
        bounds: box,
        inertia: true,
        edgeResistance: 0.75,
        onPress() {
          gsap.to(this.target, { scale: 1.12, rotation: 0, zIndex: 5, duration: 0.25 });
        },
        onRelease() {
          gsap.to(this.target, { scale: 1, duration: 0.4 });
        },
      });
      const onResize = () => layout(groupRef.current, true);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { scope: root }
  );

  const pick = (g: "All" | StackGroup) => {
    setGroup(g);
    groupRef.current = g;
    if (window.matchMedia("(min-width: 768px)").matches) layoutRef.current(g);
  };

  return (
    <section
      ref={root}
      id="stack"
      className="relative bg-paper px-6 py-24 md:px-16 md:py-32"
    >
      <span className="eyebrow">The stack</span>
      <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <h2 className="font-display text-7xl leading-[0.85] text-ink md:text-[120px]">
          Tools I<br />
          ship with.
        </h2>
        <p className="max-w-xs text-sm text-ink/55">
          <span className="hidden md:inline">Grab a tile and throw it. </span>Filter to see what I reach for at each layer.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter stack">
        {groups.map((g) => (
          <button
            key={g}
            role="tab"
            aria-selected={group === g}
            onClick={() => pick(g)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${group === g ? "border-ink bg-ink text-paper" : "border-line text-ink/65 hover:border-ink hover:text-ink"}`}
          >
            {g}
          </button>
        ))}
      </div>

      <div
        ref={arena}
        className="relative mt-8 flex flex-wrap gap-2 md:block md:h-[560px] md:overflow-hidden md:border-y md:border-line"
      >
        {stack.map((s, i) => {
          const dim = group !== "All" && s.group !== group;
          return (
            <div
              key={s.name}
              className={`stack-tile group select-none rounded-2xl border border-ink bg-paper px-4 py-3 shadow-[0_2px_0_0_#0b0b0b] transition-opacity md:w-[150px] md:cursor-grab md:active:cursor-grabbing ${dim ? "max-md:opacity-30" : ""}`}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              data-cursor="true"
            >
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink/45">{s.group}</div>
              <div className="mt-1 text-base font-semibold text-ink">{s.name}</div>
              <div className={`overflow-hidden text-[11px] leading-snug text-ink/60 transition-all duration-300 md:max-h-0 md:opacity-0 ${hover === i ? "md:mt-1 md:max-h-12 md:opacity-100" : ""}`}>
                {s.note}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
