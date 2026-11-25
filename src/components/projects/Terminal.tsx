"use client";
import { useEffect, useRef, useState } from "react";
import type { TermLine } from "@/data/projects";

const colors: Record<TermLine["t"], string> = {
  cmd: "text-white",
  out: "text-white/70",
  ok: "text-emerald-400",
  warn: "text-amber-300",
  dim: "text-white/40",
  notify: "text-white/40",
};

type Toast = { id: number; title: string; body: string };

type Props = {
  title: string;
  lines: TermLine[];
  loop?: boolean;
  className?: string;
  minHeight?: number;
};

/** A terminal window that types its script out when scrolled into view. */
export default function Terminal({ title, lines, loop = true, className = "", minHeight = 220 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<{ t: TermLine["t"]; s: string }[]>([]);
  const [typing, setTyping] = useState(false);
  const [run, setRun] = useState(0);
  const visible = useRef(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [toastIn, setToastIn] = useState(false);
  const app = title.split("—").pop()?.trim() ?? "terminal";

  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => {
      const was = visible.current;
      visible.current = e.isIntersecting;
      if (e.isIntersecting && !was) setRun((r) => r + 1);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!run) return;
    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    (async () => {
      setShown([]);
      setToastIn(false);
      if (reduced) {
        setShown(lines.filter((l) => l.t !== "notify"));
        return;
      }
      for (const line of lines) {
        if (cancelled) return;
        if (line.t === "notify") {
          // Pop a desktop-style notification, hold it, then slide it away.
          setToast({ id: Date.now(), title: line.title ?? app, body: line.s });
          await sleep(30);
          setToastIn(true);
          await sleep(2600);
          if (cancelled) return;
          setToastIn(false);
          await sleep(350);
        } else if (line.t === "cmd") {
          setTyping(true);
          setShown((s) => [...s, { t: "cmd", s: "" }]);
          for (let i = 1; i <= line.s.length; i++) {
            if (cancelled) return;
            const part = line.s.slice(0, i);
            setShown((s) => [...s.slice(0, -1), { t: "cmd", s: part }]);
            await sleep(32 + Math.random() * 40);
          }
          setTyping(false);
          await sleep(380);
        } else {
          setShown((s) => [...s, line]);
          await sleep(120);
        }
      }
      await sleep(3200);
      if (!cancelled && loop && visible.current) setRun((r) => r + 1);
    })();
    return () => {
      cancelled = true;
    };
  }, [run, lines, loop, app]);

  return (
    <div ref={ref} className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0d] ${className}`}>
      {toast && (
        <div
          key={toast.id}
          role="status"
          className={`pointer-events-none absolute right-3 top-12 z-10 w-[min(300px,85%)] rounded-2xl border border-black/5 bg-white/95 p-3 text-ink shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-500 ease-[cubic-bezier(0.2,0.9,0.3,1.2)] ${toastIn ? "translate-x-0 opacity-100" : "translate-x-[115%] opacity-0"}`}
        >
          <div className="flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded-[6px] bg-ink font-mono text-[9px] font-bold text-white">&gt;_</span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink/55">{app}</span>
            <span className="ml-auto text-[11px] text-ink/40">now</span>
          </div>
          <p className="mt-1.5 text-[13px] font-semibold leading-snug">{toast.title}</p>
          <p className="text-[12px] leading-snug text-ink/70">{toast.body}</p>
        </div>
      )}
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="flex-1 text-center font-mono text-[11px] text-white/40">{title}</span>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] text-white/50 hover:text-white"
          aria-label="Replay terminal demo"
        >
          ↻
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-[1.7] md:text-[13px]" style={{ minHeight }} aria-label={`Demo of ${title}`}>
        {shown.map((l, i) => (
          <div key={i} className={`whitespace-pre ${colors[l.t]}`}>
            {l.t === "cmd" && <span className="text-white/45">❯ </span>}
            {l.s || " "}
            {l.t === "cmd" && i === shown.length - 1 && typing && <span className="ml-px inline-block h-[1.05em] w-[0.55em] translate-y-[2px] animate-pulse bg-white/80" />}
          </div>
        ))}
      </pre>
    </div>
  );
}
