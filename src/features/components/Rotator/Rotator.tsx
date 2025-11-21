"use client";

import { Button } from "@/src/components/Button";
import { RotateDirection } from "./type";

interface RotatorProps {
  direction?: RotateDirection;
  onRotate?: (direction: RotateDirection) => void;
}

export const Rotator = ({
  direction = "CLOCKWISE",
  onRotate,
}: RotatorProps) => {
  return (
    <Button
      onClick={() => {
        onRotate?.(direction);
      }}
    >
      {direction === "CLOCKWISE" ? "↻" : "↺"}
    </Button>
  );
};
