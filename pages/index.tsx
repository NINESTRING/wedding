import { Effects, Plane, useAspect, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import Fireflies from "../components/Fireflies";
import "../materials/layerMaterial";
import bearUrl from "../resources/aaaaa.png";
import bgUrl from "../resources/bg.jpg";
import groundUrl from "../resources/ground.png";
import leaves1Url from "../resources/aaaa.png";
import leaves2Url from "../resources/leaves2.png";
import starsUrl from "../resources/stars.png";

function Scene({ dof }: any) {
  const scaleN = useAspect(1600, 1000, 1.05);
  const scaleW = useAspect(2200, 1000, 1.05);
  const textures = useTexture([
    bgUrl.src,
    starsUrl.src,
    groundUrl.src,
    bearUrl.src,
    leaves1Url.src,
    leaves2Url.src,
  ]);
  const subject = useRef<any>();
  const group = useRef<any>(null);
  const layersRef = useRef<any>([]);
  const [movement] = useState(() => new THREE.Vector3());
  const [temp] = useState(() => new THREE.Vector3());
  const [focus] = useState(() => new THREE.Vector3());
  const layers = [
    { texture: textures[0], z: 0, factor: 0.005, scale: scaleW },
    { texture: textures[1], z: 10, factor: 0.005, scale: scaleW },
    { texture: textures[2], z: 20, scale: scaleW },
    {
      texture: textures[3],
      z: 30,
      ref: subject,
      scaleFactor: 0.83,
      scale: scaleN,
    },
    {
      texture: textures[4],
      factor: 0.03,
      scaleFactor: 1,
      z: 40,
      wiggle: 0.6,
      scale: scaleW,
    },
    {
      texture: textures[5],
      factor: 0.04,
      scaleFactor: 1.3,
      z: 49,
      wiggle: 1,
      scale: scaleW,
    },
  ];

  useFrame((state, delta) => {
    if (dof.current) {
      dof.current.target = focus.lerp(subject.current?.position, 0.05);
    }

    movement.lerp(temp.set(state.mouse.x, state.mouse.y * 0.2, 0), 0.2);
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      state.mouse.x * 20,
      0.2
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      state.mouse.y / 10,
      0.2
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      -state.mouse.x / 2,
      0.2
    );
    layersRef.current[4].uniforms.time.value =
      layersRef.current[5].uniforms.time.value += delta;
  }, 1);

  return (
    <group ref={group}>
      <Fireflies count={20} radius={80} colors={["orange"]} />
      {layers.map(
        (
          { scale, texture, ref, factor = 0, scaleFactor = 1, wiggle = 0, z },
          i
        ) => (
          <Plane
            scale={scale}
            args={[1, 1, wiggle ? 10 : 1, wiggle ? 10 : 1]}
            position-z={z}
            key={i}
            ref={ref}
          >
            <layerMaterial
              movement={movement}
              textr={texture}
              factor={factor}
              ref={(el) => (layersRef.current[i] = el)}
              wiggle={wiggle}
              scale={scaleFactor}
            />
          </Plane>
        )
      )}
    </group>
  );
}

export default function Home() {
  const dof = useRef<any>(null);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        orthographic
        camera={{ zoom: 5, position: [0, 0, 200], far: 300, near: 0 }}
      >
        <Suspense fallback={null}>
          <Scene dof={dof} />
        </Suspense>
        <Effects ref={dof} />
      </Canvas>
    </div>
  );
}
