import jsPDF from "jspdf";

export interface ImageData {
  id: string;
  dataUrl: string;
  width: number;
  height: number;
  degree: number;
}

export interface WorkerRequest {
  type: "GENERATE_PDF";
  images: ImageData[];
}

export interface WorkerResponse {
  type: "PDF_GENERATED" | "ERROR" | "PROGRESS";
  data?: string; // PDF blob URL for success
  error?: string;
  progress?: number; // 0-100
}

self.addEventListener("message", async (event: MessageEvent<WorkerRequest>) => {
  const { type, images } = event.data;

  if (type === "GENERATE_PDF") {
    try {
      const pdf = new jsPDF("p", "px", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        // Progress 업데이트
        self.postMessage({
          type: "PROGRESS",
          progress: Math.round((i / images.length) * 100),
        } as WorkerResponse);

        // 비율 유지하며 맞추기
        const aspectRatio = Math.min(
          pageWidth / image.width,
          pageHeight / image.height,
        );
        const w = image.width * aspectRatio;
        const h = image.height * aspectRatio;

        if (i !== 0) {
          pdf.addPage();
        }

        pdf.addImage(
          image.dataUrl,
          "JPEG",
          0,
          0,
          w,
          h,
          undefined,
          "FAST",
          image.degree,
        );
      }

      // PDF를 ArrayBuffer로 변환
      const pdfOutput = pdf.output("arraybuffer");

      // 완료 - transfer 옵션 사용
      self.postMessage({
        type: "PDF_GENERATED",
        data: pdfOutput,
        progress: 100,
      } as unknown as WorkerResponse);
    } catch (error) {
      self.postMessage({
        type: "ERROR",
        error: error instanceof Error ? error.message : "Unknown error",
      } as WorkerResponse);
    }
  }
});
