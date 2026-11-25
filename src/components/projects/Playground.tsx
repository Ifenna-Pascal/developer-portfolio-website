"use client";
import { useEffect, useRef, useState } from "react";
import type { CliProject, TermLine } from "@/data/projects";

const colors: Record<TermLine["t"], string> = {
  cmd: "text-white",
  out: "text-white/70",
  ok: "text-emerald-400",
  warn: "text-amber-300",
  dim: "text-white/40",
  notify: "text-sky-300",
};

/** A terminal visitors can type into. Responds with the scripted demo output. */
export default function Playground({ p }: { p: CliProject }) {
  const [lines, setLines] = useState<TermLine[]>([
    { t: "dim", s: `${p.name} ${p.version} playground · simulated, nothing is installed` },
    { t: "dim", s: `Type "help" to see commands, or try: ${p.demo[0].s}` },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines]);

  // Map each demo command to the output lines that follow it.
  const responses = new Map<string, TermLine[]>();
  p.demo.forEach((l, i) => {
    if (l.t !== "cmd") return;
    const out: TermLine[] = [];
    for (let j = i + 1; j < p.demo.length && p.demo[j].t !== "cmd"; j++) {
      const d = p.demo[j];
      // Desktop notifications show up as a line here, since the playground has no toast.
      out.push(d.t === "notify" ? { t: "notify", s: `🔔 ${d.title}: ${d.s}` } : d);
    }
    responses.set(l.s.trim(), out);
  });

  const run = (raw: string) => {
    const cmd = raw.trim();
    const echo: TermLine = { t: "cmd", s: cmd };
    if (!cmd) return setLines((l) => [...l, echo]);
    setHistory((h) => [cmd, ...h]);
    setHi(-1);
    if (cmd === "clear") return setLines([]);
    let out: TermLine[];
    if (cmd === "help" || cmd === `${p.name} --help` || cmd === `${p.name} help`) {
      out = [{ t: "dim", s: "Commands:" }, ...p.commands.map((c) => ({ t: "out" as const, s: `  ${c.cmd.padEnd(38)} ${c.desc}` })), { t: "dim", s: "  clear                                  Clear the screen" }];
    } else if (cmd === `${p.name} --version` || cmd === `${p.name} -v`) {
      out = [{ t: "out", s: p.version }];
    } else if (responses.has(cmd)) {
      out = responses.get(cmd)!;
    } else if (cmd.split(" ")[0] === p.name || cmd.startsWith("npx") || cmd.startsWith("cd")) {
      const first = p.demo.find((d) => d.t === "cmd")!.s;
      out = [{ t: "warn", s: `This demo only knows its scripted commands. Try: ${first}` }];
    } else {
      out = [{ t: "warn", s: `command not found: ${cmd.split(" ")[0]} · type "help"` }];
    }
    setLines((l) => [...l, echo, ...out]);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0d]" onClick={() => input.current?.focus()}>
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="flex-1 text-center font-mono text-[11px] text-white/40">playground — {p.name}</span>
      </div>
      <div ref={scroller} className="h-[380px] overflow-y-auto px-4 py-4 font-mono text-[13px] leading-[1.7]" data-lenis-prevent>
        {lines.map((l, i) => (
          <div key={i} className={`whitespace-pre-wrap ${colors[l.t]}`}>
            {l.t === "cmd" && <span className="text-white/45">❯ </span>}
            {l.s}
          </div>
        ))}
        <form
          className="flex items-center"
          onSubmit={(e) => {
            e.preventDefault();
            run(value);
            setValue("");
          }}
        >
          <span className="text-white/45">❯&nbsp;</span>
          <input
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" && history.length) {
                e.preventDefault();
                const n = Math.min(hi + 1, history.length - 1);
                setHi(n);
                setValue(history[n]);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const n = hi - 1;
                setHi(n);
                setValue(n >= 0 ? history[n] : "");
              }
            }}
            aria-label={`Type a ${p.name} command`}
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent text-white caret-white outline-none"
          />
        </form>
      </div>
    </div>
  );
}
