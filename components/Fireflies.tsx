import * as THREE from "three";
import React, { useRef, useMemo, useState } from "react";
import { extend, useFrame } from "@react-three/fiber";
// import * as meshline from "meshline";
import { MeshLineGeometry, MeshLineMaterial, raycast } from "meshline";

// extend(meshline);
extend({ MeshLineGeometry, MeshLineMaterial });

const r = () => Math.max(0.2, Math.random());

function Fatline({
  curve,
  width,
  color,
}: {
  curve: any;
  width?: any;
  color: any;
}) {
  const material = useRef<MeshLineMaterial>();

  useFrame(
    (state, delta) =>
      material.current &&
      (material.current.uniforms.dashOffset.value -= delta / 100)
  );

  return (
    <mesh raycast={raycast} onPointerOver={console.log}>
      <meshLineGeometry points={curve} />
      <meshLineMaterial
        ref={material}
        transparent
        lineWidth={0.01}
        color={color}
        dashArray={0.1}
        dashRatio={0.99}
      />
    </mesh>
  );
}

export default function Fireflies({
  count,
  colors,
  radius = 10,
}: {
  count: number;
  colors: string[];
  radius: number;
}) {
  const lines = useMemo(
    () =>
      new Array(count).fill(null).map((_, index) => {
        const pos = new THREE.Vector3(
          Math.sin(0) * radius * r(),
          Math.cos(0) * radius * r(),
          0
        );
        const points = new Array(30).fill(null).map((_, index) => {
          const angle = (index / 20) * Math.PI * 2;
          return pos
            .add(
              new THREE.Vector3(
                Math.sin(angle) * radius * r(),
                Math.cos(angle) * radius * r(),
                0
              )
            )
            .clone();
        });
        const curve = new THREE.CatmullRomCurve3(points).getPoints(100);

        return {
          color: colors[parseInt((colors.length * Math.random()).toString())],
          curve,
        };
      }),

    [count, radius, colors]
  );

  return (
    <group position={[-radius * 2, -radius, 0]}>
      {lines.map((props, index) => (
        <Fatline key={index} {...props} />
      ))}
    </group>
  );
}
