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
      aria-label={`${direction === "CLOCKWISE" ? "시계방향" : "반시계방향"} 회전 버튼`}
      onClick={() => {
        onRotate?.(direction);
      }}
    >
      {direction === "CLOCKWISE" ? "↻" : "↺"}
    </Button>
  );
};
