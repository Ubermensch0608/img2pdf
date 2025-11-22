"use client";

import { useState } from "react";
import { ImageFile } from "../models/ImageFile";
import jsPDF from "jspdf";

import { create } from "zustand";
import { ImageDegree } from "../models/ImageDegree";

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
      const targetImageDegree = state.imageDegrees.find(
        (degree) => degree.id === id,
      );
      if (targetImageDegree) {
        targetImageDegree.updateDegree(degree);
      }
      return state;
    });
  },
}));

export const useImageFiles = () => {
  const [isLoading, setIsLoading] = useState(false);

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

  const imagesToPdf = async (imgFiles: ImageFile[]) => {
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
  };

  const readAsDataURL = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject;
      reader.readAsDataURL(file);
    });
  };

  const loadImage = (src: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject;
      img.src = src;
    });
  };

  const generatePdf = async () => {
    setIsLoading(true);
    try {
      const pdf = await imagesToPdf(imgFiles);
      setPdf(pdf);
    } catch (error) {
      console.error("PDF 변환 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    imgFiles,
    uploadImageFiles,
    addImage,
    removeImage,
    switchImage,
    rotateImage,
    isLoading,
    generatePdf,
    pdf,
  };
};
