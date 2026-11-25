"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import gsap from "gsap";

/* Shared materials, cached by colour so the scene stays cheap to render. */
const matCache = new Map<string, THREE.MeshStandardMaterial>();
function mat(color: string, roughness = 0.5, metalness = 0) {
  const key = `${color}|${roughness}|${metalness}`;
  if (!matCache.has(key)) matCache.set(key, new THREE.MeshStandardMaterial({ color, roughness, metalness }));
  return matCache.get(key)!;
}
const M = {
  white: mat("#f7f7f4", 0.6),
  ink: mat("#151826", 0.4),
  grey: mat("#d7d9e0", 0.55),
  violet: mat("#7c5cff", 0.4),
  blue: mat("#3b82f6", 0.4),
  sky: mat("#4cc9f0", 0.45),
  pink: mat("#ff5d8f", 0.42),
  yellow: mat("#ffd166", 0.45),
  green: mat("#22c55e", 0.4),
  teal: mat("#14b8a6", 0.4),
  orange: mat("#ff7a3d", 0.4),
  indigo: mat("#4f46e5", 0.38),
  slate: mat("#1f2937", 0.45, 0.1),
  amber: mat("#f59e0b", 0.4),
  plum: mat("#5b21b6", 0.35, 0.1),
  gold: mat("#f5b301", 0.28, 0.65),
  silver: mat("#cbd5e1", 0.25, 0.8),
};

const geoCache = new Map<string, THREE.BufferGeometry>();
/** Rounded box geometry, cached by size so identical parts share one buffer. */
function rbox(w: number, h: number, d: number, r = 0.05) {
  const key = `${w}|${h}|${d}|${r}`;
  if (!geoCache.has(key)) geoCache.set(key, new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2)));
  return geoCache.get(key)!;
}

type V3 = [number, number, number];
type Part = { pos: V3; rot?: V3; bob?: number; children: React.ReactNode };

const Box = ({ s, p = [0, 0, 0], m = M.white, r }: { s: V3; p?: V3; m?: THREE.Material; r?: number }) => (
  <mesh geometry={rbox(s[0], s[1], s[2], r)} material={m} position={p} />
);

/** Frontend: three browser windows pulled apart like layers in a design file. */
function frontendParts(): Part[] {
  const panel = (bar: THREE.Material, content: React.ReactNode) => (
    <>
      <Box s={[2.5, 1.62, 0.07]} r={0.06} />
      <Box s={[2.5, 0.22, 0.075]} p={[0, 0.7, 0.003]} m={bar} r={0.04} />
      {[
        [-1.08, M.pink],
        [-0.95, M.yellow],
        [-0.82, M.green],
      ].map(([x, m]) => (
        <mesh key={x as number} position={[x as number, 0.7, 0.045]} material={m as THREE.Material}>
          <sphereGeometry args={[0.035, 12, 12]} />
        </mesh>
      ))}
      {content}
    </>
  );
  return [
    {
      pos: [-0.55, 0.5, -0.7],
      bob: 0.9,
      children: panel(
        M.pink,
        <>
          {[
            [-0.75, M.yellow],
            [-0.25, M.sky],
            [0.25, M.pink],
            [0.75, M.green],
          ].map(([x, m]) => (
            <Box key={x as number} s={[0.4, 0.5, 0.05]} p={[x as number, 0.05, 0.05]} m={m as THREE.Material} r={0.04} />
          ))}
        </>
      ),
    },
    {
      pos: [0, 0, 0],
      bob: 1.2,
      children: panel(
        M.blue,
        <>
          <Box s={[1.05, 0.12, 0.05]} p={[-0.6, 0.3, 0.05]} m={M.sky} r={0.03} />
          <Box s={[1.05, 0.12, 0.05]} p={[0.6, 0.3, 0.05]} m={M.grey} r={0.03} />
          <Box s={[2.2, 0.62, 0.05]} p={[0, -0.25, 0.05]} m={M.yellow} r={0.05} />
        </>
      ),
    },
    {
      pos: [0.55, -0.5, 0.7],
      bob: 1.5,
      children: panel(
        M.violet,
        <>
          <Box s={[1.15, 0.72, 0.06]} p={[-0.55, 0.05, 0.05]} m={M.indigo} r={0.06} />
          <Box s={[0.85, 0.09, 0.05]} p={[0.55, 0.3, 0.05]} m={M.grey} r={0.03} />
          <Box s={[0.7, 0.09, 0.05]} p={[0.48, 0.12, 0.05]} m={M.grey} r={0.03} />
          <Box s={[0.6, 0.18, 0.08]} p={[0.43, -0.2, 0.06]} m={M.orange} r={0.08} />
        </>
      ),
    },
  ];
}

/** Backend: a rack of servers with status lights, next to a stacked database. */
function backendParts(): Part[] {
  const faces = [M.teal, M.violet, M.sky, M.pink];
  const rack: Part[] = [-0.84, -0.28, 0.28, 0.84].map((y, i) => ({
    pos: [-0.55, y, 0] as V3,
    bob: 0.8 + i * 0.25,
    children: (
      <>
        <Box s={[2.1, 0.44, 1.3]} m={M.slate} r={0.07} />
        <Box s={[1.1, 0.16, 0.04]} p={[-0.35, 0, 0.65]} m={faces[i]} r={0.03} />
        {[0.48, 0.68].map((x, j) => (
          <mesh key={x} position={[x, 0, 0.66]} material={j === 0 ? M.green : M.amber} name={j === 0 ? "led" : undefined}>
            <sphereGeometry args={[0.05, 14, 14]} />
          </mesh>
        ))}
      </>
    ),
  }));
  // A classic database icon: three discs with darker bands between them.
  const db: Part[] = [0, 1, 2].map((i) => ({
    pos: [1.35, -0.55 + i * 0.5, 0.2] as V3,
    bob: 1.1,
    children: (
      <>
        <mesh material={[M.blue, M.indigo, M.sky][i]}>
          <cylinderGeometry args={[0.5, 0.5, 0.36, 48]} />
        </mesh>
        <mesh position={[0, 0.19, 0]} material={M.white}>
          <cylinderGeometry args={[0.46, 0.46, 0.02, 48]} />
        </mesh>
      </>
    ),
  }));
  return [...rack, ...db];
}

/** Payments: a purple card with a gold chip, beside a stack of gold coins and one coin flipping. */
function paymentsParts(): Part[] {
  const coins: Part[] = [0, 1, 2, 3, 4].map((i) => ({
    pos: [1.2 + Math.sin(i * 1.7) * 0.05, -0.95 + i * 0.15, 0.1] as V3,
    children: (
      <mesh material={M.gold}>
        <cylinderGeometry args={[0.5, 0.5, 0.12, 48]} />
      </mesh>
    ),
  }));
  return [
    {
      pos: [-0.45, 0.25, 0],
      rot: [-0.25, 0.45, 0.12],
      bob: 1,
      children: (
        <>
          <Box s={[2.3, 1.45, 0.07]} m={M.plum} r={0.1} />
          <Box s={[2.3, 0.22, 0.072]} p={[0, 0.42, 0.002]} m={M.violet} r={0.04} />
          <Box s={[0.38, 0.3, 0.03]} p={[-0.7, 0.05, 0.05]} m={M.gold} r={0.04} />
          <mesh position={[0.78, 0.05, 0.05]} material={M.orange}>
            <sphereGeometry args={[0.13, 20, 20]} />
          </mesh>
          <mesh position={[0.95, 0.05, 0.05]} material={M.amber}>
            <sphereGeometry args={[0.13, 20, 20]} />
          </mesh>
          {[-0.55, -0.05, 0.45].map((x) => (
            <Box key={x} s={[0.38, 0.07, 0.02]} p={[x, -0.3, 0.045]} m={M.white} r={0.02} />
          ))}
          <Box s={[0.6, 0.06, 0.02]} p={[-0.6, -0.48, 0.045]} m={M.grey} r={0.02} />
        </>
      ),
    },
    ...coins,
    {
      pos: [1.25, 0.75, 0.4],
      bob: 1.4,
      children: (
        <mesh material={M.gold} rotation={[Math.PI / 2, 0, 0]} name="flip">
          <cylinderGeometry args={[0.36, 0.36, 0.08, 48]} />
        </mesh>
      ),
    },
  ];
}

/** Web3: coloured blocks chained together by metal links. */
function web3Parts(): Part[] {
  const centres: V3[] = [
    [-1.5, -0.85, -0.2],
    [-0.5, -0.28, 0.15],
    [0.5, 0.28, -0.15],
    [1.5, 0.85, 0.2],
  ];
  const blocks: Part[] = centres.map((c, i) => ({
    pos: c,
    rot: [0.35, 0.5 + i * 0.3, 0],
    bob: 0.9 + i * 0.2,
    children: <Box s={[0.66, 0.66, 0.66]} m={[M.violet, M.teal, M.pink, M.amber][i]} r={0.09} />,
  }));
  const links: Part[] = centres.slice(0, -1).map((c, i) => {
    const n = centres[i + 1];
    const mid: V3 = [(c[0] + n[0]) / 2, (c[1] + n[1]) / 2, (c[2] + n[2]) / 2];
    const angle = Math.atan2(n[1] - c[1], n[0] - c[0]);
    return {
      pos: mid,
      rot: [0, 0, angle],
      children: (
        <mesh material={M.silver} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.17, 0.04, 12, 32]} />
        </mesh>
      ),
    };
  });
  return [...blocks, ...links];
}

const SCENES = [frontendParts, backendParts, paymentsParts, web3Parts];

/** A soft round shadow under the objects, without the cost of real shadow maps. */
function useShadowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(0,0,0,0.28)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
}

function Scene({ index }: { index: number }) {
  const root = useRef<THREE.Group>(null);
  const sceneRefs = useRef<(THREE.Group | null)[]>([]);
  const mouse = useRef(new THREE.Vector2());
  const shown = useRef(-1);
  const shadow = useShadowTexture();
  const scenes = useMemo(() => SCENES.map((make) => make()), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => mouse.current.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Swap scenes: the old parts tumble away, the new ones pop in one after another.
  useEffect(() => {
    const prev = shown.current;
    shown.current = index;
    const parts = (i: number) => (sceneRefs.current[i]?.children ?? []) as THREE.Object3D[];
    const tl = gsap.timeline();
    if (prev >= 0 && prev !== index) {
      const old = parts(prev);
      tl.to(old.map((o) => o.scale), { x: 0.001, y: 0.001, z: 0.001, duration: 0.4, stagger: 0.03, ease: "power2.in" }, 0).call(
        () => {
          if (sceneRefs.current[prev] && shown.current !== prev) sceneRefs.current[prev]!.visible = false;
        },
        [],
        ">"
      );
    }
    const g = sceneRefs.current[index];
    if (g) {
      g.visible = true;
      const fresh = parts(index);
      fresh.forEach((o) => o.scale.setScalar(0.001));
      tl.to(fresh.map((o) => o.scale), { x: 1, y: 1, z: 1, duration: 0.9, stagger: 0.06, ease: "back.out(1.7)" }, prev >= 0 ? 0.3 : 0);
      // Spin the inner group (which rests at zero) so each part's own pose is kept.
      tl.fromTo(fresh.map((o) => o.children[0].rotation), { y: -0.9 }, { y: 0, duration: 1.1, stagger: 0.06, ease: "expo.out" }, "<");
    }
    return () => {
      tl.kill();
    };
  }, [index]);

  useFrame((state, delta) => {
    const r = root.current;
    if (!r) return;
    const t = state.clock.elapsedTime;
    const k = Math.min(delta * 3, 1);
    r.rotation.y += (-0.35 + Math.sin(t * 0.3) * 0.15 + mouse.current.x * 0.3 - r.rotation.y) * k;
    r.rotation.x += (0.12 + mouse.current.y * 0.15 - r.rotation.x) * k;
    const g = sceneRefs.current[shown.current];
    if (!g) return;
    // Each part floats on its own rhythm; status lights blink and the coin flips.
    g.children.forEach((part, i) => {
      const inner = part.children[0];
      const bob = (part.userData.bob as number) ?? 0;
      if (inner && bob) inner.position.y = Math.sin(t * bob + i) * 0.05;
    });
    g.traverse((o) => {
      if (o.name === "led") o.scale.setScalar(Math.sin(t * 6 + o.parent!.parent!.position.y * 5) > 0 ? 1 : 0.35);
      if (o.name === "flip") o.rotation.z = t * 2.2;
    });
  });

  return (
    <group ref={root} scale={0.92}>
      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#ffffff", "#bdbdb6", 0.9]} />
      <directionalLight position={[3, 5, 4]} intensity={2.1} />
      <directionalLight position={[-4, 2, -3]} intensity={0.7} />
      {scenes.map((parts, s) => (
        <group key={s} ref={(el) => void (sceneRefs.current[s] = el)} visible={false}>
          {parts.map((p, i) => (
            <group key={i} position={p.pos} rotation={p.rot ?? [0, 0, 0]} userData={{ bob: p.bob ?? 0.8 }}>
              <group>{p.children}</group>
            </group>
          ))}
        </group>
      ))}
      <mesh position={[0, -1.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 3]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

/**
 * Solid, colourful objects, one set per service: browser layers, a server rack with a database,
 * a card with coins, and a chain of blocks. Changing `index` swaps them with a staggered pop.
 */
export default function ServiceObjects({ index, className = "" }: { index: number; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting));
    io.observe(wrap.current!);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={wrap} className={className} aria-hidden>
      <Canvas frameloop={active ? "always" : "never"} dpr={[1, 1.5]} camera={{ position: [0, 0.2, 6.6], fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <Scene index={index} />
      </Canvas>
    </div>
  );
}
