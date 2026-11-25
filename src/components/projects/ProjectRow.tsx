"use client";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { CliProject, MobileProject, Project, WebProject } from "@/data/projects";
import { profile } from "@/data/site";
import Terminal from "./Terminal";
import InstallBar from "./InstallBar";

const GLImage = dynamic(() => import("@/components/canvas/GLImage"), { ssr: false });

const Sample = () => (
  <span className="rounded-full border border-ink/25 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink/60">Sample</span>
);

const Arrow = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 transition-transform duration-500 group-hover/link:-translate-y-1 group-hover/link:translate-x-1 lg:h-8 lg:w-8" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

function TextCell({ p }: { p: Project }) {
  const href = p.kind === "web" && p.live ? p.live : `/projects/${p.slug}`;
  const external = p.kind === "web" && !!p.live;
  return (
    <div className="flex h-full flex-col py-8 lg:h-[450px] lg:justify-between lg:px-8">
      <div className="flex flex-col">
        <div className="row-anim flex items-start justify-between gap-4">
          <h3 className={`text-[20px] font-bold text-ink lg:text-[24px] ${p.kind === "cli" ? "font-mono" : "capitalize"}`}>{p.name}</h3>
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="group/link shrink-0 text-ink"
            aria-label={external ? `Visit ${p.name}` : `Open ${p.name}`}
            data-cursor="true"
          >
            <Arrow />
          </a>
        </div>
        <div className="row-anim mt-2 flex flex-wrap items-center gap-2">
          {p.kind === "web" && p.status && <span className="text-xs text-ink/50">● {p.status}</span>}
          {p.kind === "cli" && <span className="font-mono text-xs text-ink/50">{p.language} · {p.version}</span>}
          {p.placeholder && <Sample />}
        </div>
        <p className="row-anim pb-5 pt-4 leading-relaxed text-ink/75 lg:pt-6">{p.tagline}</p>
        {p.kind === "web" && p.result && <p className="row-anim text-sm font-semibold text-ink">↗ {p.result}</p>}
        {p.kind === "web" && p.why && (
          <p className="row-anim text-sm text-ink/60">
            <span className="text-ink">Why I built it: </span>
            {p.why}
          </p>
        )}
        {p.kind === "cli" && (
          <div className="row-anim rounded-xl bg-ink p-3">
            <InstallBar install={p.install} />
          </div>
        )}
        <ul className="row-anim mt-5 flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <li key={t} className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-ink/65">
              {t}
            </li>
          ))}
        </ul>
      </div>
      <p className="row-anim mt-6 text-[14px] uppercase tracking-wide text-ink/80">
        {p.kind === "web" ? p.type : p.kind === "cli" ? "CLI tool" : p.type}
        {p.kind === "web" && p.company ? <span className="text-ink/40"> · {p.company}</span> : null}
      </p>
    </div>
  );
}

function Media({ p }: { p: Project }) {
  if (p.kind === "cli") return <CliMedia p={p} />;
  if (p.kind === "mobile") return <MobileMedia p={p} />;
  return <WebMedia p={p} />;
}

function WebMedia({ p }: { p: WebProject }) {
  return (
    <Link href={`/projects/${p.slug}`} data-cursor="View" aria-label={`Open ${p.name} case study`} className="block">
      <GLImage src={p.image} focus={p.focus} alt={`${p.name} screenshot`} sizes="(min-width: 1024px) 38vw, 100vw" className="h-[260px] w-full rounded-[8px] lg:h-[394px]" />
    </Link>
  );
}

function CliMedia({ p }: { p: CliProject }) {
  return (
    <div className="h-[260px] lg:h-[394px]">
      <Terminal title={`~/dev — ${p.name}`} lines={p.demo} minHeight={0} className="h-full rounded-[8px] [&>pre]:h-[calc(100%-38px)]" />
    </div>
  );
}

function MobileMedia({ p }: { p: MobileProject }) {
  // Up to three phones fanned out, the middle one in front.
  const shots = p.screens.slice(0, 3);
  const pose = shots.length === 1 ? ["z-10"] : ["-rotate-[7deg] translate-x-[38%] translate-y-[4%]", "z-10", "rotate-[7deg] -translate-x-[38%] translate-y-[4%]"];
  return (
    <Link href={`/projects/${p.slug}`} data-cursor="View" aria-label={`Open ${p.name}`} className="group/phones flex h-[260px] items-center justify-center rounded-[8px] bg-ink/[0.04] lg:h-[394px]">
      {shots.map((src, i) => (
        <div
          key={src}
          className={`phone relative aspect-[390/844] h-[86%] shrink-0 overflow-hidden rounded-[1.6rem] border-[5px] border-ink bg-ink shadow-[0_24px_40px_-20px_rgba(0,0,0,0.45)] transition-transform duration-700 ${pose[i] ?? ""} ${i !== 1 ? "group-hover/phones:translate-x-0 group-hover/phones:rotate-0" : "group-hover/phones:-translate-y-2"}`}
        >
          <Image src={src} alt={`${p.name} screen ${i + 1}`} fill sizes="200px" className="object-cover" />
        </div>
      ))}
    </Link>
  );
}

/**
 * One row of the original projects "table": a 2-col gutter, a 3-col text cell and a
 * 3-col media cell, with text and media swapping sides on alternate rows.
 */
export default function ProjectRow({ p, index, first }: { p: Project; index: number; first: boolean }) {
  const even = index % 2 === 0;
  return (
    <div className="proj-row group/row relative grid grid-cols-1 lg:grid-cols-8" data-flip-id={p.slug}>
      {/* Animated table rules. */}
      {first && <span aria-hidden className="row-rule-top absolute inset-x-0 top-0 hidden h-px origin-left bg-line lg:block" />}

      <div className="order-first hidden flex-col items-center justify-between py-12 lg:col-span-2 lg:flex">
        {first ? (
          <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-primary mt-4 h-[70px] w-[250px] max-w-full" data-cursor="true">
            Download resume
          </a>
        ) : (
          <span />
        )}
        <span className="row-num font-display text-[120px] leading-none text-ink/[0.07] transition-colors duration-700 group-hover/row:text-ink">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <div className={`relative order-last lg:col-span-3 ${even ? "lg:order-2" : "lg:order-3"}`}>
        <span aria-hidden className="row-rule-l absolute left-0 top-0 hidden h-full w-px origin-top bg-line lg:block" />
        <span aria-hidden className="row-rule-b absolute bottom-0 left-0 h-px w-full origin-left bg-line" />
        <TextCell p={p} />
      </div>

      <div className={`relative pt-8 lg:col-span-3 lg:p-8 ${even ? "lg:order-3" : "lg:order-2"}`}>
        <span aria-hidden className="row-rule-l absolute left-0 top-0 hidden h-full w-px origin-top bg-line lg:block" />
        <span aria-hidden className="row-rule-b absolute bottom-0 left-0 hidden h-px w-full origin-left bg-line lg:block" />
        <div className="row-media will-change-transform">
          <Media p={p} />
        </div>
      </div>
    </div>
  );
}
