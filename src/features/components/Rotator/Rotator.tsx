"use client";

import { Button } from "@/src/components/Button";
import { RotateDirection } from "./type";
import { memo } from "react";

interface RotatorProps {
  direction?: RotateDirection;
  onRotate?: (direction: RotateDirection) => void;
}

export const Rotator = memo(
  ({ direction = "CLOCKWISE", onRotate }: RotatorProps) => {
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
  },
);

Rotator.displayName = "Rotator";
