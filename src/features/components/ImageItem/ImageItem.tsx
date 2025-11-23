"use client";

import Image from "next/image";
import { Rotator } from "../Rotator/Rotator";
import { RefObject, useRef } from "react";
import { RotateDirection } from "../Rotator/type";
import { Button } from "@/src/components/Button";
import { useDrag } from "react-dnd";
import { ImageFile } from "../../models/ImageFile";

const ROTATION_DEGREE = 90;

const ROTATION_DEGREE_MAP = {
  CLOCKWISE: +ROTATION_DEGREE,
  COUNTER_CLOCKWISE: -ROTATION_DEGREE,
};

interface ImageItemProps {
  index: number;
  file: ImageFile;
  onRotate: (degree: number) => void;
  onClickAddImageButton: (index: number) => void;
  onClickRemoveButton: () => void;
}

export const ImageItem = ({
  onRotate,
  index,
  file,
  onClickAddImageButton,
  onClickRemoveButton,
}: ImageItemProps) => {
  const [{ opacity }, dragRef] = useDrag(() => ({
    type: "IMAGE_ITEM",
    item: { dragId: file.id },
    collect: (monitor) => {
      return {
        opacity: monitor.isDragging() ? 0.5 : 1,
      };
    },
  }));

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
    <div className="flex items-center gap-2">
      <div
        style={{ opacity }}
        className="flex flex-col border-2 border-gray-300 rounded-md justify-between items-center gap-4 h-full p-10"
      >
        <div ref={dragRef as unknown as RefObject<HTMLDivElement>}>
          <Image
            width={"200"}
            height={"200"}
            src={URL.createObjectURL(file.file)}
            alt={`업로드한 이미지 ${index + 1}번째`}
            ref={imageRef}
            quality={50}
            aria-label="업로드한 이미지"
          />
        </div>
        <div className="flex justify-center items-center gap-2">
          <Rotator direction="COUNTER_CLOCKWISE" onRotate={handleRotate} />
          <Rotator direction="CLOCKWISE" onRotate={handleRotate} />

          <Button
            className="w-10 h-10 bg-red-400 hover:bg-red-500"
            onClick={onClickRemoveButton}
            aria-label="이미지 삭제 버튼"
          >
            -
          </Button>
        </div>
        <div aria-label={`${index + 1} 번째 이미지`}>{index + 1} page</div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col items-center gap-2">
        <Button
          className="w-10 h-10 bg-green-400 hover:bg-green-500"
          onClick={() => onClickAddImageButton(index)}
          aria-label="이미지 추가 버튼"
        >
          +
        </Button>
      </div>
    </div>
  );
};
