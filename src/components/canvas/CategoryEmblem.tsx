"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

export type EmblemKind = "all" | "work" | "personal" | "web3" | "mobile" | "cli";

/** One wireframe shape per project category. */
function makeGeometry(kind: EmblemKind): THREE.BufferGeometry {
  switch (kind) {
    case "work":
      return new THREE.BoxGeometry(1.5, 1.5, 1.5);
    case "personal":
      return new THREE.OctahedronGeometry(1.15);
    case "web3":
      // Faceted "crystal" for on-chain work.
      return new THREE.DodecahedronGeometry(1.1);
    case "mobile":
      return new THREE.BoxGeometry(0.95, 1.8, 0.16);
    case "cli":
      return new THREE.CylinderGeometry(1, 1, 1.3, 6);
    default:
      return new THREE.IcosahedronGeometry(1.15);
  }
}

function Emblem({ kind }: { kind: EmblemKind }) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef({ y: 0 });
  const lineMat = useMemo(() => new THREE.LineBasicMaterial({ color: "#0b0b0b" }), []);
  const fillMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#0b0b0b", transparent: true, opacity: 0.06, depthWrite: false }), []);
  const [shape, setShape] = useState(() => {
    const g = makeGeometry(kind);
    return { fill: g, edges: new THREE.EdgesGeometry(g) };
  });
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    // Squeeze + spin out, swap geometry at the midpoint, spin back in.
    const g = group.current!;
    const tl = gsap.timeline();
    tl.to(g.scale, { x: 0.35, y: 0.35, z: 0.35, duration: 0.35, ease: "power3.in" })
      .to(spin.current, { y: `+=${Math.PI}`, duration: 0.9, ease: "power3.inOut" }, 0)
      .call(() => {
        const ng = makeGeometry(kind);
        setShape((old) => {
          old.fill.dispose();
          old.edges.dispose();
          return { fill: ng, edges: new THREE.EdgesGeometry(ng) };
        });
      }, [], 0.35)
      .to(g.scale, { x: 1, y: 1, z: 1, duration: 0.7, ease: "elastic.out(1, 0.6)" }, 0.4);
    return () => {
      tl.kill();
    };
  }, [kind]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    // Slow idle turn plus a nudge from page scroll.
    spin.current.y += delta * 0.35;
    g.rotation.y = spin.current.y + window.scrollY * 0.0015;
    g.rotation.x = 0.45 + Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
  });

  return (
    <group ref={group}>
      <mesh geometry={shape.fill} material={fillMat} />
      <lineSegments geometry={shape.edges} material={lineMat} />
    </group>
  );
}

/** Small rotating wireframe that changes shape when the project filter changes. */
export default function CategoryEmblem({ kind, className = "" }: { kind: EmblemKind; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting));
    io.observe(wrap.current!);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={wrap} className={className} aria-hidden>
      <Canvas frameloop={active ? "always" : "never"} dpr={[1, 2]} camera={{ position: [0, 0, 4.2], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        <Emblem kind={kind} />
      </Canvas>
    </div>
  );
}
