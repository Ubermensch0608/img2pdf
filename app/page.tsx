"use client";

import { jsPDF, jsPDFOptions } from "jspdf";
import { Button } from "@/components/Button";
import { useState } from "react";
import { ImageItem } from "@/src/features/components/ImageItem/ImageItem";

const FILE_INPUT_ID = "files";
const IMAGE_BLACK_LIST = ["svg+xml"];

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [pdf, setPdf] = useState<jsPDF | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const pdfConfigs: jsPDFOptions = {
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      };
      const pdf = new jsPDF(pdfConfigs);

      for (const file of files) {
        const fileType = file.type.replace("image/", "");

        if (IMAGE_BLACK_LIST.includes(fileType)) {
          continue;
        }

        const imageUrl = URL.createObjectURL(file);

        try {
          const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject;
            img.src = imageUrl;

            // 이미지를 a4 용지 크기에 맞게 조정
            const aspectRatio = img.width / img.height;
            const newWidth = 210;
            const newHeight = newWidth / aspectRatio;

            if (pdf.getCurrentPageInfo().pageNumber >= 1) {
              pdf.addPage();
            }
            pdf.addImage(
              img,
              fileType.toUpperCase(),
              0,
              0,
              img.width,
              img.height,
            );
          });
        } finally {
          URL.revokeObjectURL(imageUrl);
        }
      }

      pdf.save(
        `converted-${Intl.DateTimeFormat("ko-KR").format(new Date())}.pdf`,
      );
      setPdf(pdf);
    } catch (error) {
      console.error("PDF 변환 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFiles([...files]);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center p-4 gap-4">
      {isLoading && (
        // 50% 반투명 검정색 배경
        <div className="fixed inset-0 flex items-center justify-center gap-4 bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
          <div className="text-white text-2xl font-bold">변환 중...</div>
        </div>
      )}
      <header className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">이미지 → PDF 변환기</h1>
        <p className="text-sm text-gray-500">
          이미지를 JPG/PNG 파일로 업로드하여 PDF로 빠르게 변환하세요. 모든
          작업은 로컬에서 처리되어 안전하고 빠릅니다.
        </p>
      </header>
      <article className="flex flex-col justify-center gap-4 w-full">
        <div className="flex flex-col justify-center gap-2">
          <Button type="button" as="label" htmlFor={FILE_INPUT_ID}>
            이미지 업로드
          </Button>
          <input
            id={FILE_INPUT_ID}
            name={FILE_INPUT_ID}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        <article className="w-full">
          <h2 className="text-lg font-bold">업로드한 이미지</h2>
          <ul className="grid grid-cols-4 gap-4 justify-center">
            {files.map((file) => (
              <li key={file.name}>
                <ImageItem
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width={"200"}
                  height={"200"}
                />
              </li>
            ))}
          </ul>
        </article>

        <form onSubmit={handleSubmit}>
          <Button type="submit">PDF 변환</Button>
        </form>

        <article className="flex flex-col justify-center gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">변환된 PDF</h2>
            <p className="text-sm text-gray-500">
              변환된 PDF 파일을 다운로드하세요.
            </p>
          </div>
          {pdf && (
            <div className="flex items-center gap-2">
              <div>{pdf.getNumberOfPages()} 페이지</div>
              <Button
                as="a"
                href={pdf.output("bloburl").toString()}
                download={`converted-${Intl.DateTimeFormat("ko-KR").format(new Date())}.pdf`}
              >
                다운로드
              </Button>
            </div>
          )}
        </article>
      </article>
    </main>
  );
}
