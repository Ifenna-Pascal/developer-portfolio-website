"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const INK = new THREE.Color("#0b0b0b");
const GLOBE_R = 1.5;

/** Latitude + longitude lines of a wireframe globe, as one LineSegments geometry. */
function globeLines() {
  const pts: number[] = [];
  const seg = 96;
  const ring = (fn: (t: number) => THREE.Vector3) => {
    for (let i = 0; i < seg; i++) {
      const a = fn((i / seg) * Math.PI * 2);
      const b = fn(((i + 1) / seg) * Math.PI * 2);
      pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  };
  for (let k = 0; k < 8; k++) {
    const lon = (k / 8) * Math.PI;
    ring((t) => new THREE.Vector3(Math.cos(t) * Math.cos(lon), Math.sin(t), Math.cos(t) * Math.sin(lon)).multiplyScalar(GLOBE_R));
  }
  for (let k = 1; k < 6; k++) {
    const lat = (k / 6) * Math.PI - Math.PI / 2;
    const r = Math.cos(lat);
    const y = Math.sin(lat);
    ring((t) => new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r).multiplyScalar(GLOBE_R));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return g;
}

/** Evenly spread dots on the globe surface (Fibonacci sphere). */
function globeDots(n: number) {
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * 2.399963;
    pos.set([Math.cos(th) * r * GLOBE_R, y * GLOBE_R, Math.sin(th) * r * GLOBE_R], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return g;
}

const dotMaterial = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uOpacity: { value: 0 }, uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) } },
    vertexShader: /* glsl */ `
      uniform float uPixelRatio;
      varying float vFacing;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        // Dots on the far side of the globe fade out, which sells the depth.
        vFacing = clamp((mv.z + 6.2) * 0.9 + 0.5, 0.0, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = 4.0 * uPixelRatio;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying float vFacing;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        gl_FragColor = vec4(vec3(0.043), uOpacity * mix(0.12, 0.7, vFacing));
      }`,
  });

/** An elliptical orbit drawn as a thin tube whose brightness trails behind its electron. */
function Orbit({ a, b, tilt, speed, phase, speedMul, intro }: { a: number; b: number; tilt: THREE.Euler; speed: number; phase: number; speedMul: React.MutableRefObject<number>; intro: React.MutableRefObject<number> }) {
  const electron = useRef<THREE.Mesh>(null);
  const head = useRef(phase);
  const curve = useMemo(() => {
    const pts = Array.from({ length: 160 }, (_, i) => {
      const t = (i / 160) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(t) * a, Math.sin(t) * b, 0);
    });
    return new THREE.CatmullRomCurve3(pts, true);
  }, [a, b]);
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 320, 0.009, 6, true), [curve]);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uHead: { value: 0 }, uOpacity: { value: 0 } },
        vertexShader: /* glsl */ `
          varying float vT;
          void main() { vT = uv.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: /* glsl */ `
          uniform float uHead;
          uniform float uOpacity;
          varying float vT;
          void main() {
            float behind = fract(uHead - vT);
            float trail = pow(1.0 - behind, 7.0);
            gl_FragColor = vec4(vec3(0.043), uOpacity * (0.16 + 0.84 * trail));
          }`,
      }),
    []
  );

  useFrame((_, delta) => {
    head.current = (head.current + delta * speed * speedMul.current) % 1;
    material.uniforms.uHead.value = head.current;
    material.uniforms.uOpacity.value = intro.current;
    const p = curve.getPointAt(head.current);
    electron.current?.position.copy(p);
    electron.current?.scale.setScalar(intro.current);
  });

  return (
    <group rotation={tilt}>
      <mesh geometry={geometry} material={material} />
      <mesh ref={electron}>
        <sphereGeometry args={[0.065, 24, 24]} />
        <meshBasicMaterial color={INK} />
      </mesh>
    </group>
  );
}

/** Cluster of black and white spheres: protons and neutrons. */
function Nucleus({ intro }: { intro: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const balls = useMemo(() => {
    const n = 13;
    return Array.from({ length: n }, (_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * 2.399963;
      return { pos: new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(0.17), dark: i % 2 === 0 };
    });
  }, []);
  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    g.rotation.y = t * 0.6;
    g.rotation.x = t * 0.35;
    g.scale.setScalar(intro.current * (1 + Math.sin(t * 2.2) * 0.04));
  });
  return (
    <group ref={group}>
      {balls.map((b, i) => (
        <mesh key={i} position={b.pos}>
          <sphereGeometry args={[0.13, 32, 32]} />
          <meshStandardMaterial color={b.dark ? "#0b0b0b" : "#f2f2ee"} roughness={0.25} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ hover }: { hover: React.MutableRefObject<number> }) {
  const root = useRef<THREE.Group>(null);
  const globe = useRef<THREE.Group>(null);
  const target = useRef(new THREE.Vector2());
  const intro = useRef(0);
  const speedMul = useRef(1);
  const lines = useMemo(() => globeLines(), []);
  const dots = useMemo(() => globeDots(520), []);
  const dotMat = useMemo(() => dotMaterial(), []);
  const lineMat = useMemo(() => new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0, depthWrite: false }), []);

  const orbits = useMemo(
    () => [
      { a: 2.25, b: 0.78, tilt: new THREE.Euler(1.15, 0, 0.35, "ZXY"), speed: 0.16, phase: 0 },
      { a: 2.25, b: 0.78, tilt: new THREE.Euler(1.15, 0, 0.35 + (Math.PI * 2) / 3, "ZXY"), speed: 0.13, phase: 0.33 },
      { a: 2.25, b: 0.78, tilt: new THREE.Euler(1.15, 0, 0.35 - (Math.PI * 2) / 3, "ZXY"), speed: 0.11, phase: 0.66 },
    ],
    []
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) =>
      target.current.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    window.addEventListener("pointermove", onMove);
    // Intro: globe draws in, then the orbits and electrons appear.
    const tl = gsap.timeline({ delay: 0.3 });
    if (globe.current) tl.from(globe.current.scale, { x: 0.6, y: 0.6, z: 0.6, duration: 2, ease: "expo.out" }, 0);
    tl.to(lineMat, { opacity: 0.16, duration: 1.6, ease: "power2.out" }, 0)
      .to(dotMat.uniforms.uOpacity, { value: 1, duration: 1.6, ease: "power2.out" }, 0.2)
      .to(intro, { current: 1, duration: 1.8, ease: "expo.out" }, 0.5);
    return () => {
      window.removeEventListener("pointermove", onMove);
      tl.kill();
    };
  }, [lineMat, dotMat]);

  useFrame((_, delta) => {
    const r = root.current;
    const g = globe.current;
    if (!r || !g) return;
    const k = Math.min(delta * 1.8, 1);
    // Hover: electrons speed up, the globe opens slightly.
    speedMul.current += (1 + hover.current * 2.2 - speedMul.current) * k;
    g.rotation.y += delta * 0.12;
    const s = 1 + hover.current * 0.06;
    g.scale.x += (s - g.scale.x) * k * (intro.current > 0.5 ? 1 : 0);
    g.scale.y = g.scale.z = g.scale.x;
    r.rotation.y += (target.current.x * 0.45 - r.rotation.y) * k;
    r.rotation.x += (-target.current.y * 0.3 - r.rotation.x) * k;
  });

  return (
    <group ref={root}>
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <group ref={globe}>
        <lineSegments geometry={lines} material={lineMat} />
        <points geometry={dots} material={dotMat} />
      </group>
      <Nucleus intro={intro} />
      {orbits.map((o, i) => (
        <Orbit key={i} {...o} speedMul={speedMul} intro={intro} />
      ))}
    </group>
  );
}

/** Hero visual: a wireframe globe with an atom's orbits and nucleus running through it. */
export default function AtomGlobe({ className = "" }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const hover = useRef(0);
  const [active, setActive] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setOk(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting));
    io.observe(wrap.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrap}
      className={`relative ${className}`}
      onPointerEnter={() => gsap.to(hover, { current: 1, duration: 0.8 })}
      onPointerLeave={() => gsap.to(hover, { current: 0, duration: 1.2 })}
      aria-hidden
    >
      {ok ? (
        <Canvas frameloop={active ? "always" : "never"} dpr={[1, 2]} camera={{ position: [0, 0, 6.2], fov: 40 }} gl={{ antialias: true, alpha: true }}>
          <Scene hover={hover} />
        </Canvas>
      ) : (
        <div className="absolute inset-[18%] rounded-full border border-ink/20" />
      )}
    </div>
  );
}
