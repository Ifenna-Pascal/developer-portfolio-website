"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const vertex = /* glsl */ `
  uniform float uVel;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    // Bend with scroll speed: the middle of the image lags behind its edges.
    p.y += sin(uv.x * 3.14159) * uVel * 0.08;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uCover;
  uniform float uFocus;
  uniform float uHover;
  uniform vec2 uMouse;
  uniform float uAspect;
  uniform float uReveal;
  uniform float uFull;
  varying vec2 vUv;

  void main() {
    // object-fit: cover, anchored to the top so site headers stay visible.
    vec2 uv = vec2(vUv.x * uCover.x + uFocus * (1.0 - uCover.x), 1.0 - (1.0 - vUv.y) * uCover.y);
    // Zoom out slightly as the reveal completes.
    uv = (uv - vec2(0.5, 1.0)) * (1.0 - (1.0 - uReveal) * 0.15) + vec2(0.5, 1.0);

    // No distortion: sample the screenshot exactly, so text stays sharp.
    vec3 col = texture2D(uTex, uv).rgb;
    float grey = dot(col, vec3(0.299, 0.587, 0.114));

    // Black-and-white by default. On hover, full colour floods out from the cursor
    // in a clean circle until it covers the whole image.
    vec2 d = (vUv - uMouse) * vec2(uAspect, 1.0);
    float radius = uHover * (uAspect + 1.2);
    float colourMask = 1.0 - smoothstep(radius - 0.04, radius, length(d));
    // uFull = 1 on touch/small screens: always full colour.
    col = mix(vec3(grey), col, max(colourMask, uFull));

    // Wipe down from the top with a soft edge (fully shown at uReveal = 1).
    float r = uReveal * 1.06;
    float edge = smoothstep(r - 0.06, r, 1.0 - vUv.y);
    gl_FragColor = vec4(col, 1.0 - edge);
  }
`;

type Shared = { hover: number; mouse: THREE.Vector2; reveal: number; full: number };

function Plane({ src, focus, shared, onReady }: { src: string; focus: number; shared: React.MutableRefObject<Shared>; onReady: () => void }) {
  const { viewport, size, gl } = useThree();
  const lastY = useRef(0);
  const uniforms = useMemo(
    () => ({
      uTex: { value: null as THREE.Texture | null },
      uCover: { value: new THREE.Vector2(1, 1) },
      uFocus: { value: focus },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uAspect: { value: 1 },
      uReveal: { value: 0 },
      uFull: { value: 0 },
      uVel: { value: 0 },
    }),
    [focus]
  );
  const material = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms, transparent: true }),
    [uniforms]
  );

  useEffect(() => {
    let alive = true;
    new THREE.TextureLoader().load(src, (tex) => {
      if (!alive) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      // Mipmaps + anisotropic filtering keep downscaled screenshots crisp.
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = gl.capabilities.getMaxAnisotropy();
      uniforms.uTex.value = tex;
      const img = tex.image as HTMLImageElement;
      uniforms.uCover.value.set(img.width / img.height, 1);
      onReady();
    });
    lastY.current = window.scrollY;
    return () => {
      alive = false;
      uniforms.uTex.value?.dispose();
    };
  }, [src, uniforms, onReady, gl]);

  useFrame((_, delta) => {
    // Cover-fit ratio between the image and the plane.
    const tex = uniforms.uTex.value;
    if (tex) {
      const img = tex.image as HTMLImageElement;
      const imgA = img.width / img.height;
      const planeA = size.width / size.height;
      uniforms.uCover.value.set(planeA < imgA ? planeA / imgA : 1, planeA < imgA ? 1 : imgA / planeA);
    }
    uniforms.uAspect.value = size.width / size.height;
    const s = shared.current;
    uniforms.uHover.value += (s.hover - uniforms.uHover.value) * Math.min(delta * (s.hover ? 2.2 : 4), 1);
    // The colour circle grows from where the cursor entered, so the centre stays put while hovering.
    if (uniforms.uHover.value < 0.02) uniforms.uMouse.value.copy(s.mouse);
    uniforms.uReveal.value = s.reveal;
    uniforms.uFull.value = s.full;
    const y = window.scrollY;
    const v = THREE.MathUtils.clamp((y - lastY.current) / Math.max(delta, 0.001) / 3000, -1, 1);
    lastY.current = y;
    uniforms.uVel.value += (v - uniforms.uVel.value) * Math.min(delta * 6, 1);
  });

  return (
    <mesh material={material} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  );
}

/**
 * An image rendered through WebGL: black-and-white with a wipe-in reveal and a colour
 * hover (always full colour on mobile) and a slight bend while scrolling. Falls back to a plain grayscale <Image>.
 */
export default function GLImage({ src, alt, sizes, focus = 0.5, className = "" }: { src: string; alt: string; sizes: string; focus?: number; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const shared = useRef<Shared>({ hover: 0, mouse: new THREE.Vector2(0.5, 0.5), reveal: 0, full: 0 });
  const [inView, setInView] = useState(false);
  const [gl, setGl] = useState(false);
  const onReady = useMemo(() => () => {}, []);

  useEffect(() => {
    const el = wrap.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setGl(!reduced);
    if (reduced) shared.current.reveal = 1;
    // Phones and tablets have no hover, so show the screenshots in their real colours there.
    const mobile = window.matchMedia("(max-width: 1023px), (hover: none)");
    const syncFull = () => (shared.current.full = mobile.matches ? 1 : 0);
    syncFull();
    mobile.addEventListener("change", syncFull);
    // Mount the WebGL canvas only near the viewport so only a few contexts exist at once.
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(el);
    // Reveal once, the first time it scrolls in.
    const revealIo = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        gsap.to(shared.current, { reveal: 1, duration: 1.6, ease: "expo.inOut" });
        revealIo.disconnect();
      },
      { threshold: 0.25 }
    );
    revealIo.observe(el);
    return () => {
      io.disconnect();
      revealIo.disconnect();
      mobile.removeEventListener("change", syncFull);
    };
  }, []);

  return (
    <div
      ref={wrap}
      className={`relative overflow-hidden bg-ink/5 ${className}`}
      onPointerEnter={() => (shared.current.hover = 1)}
      onPointerLeave={() => (shared.current.hover = 0)}
      onPointerMove={(e) => {
        const r = wrap.current!.getBoundingClientRect();
        shared.current.mouse.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        style={{ objectPosition: `${focus * 100}% 0%` }}
        className={`object-cover grayscale max-lg:grayscale-0 pointer-coarse:grayscale-0 transition-opacity duration-500 ${gl && inView ? "opacity-0" : "opacity-100"}`}
      />
      {gl && inView && (
        <Canvas className="!absolute inset-0" dpr={[1, 2]} orthographic camera={{ position: [0, 0, 5], zoom: 1 }} gl={{ antialias: true, alpha: true }}>
          <Plane src={src} focus={focus} shared={shared} onReady={onReady} />
        </Canvas>
      )}
    </div>
  );
}
