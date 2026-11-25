import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { profile } from "@/data/site";
import Reveal from "@/components/ui/Reveal";
import Playground from "@/components/projects/Playground";
import InstallBar from "@/components/projects/InstallBar";
import Terminal from "@/components/projects/Terminal";
import CaseImage from "@/components/projects/CaseImage";
import Image from "next/image";

function Story({ paragraphs, highlights }: { paragraphs: string[]; highlights?: string[] }) {
  return (
    <>
      {paragraphs.map((t, i) => (
        <p key={i}>{t}</p>
      ))}
      {highlights && (
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2">
          {highlights.map((h) => (
            <li key={h} className="bg-paper px-5 py-4 text-sm text-ink/80">
              <span className="mr-2 font-mono text-ink/35">→</span>
              {h}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = getProject(slug);
  return p ? { title: `${p.name} · ${profile.name}`, description: p.tagline } : {};
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const p = getProject(slug);
  if (!p) notFound();

  const idx = projects.findIndex((x) => x.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <main className="min-h-svh bg-paper px-6 pb-16 pt-8 text-ink md:px-16">
      <header className="flex items-center justify-between">
        <Link href="/#projects" className="font-mono text-xs uppercase tracking-[0.2em] text-ink/60 hover:text-ink" data-cursor="true">
          ← All projects
        </Link>
        <Link href="/" className="font-display text-2xl">
          MI.
        </Link>
      </header>

      <section className="pt-20 md:pt-28">
        <div className="flex flex-wrap items-center gap-3">
          <span className="eyebrow">{p.kind === "cli" ? `CLI · ${p.language}` : p.type}</span>
          {p.placeholder && (
            <span className="rounded-full border border-ink/25 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink/60">Sample project</span>
          )}
        </div>
        <Reveal as="h1" by="chars" start="top 100%" className={`mt-6 ${p.kind === "cli" ? "font-mono text-6xl font-semibold md:text-9xl" : "font-display text-[17vw] leading-[0.82] md:text-[11vw]"}`}>
          {p.name}
        </Reveal>
        <p className="mt-6 max-w-2xl text-lg text-ink/65 md:text-xl">{p.tagline}</p>
      </section>

      {p.kind === "web" && (
        <>
          <dl className="mt-14 grid grid-cols-2 border-y border-line md:grid-cols-4">
            {[
              ["Role", p.role ?? "Solo build"],
              ["Company", p.company ?? "Personal"],
              ["Result", p.result ?? p.status ?? "—"],
              ["Stack", p.tech.slice(0, 3).join(", ")],
            ].map(([k, v], i) => (
              <div key={k} className={`py-6 ${i > 0 ? "md:border-l md:border-line md:pl-6" : ""}`}>
                <dt className="eyebrow mb-2">{k}</dt>
                <dd className="text-sm text-ink/85">{v}</dd>
              </div>
            ))}
          </dl>
          <CaseImage src={p.image} alt={`${p.name} screenshot`} />
          <div className="mt-16 grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="eyebrow">The story</p>
            </div>
            <div className="space-y-6 text-base leading-relaxed text-ink/70 md:col-span-8 md:text-lg">
              {p.description ? (
                <Story paragraphs={p.description} highlights={p.highlights} />
              ) : (
                <>
                  <p>{p.why ?? `${p.name} is a ${p.type.toLowerCase()} I worked on as ${p.role} at ${p.company}. ${p.result ? `The headline: ${p.result}.` : ""}`}</p>
                  <p className="border border-dashed border-line p-6 text-sm text-ink/45">Full case study coming soon: the problem, the architecture and what moved.</p>
                </>
              )}
              <ul className="flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-ink/70">
                    {t}
                  </li>
                ))}
              </ul>
              {p.live && (
                <a href={p.live} target="_blank" rel="noreferrer" className="btn btn-primary" data-cursor="true">
                  Visit live site ↗
                </a>
              )}
            </div>
          </div>
        </>
      )}

      {p.kind === "cli" && (
        <>
          <div className="mt-10 flex flex-wrap gap-2 font-mono text-xs text-ink/60">
            <span className="rounded-md border border-line px-2.5 py-1">{p.language}</span>
            <span className="rounded-md border border-line px-2.5 py-1">{p.version}</span>
            {p.stars !== undefined && <span className="rounded-md border border-line px-2.5 py-1">★ {p.stars} stars</span>}
            {p.downloads && <span className="rounded-md border border-line px-2.5 py-1">↓ {p.downloads}</span>}
          </div>
          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow mb-4">Try it here</p>
              <Playground p={p} />
            </div>
            <div className="space-y-10 lg:col-span-5">
              <div>
                <p className="eyebrow mb-4">Install</p>
                <div className="rounded-xl bg-ink p-3">
                  <InstallBar install={p.install} />
                </div>
              </div>
              <div>
                <p className="eyebrow mb-4">Demo</p>
                <Terminal title={`~/dev — ${p.name}`} lines={p.demo} minHeight={240} />
              </div>
            </div>
          </div>
          <div className="mt-16">
            <p className="eyebrow mb-4">Commands</p>
            <div className="border-t border-line">
              {p.commands.map((c) => (
                <div key={c.cmd} className="grid gap-1 border-b border-line py-4 md:grid-cols-2">
                  <code className="font-mono text-sm">{c.cmd}</code>
                  <span className="text-sm text-ink/60">{c.desc}</span>
                </div>
              ))}
            </div>
          </div>
          {p.repo && (
            <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn-ghost mt-10" data-cursor="true">
              View source ↗
            </a>
          )}
        </>
      )}

      {p.kind === "mobile" && (
        <>
          <dl className="mt-14 grid grid-cols-2 border-y border-line md:grid-cols-3">
            {[
              ["Platform", "iOS & Android"],
              ["Built with", p.tech.slice(0, 3).join(", ")],
              ["Backend", p.tech.includes("Firebase") ? "Firebase" : "—"],
            ].map(([k, v], i) => (
              <div key={k} className={`py-6 ${i > 0 ? "md:border-l md:border-line md:pl-6" : ""}`}>
                <dt className="eyebrow mb-2">{k}</dt>
                <dd className="text-sm text-ink/85">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12 flex gap-5 overflow-x-auto pb-4 md:justify-center md:gap-8" data-lenis-prevent>
            {p.screens.map((src, i) => (
              <div key={src} className={`relative aspect-[390/844] w-[62vw] shrink-0 overflow-hidden rounded-[2.2rem] border-[6px] border-ink bg-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)] sm:w-[260px] ${i === 1 ? "md:-translate-y-6" : ""}`}>
                <Image src={src} alt={`${p.name} screen ${i + 1}`} fill sizes="(min-width: 640px) 260px, 62vw" className="object-cover" priority={i === 0} />
              </div>
            ))}
          </div>
          <div className="mt-16 grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="eyebrow">The story</p>
            </div>
            <div className="space-y-6 text-base leading-relaxed text-ink/70 md:col-span-8 md:text-lg">
              {p.description && <Story paragraphs={p.description} highlights={p.highlights} />}
              <ul className="flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-ink/70">
                    {t}
                  </li>
                ))}
              </ul>
              {p.build && (
                <a href={p.build} target="_blank" rel="noreferrer" className="btn btn-primary" data-cursor="true">
                  Install the build ↗
                </a>
              )}
            </div>
          </div>
        </>
      )}

      <Link href={`/projects/${next.slug}`} data-cursor="Next" className="group mt-28 block border-t border-line pt-10">
        <span className="eyebrow">Next project</span>
        <span className="mt-4 block font-display text-[15vw] leading-[0.85] text-ink/25 transition-colors duration-500 group-hover:text-ink md:text-[9vw]">
          {next.name} →
        </span>
      </Link>
    </main>
  );
}
