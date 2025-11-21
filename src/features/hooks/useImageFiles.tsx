"use client";

import { useState } from "react";
import { ImageFile } from "../models/ImageFile";
import jsPDF from "jspdf";

export const useImageFiles = () => {
  const [imgFiles, setImgFiles] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [pdf, setPdf] = useState<jsPDF | null>(null);

  const handleFileUpload = (fileList: FileList | null) => {
    if (!fileList) return;

    const imageFiles = [...fileList].map((file) => new ImageFile(file));
    setImgFiles(imageFiles);
  };

  const imagesToPdf = async (imgFiles: ImageFile[]) => {
    const pdf = new jsPDF("p", "px", "a4");

    for (let i = 0; i < imgFiles.length; i++) {
      const dataUrl = await readAsDataURL(imgFiles[i].file);
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
      pdf.addImage(img, "JPEG", 0, 0, w, h);
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

  const handleAddImage = (index: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      const nextIndex = index + 1;

      if (file) {
        const insertNewImage = (images: ImageFile[]) => [
          ...images.slice(0, nextIndex),
          new ImageFile(file),
          ...images.slice(nextIndex),
        ];
        setImgFiles(insertNewImage);
      }
    };
  };

  const handleRemoveImage = (index: number) => {
    setImgFiles(imgFiles.filter((_, i) => i !== index));
  };

  return {
    imgFiles,
    uploadImageFiles: handleFileUpload,
    addImage: handleAddImage,
    removeImage: handleRemoveImage,
    isLoading,
    generatePdf,
    pdf,
  };
};
