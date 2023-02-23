import { useThree } from "@react-three/fiber";
import {
  EffectComposer,
  DepthOfField,
  Vignette,
} from "@react-three/postprocessing";
import { DepthOfFieldEffect } from "postprocessing";
import React from "react";

const Effects = React.forwardRef(
  (props, ref: React.ForwardedRef<DepthOfFieldEffect>) => {
    const { viewport: { width, height }, gl } = useThree() // prettier-ignore

    if (window) {
      console.log(":::::");
    } else {
      console.log("no window");
    }

    return (
      <EffectComposer multisampling={0}>
        <DepthOfField
          ref={ref}
          bokehScale={8}
          focalLength={0.1}
          width={(width * 5) / 2}
          height={(height * 5) / 2}
        />
        <Vignette />
      </EffectComposer>
    );
  }
);

export default Effects;
