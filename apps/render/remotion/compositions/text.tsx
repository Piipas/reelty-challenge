import { Lottie } from "@remotion/lottie";
import React from "react";
import { AbsoluteFill } from "remotion";

export const TextComposition: React.FC<{ animationData: any }> = ({ animationData }) => {
  return (
    <AbsoluteFill style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Lottie animationData={animationData} />
    </AbsoluteFill>
  );
};
