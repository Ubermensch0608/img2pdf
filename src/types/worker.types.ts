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
  data?: ArrayBuffer; // PDF ArrayBuffer for success
  error?: string;
  progress?: number; // 0-100
}
