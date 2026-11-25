"use client";
import { useState } from "react";

export default function InstallBar({ install }: { install: { label: string; cmd: string }[] }) {
  const [i, setI] = useState(0);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(install[i].cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };
  return (
    <div>
      <div className="mb-1.5 flex gap-1" role="tablist" aria-label="Install method">
        {install.map((m, k) => (
          <button
            key={m.label}
            role="tab"
            aria-selected={k === i}
            onClick={() => setI(k)}
            className={`rounded-md border px-2.5 py-0.5 font-mono text-[11px] transition ${k === i ? "border-white bg-white text-ink" : "border-white/10 text-white/45 hover:text-white"}`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
        <span className="font-mono text-[12px] text-white/45">$</span>
        <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-[12px] text-white/85">{install[i].cmd}</code>
        <button onClick={copy} className="rounded-md bg-white px-2.5 py-1 text-[11px] font-semibold text-ink hover:bg-white/85">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
