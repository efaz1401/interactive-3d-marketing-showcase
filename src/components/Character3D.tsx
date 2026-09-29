import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { scroll } from "../hooks/scrollStore";

const MODEL = "/models/RobotExpressive.glb";
useGLTF.preload(MODEL);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Each scroll "beat" maps to a clip + a target pose for the robot. The robot
// glides between poses as you scroll, and crossfades animation clips per beat.
type Beat = {
  at: number; // scroll progress threshold (0..1)
  clip: string;
  rotY: number;
  posX: number;
  posY: number;
};

const BEATS: Beat[] = [
  { at: 0.0, clip: "Wave", rotY: 0.3, posX: 1.4, posY: -1 },
  { at: 0.16, clip: "Walking", rotY: -0.4, posX: -1.4, posY: -1 },
  { at: 0.34, clip: "ThumbsUp", rotY: 0.2, posX: 1.5, posY: -1 },
  { at: 0.52, clip: "Running", rotY: -0.5, posX: -1.3, posY: -1 },
  { at: 0.7, clip: "Dance", rotY: 0.0, posX: 0, posY: -1 },
  { at: 0.86, clip: "Yes", rotY: 0.25, posX: 1.2, posY: -1 },
];

function beatFor(progress: number): Beat {
  let current = BEATS[0];
  for (const b of BEATS) if (progress >= b.at) current = b;
  return current;
}

function Robot({ rtl }: { rtl: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const { scene, animations } = useGLTF(MODEL);
  const { actions } = useAnimations(animations, group);
  const activeClip = useRef<string>("");
  const dir = rtl ? -1 : 1;

  // Responsive scaling and positioning based on canvas viewport
  const isCompact = viewport.width < 5.8;
  const scale = isCompact ? 0.36 : 0.5;
  const xFactor = Math.min(1, Math.max(0.35, viewport.width / 6.5));

  // start idle
  useEffect(() => {
    const idle = actions["Idle"];
    idle?.reset().fadeIn(0.4).play();
    activeClip.current = "Idle";
    return () => {
      Object.values(actions).forEach((a) => a?.stop());
    };
  }, [actions]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const p = scroll.progress;
    const beat = beatFor(p);

    // crossfade clip on change
    if (beat.clip !== activeClip.current && actions[beat.clip]) {
      const prev = actions[activeClip.current];
      const next = actions[beat.clip];
      prev?.fadeOut(0.4);
      next?.reset().fadeIn(0.4).play();
      activeClip.current = beat.clip;
    }

    // smooth pose toward the current beat's target
    const g = group.current;
    const targetX = beat.posX * dir * xFactor;
    g.position.x = lerp(g.position.x, targetX, 0.06);
    g.position.y = lerp(g.position.y, beat.posY, 0.06);
    // continuous gentle spin tied to overall scroll + beat facing
    const targetRot = beat.rotY * dir + p * Math.PI * 0.6 * dir;
    g.rotation.y = lerp(g.rotation.y, targetRot, 0.05);
    // subtle idle bob
    g.position.y += Math.sin(performance.now() * 0.001) * 0.02 * delta * 60;
  });

  const model = useMemo(() => {
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return scene;
  }, [scene]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={model} scale={scale} />
    </group>
  );
}

export default function Character3D({ rtl = false }: { rtl?: boolean }) {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5,
        pointerEvents: "none",
      }}
    >
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.6, 6.5], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <hemisphereLight args={["#ffffff", "#2a2a2a", 1.1]} />
        <directionalLight
          position={[4, 6, 4]}
          intensity={2.2}
          color="#ffffff"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-5, 2, -3]} intensity={1.1} color="#eb5939" />
        <Suspense fallback={null}>
          <Robot rtl={rtl} />
          {!reduce && (
            <ContactShadows
              position={[0, -1.8, 0]}
              opacity={0.35}
              scale={12}
              blur={2.4}
              far={4}
              color="#000000"
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
