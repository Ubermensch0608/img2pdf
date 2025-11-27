"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ImageFile } from "../models/ImageFile";
import jsPDF from "jspdf";

import { create } from "zustand";
import { ImageDegree } from "../models/ImageDegree";
import type {
  WorkerRequest,
  WorkerResponse,
  ImageData,
} from "@/src/types/worker.types";

type StoreType = {
  imgFiles: ImageFile[];
  imageDegrees: ImageDegree[];
  uploadImageFiles: (fileList: File[]) => void;
  addImage: (id: number) => void;
  removeImage: (id: string) => void;
  rotateImage: (id: string, degree: number) => void;
  switchImage: (dragId: string, dropId: string) => void;
};

const useImageFilesStore = create<StoreType>((set) => ({
  imgFiles: [],
  imageDegrees: [],
  uploadImageFiles: (fileList: File[]) => {
    const imgFiles = fileList.map((file) => new ImageFile(file));
    const imageDegrees = imgFiles.map((file) => new ImageDegree(file.id, 0));
    set({ imgFiles, imageDegrees });
  },
  addImage: (index: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      const nextIndex = index + 1;

      if (file) {
        set((state) => {
          const newImage = new ImageFile(file);

          return {
            imgFiles: [
              ...state.imgFiles.slice(0, nextIndex),
              newImage,
              ...state.imgFiles.slice(nextIndex),
            ],
            imageDegrees: [...state.imageDegrees, new ImageDegree(newImage.id)],
          };
        });
      }
    };
  },
  switchImage: (dragId: string, dropId: string) => {
    set((state) => {
      const newImgFiles = [...state.imgFiles];
      const dragImageIndex = newImgFiles.findIndex(
        (file) => file.id === dragId,
      );
      const dropImageIndex = newImgFiles.findIndex(
        (file) => file.id === dropId,
      );
      if (dragImageIndex !== -1 && dropImageIndex !== -1) {
        const dragImage = newImgFiles[dragImageIndex];
        const dropImage = newImgFiles[dropImageIndex];
        newImgFiles[dragImageIndex] = dropImage!;
        newImgFiles[dropImageIndex] = dragImage!;
      }
      return {
        imgFiles: newImgFiles,
      };
    });
  },
  removeImage: (id: string) => {
    set((state) => ({
      imgFiles: state.imgFiles.filter((file) => file.id !== id),
      imageDegrees: state.imageDegrees.filter((degree) => degree.id !== id),
    }));
  },
  rotateImage: (id: string, degree: number) => {
    set((state) => {
      return {
        imageDegrees: state.imageDegrees.map((d) =>
          d.id === id ? new ImageDegree(d.id, degree) : d,
        ),
      };
    });
  },
}));

export const useImageFiles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const workerRef = useRef<Worker | null>(null);

  const {
    imgFiles,
    imageDegrees,
    uploadImageFiles,
    removeImage,
    switchImage,
    rotateImage,
    addImage,
  } = useImageFilesStore();

  const [pdf, setPdf] = useState<jsPDF | null>(null);

  // 헬퍼 함수들을 useCallback으로 먼저 정의
  const readAsDataURL = useCallback((file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const loadImage = useCallback((src: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject;
      img.src = src;
    });
  }, []);

  const imagesToPdfSync = useCallback(async (imgFiles: ImageFile[]) => {
    const pdf = new jsPDF("p", "px", "a4");

    for (let i = 0; i < imgFiles.length; i++) {
      const currentImageFile = imgFiles[i];
      const degreeByMatchedImage = imageDegrees.find(
        (degree) => degree.id === currentImageFile.id,
      );
      const dataUrl = await readAsDataURL(currentImageFile.file);
      const img = await loadImage(dataUrl);

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // 비율 유지하며 맞추기
      const aspectRatio = Math.min(
        pageWidth / img.width,
        pageHeight / img.height,
      );
      const w = img.width * aspectRatio;
      const h = img.height * aspectRatio;

      if (i !== 0) {
        pdf.addPage();
      }
      pdf.addImage(
        img,
        "JPEG",
        0,
        0,
        w,
        h,
        undefined,
        "FAST",
        degreeByMatchedImage?.degree,
      );
    }

    return pdf;
  }, [imageDegrees, readAsDataURL, loadImage]);

  // Web Worker 초기화 및 정리
  useEffect(() => {
    // Worker 초기화
    workerRef.current = new Worker(
      new URL("@/src/workers/pdf.worker.ts", import.meta.url),
      { type: "module" }
    );

    // Worker 메시지 핸들러
    workerRef.current.onmessage = async (event: MessageEvent<WorkerResponse>) => {
      const { type, data, error, progress: workerProgress } = event.data;

      if (type === "PROGRESS" && workerProgress !== undefined) {
        setProgress(workerProgress);
      } else if (type === "PDF_GENERATED" && data) {
        try {
          // Worker가 완료되면 동기 방식으로 최종 PDF 생성
          const pdf = await imagesToPdfSync(imgFiles);
          setPdf(pdf);
          setIsLoading(false);
          setProgress(100);
        } catch (err) {
          console.error("PDF 처리 중 오류:", err);
          setIsLoading(false);
          setProgress(0);
        }
      } else if (type === "ERROR") {
        console.error("PDF 변환 중 오류 발생:", error);
        setIsLoading(false);
        setProgress(0);
      }
    };

    workerRef.current.onerror = (error) => {
      console.error("Worker 오류:", error);
      setIsLoading(false);
      setProgress(0);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [imgFiles, imagesToPdfSync]);

  const generatePdf = useCallback(async () => {
    if (!workerRef.current) {
      console.error("Worker가 초기화되지 않았습니다.");
      return;
    }

    setIsLoading(true);
    setProgress(0);

    try {
      // 모든 이미지를 ImageData 형식으로 변환
      const imageDataList: ImageData[] = await Promise.all(
        imgFiles.map(async (file) => {
          const degreeByMatchedImage = imageDegrees.find(
            (degree) => degree.id === file.id,
          );
          const dataUrl = await readAsDataURL(file.file);
          const img = await loadImage(dataUrl);

          return {
            id: file.id,
            dataUrl,
            width: img.width,
            height: img.height,
            degree: degreeByMatchedImage?.degree || 0,
          };
        }),
      );

      // Worker에 PDF 생성 요청
      const request: WorkerRequest = {
        type: "GENERATE_PDF",
        images: imageDataList,
      };

      workerRef.current.postMessage(request);
    } catch (error) {
      console.error("PDF 변환 중 오류 발생:", error);
      setIsLoading(false);
      setProgress(0);
    }
  }, [imgFiles, imageDegrees, readAsDataURL, loadImage]);

  return {
    imgFiles,
    uploadImageFiles,
    addImage,
    removeImage,
    switchImage,
    rotateImage,
    isLoading,
    progress,
    generatePdf,
    pdf,
  };
};
