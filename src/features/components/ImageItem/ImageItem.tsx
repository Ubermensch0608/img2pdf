"use client";

import Image from "next/image";
import { Rotator } from "../Rotator/Rotator";
import { useRef } from "react";
import { RotateDirection } from "../Rotator/type";

const DEFAULT_WIDTH = 50;
const DEFAULT_HEIGHT = 50;
const ROTATION_DEGREE = 90;

const ROTATION_DEGREE_MAP = {
  CLOCKWISE: +ROTATION_DEGREE,
  COUNTER_CLOCKWISE: -ROTATION_DEGREE,
};

interface ImageItemProps {
  width?: number | `${number}`;
  height?: number | `${number}`;
  src: string;
  alt: string;
  onRotate: (degree: number) => void;
}

export const ImageItem = ({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  src,
  alt,
  onRotate,
}: ImageItemProps) => {
  const imageRef = useRef<HTMLImageElement | null>(null);

  const addRotationDegree = (
    prevDegree: number,
    direction: RotateDirection,
  ) => {
    const rotationDegree = ROTATION_DEGREE_MAP[direction];
    return (prevDegree + rotationDegree) % 360;
  };

  const handleRotate = (direction: RotateDirection) => {
    if (!imageRef.current) return;

    const prevDegree = imageRef.current.style.transform
      .replace("rotate(", "")
      .replace("deg)", "");

    const newDegree = addRotationDegree(
      Number.parseInt(prevDegree || "0"),
      direction,
    );
    imageRef.current.style.transform = `rotate(${newDegree}deg)`;

    onRotate?.(newDegree);
  };

  return (
    <div className="flex flex-col border-2 border-gray-300 rounded-md justify-between items-center gap-4 h-full p-10">
      <Image
        width={width}
        height={height}
        src={src}
        alt={alt}
        ref={imageRef}
        quality={50}
      />
      <div className="flex justify-center items-center gap-2">
        <Rotator direction="COUNTER_CLOCKWISE" onRotate={handleRotate} />
        <Rotator direction="CLOCKWISE" onRotate={handleRotate} />
      </div>
    </div>
  );
};
