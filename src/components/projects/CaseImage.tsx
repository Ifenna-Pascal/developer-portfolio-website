"use client";
import dynamic from "next/dynamic";

const GLImage = dynamic(() => import("@/components/canvas/GLImage"), { ssr: false });

/** Large WebGL hero image for a case-study page. */
export default function CaseImage({ src, alt }: { src: string; alt: string }) {
  return <GLImage src={src} alt={alt} sizes="100vw" className="mt-12 aspect-[16/9] w-full rounded-[8px]" />;
}
