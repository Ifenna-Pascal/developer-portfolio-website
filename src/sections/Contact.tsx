"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { profile, socials } from "@/data/site";
import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";

function LagosClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      setTime(new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date()));
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time || "--:--:--"}</span>;
}

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      gsap.from(".ct-rule-x", { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "expo.inOut", stagger: 0.1, scrollTrigger: { trigger: root.current, start: "top 75%", once: true } });
      gsap.from(".ct-rule-y", { scaleY: 0, transformOrigin: "top", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: root.current, start: "top 75%", once: true } });
      gsap.from(".ct-fade", { y: 30, opacity: 0, stagger: 0.07, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".ct-email", start: "top 90%", once: true } });
      gsap.from(".ct-row", { x: 40, opacity: 0, stagger: 0.08, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".ct-list", start: "top 85%", once: true } });
    },
    { scope: root }
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const rows = [
    ...socials.slice(1).map((s) => ({ label: s.label, value: s.handle, href: s.href })),
    { label: "Resume", value: "Download PDF", href: profile.resume },
  ];

  return (
    <>
      <section ref={root} id="contact" className="relative grid w-full grid-cols-1 bg-paper lg:grid-cols-2">
        <span aria-hidden className="ct-rule-x absolute left-6 right-6 top-0 h-px bg-line lg:left-16 lg:right-16" />
        <div className="flex flex-col p-6 lg:p-10">
          <Reveal as="h2" by="words" className="w-full pb-6 pt-8 font-display text-[44px] font-bold leading-[48px] tracking-wider text-ink lg:px-6 lg:pt-12 lg:text-[72px] lg:leading-[76px]">
            I am not hard to find, let&apos;s build something truly spectacular!
          </Reveal>
          <div className="ct-email lg:px-6">
            <div className="ct-fade">
              <a
                href={`mailto:${profile.email}`}
                data-cursor="Email"
                className="block break-all text-2xl font-semibold text-ink underline decoration-ink/20 underline-offset-8 transition-colors hover:decoration-ink md:text-3xl"
              >
                {profile.email}
              </a>
            </div>
            <div className="ct-fade mt-6 flex flex-wrap gap-3">
              <Magnetic>
                <a href={`mailto:${profile.email}`} className="btn btn-primary" data-cursor="true">
                  Send an email
                </a>
              </Magnetic>
              <button onClick={copy} className="btn btn-ghost" data-cursor="true">
                {copied ? "Copied ✓" : "Copy email"}
              </button>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col justify-center p-6 lg:p-16">
          <span aria-hidden className="ct-rule-y absolute left-0 top-0 hidden h-full w-px bg-line lg:block" />
          <p className="ct-fade mb-6 flex items-center gap-2 text-sm text-ink/70">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ink" />
            </span>
            Open to {profile.availability.join(", ").toLowerCase()} work
          </p>
          <ul className="ct-list border-t border-line">
            {rows.map((r) => (
              <li key={r.label} className="ct-row border-b border-line">
                <a href={r.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between py-5" data-cursor="true">
                  <span className="font-display text-4xl text-ink lg:text-5xl">{r.label}</span>
                  <span className="flex items-center gap-3 text-sm text-ink/55 transition group-hover:text-ink">
                    {r.value}
                    <span aria-hidden className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
                  </span>
                </a>
              </li>
            ))}
            <li className="ct-row flex items-center justify-between border-b border-line py-5">
              <span className="font-display text-4xl text-ink lg:text-5xl">Lagos</span>
              <span className="font-mono text-sm text-ink/55">
                <LagosClock /> WAT
              </span>
            </li>
          </ul>
        </div>
      </section>
      <footer className="flex h-[70px] items-center justify-between bg-ink px-6 font-mono text-[11px] uppercase tracking-[0.15em] text-white/70 lg:px-16">
        <span>&copy; {new Date().getFullYear()} {profile.name}</span>
        <a href="#home" className="hover:text-white">
          Back to top ↑
        </a>
      </footer>
    </>
  );
}
