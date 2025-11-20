"use client";

import { jsPDF, jsPDFOptions } from "jspdf";
import { Button } from "@/components/Button";
import {
  ComponentProps,
  ComponentPropsWithRef,
  ElementType,
  useState,
} from "react";

const FILE_INPUT_ID = "files";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [pdf, setPdf] = useState<jsPDF | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const pdfConfigs: jsPDFOptions = {
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    };
    const pdf = new jsPDF(pdfConfigs);

    for (const file of files) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      // 이미지를 a4 용지 크기에 맞게 조정
      const aspectRatio = img.width / img.height;
      const newWidth = 210;
      const newHeight = newWidth / aspectRatio;
      img.width = newWidth;
      img.height = newHeight;

      if (pdf.getCurrentPageInfo().pageNumber >= 1) {
        pdf.addPage();
      }
      pdf.addImage(img, "PNG", 0, 0, img.width, img.height);
    }

    pdf.save(
      `converted-${Intl.DateTimeFormat("ko-KR").format(new Date())}.pdf`,
    );
    setPdf(pdf);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFiles([...files]);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center p-4 gap-4">
      <header className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">이미지 → PDF 변환기</h1>
        <p className="text-sm text-gray-500">
          이미지를 JPG/PNG 파일로 업로드하여 PDF로 빠르게 변환하세요. 모든
          작업은 로컬에서 처리되어 안전하고 빠릅니다.
        </p>
      </header>
      <article className="flex flex-col justify-center gap-4">
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

        <article>
          <h2 className="text-lg font-bold">업로드한 이미지</h2>
          <ul className="grid grid-cols-3 justify-center gap-2">
            {files.map((file) => (
              <img
                key={file.name}
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-full"
              />
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
