"use client";

import { useImageFiles } from "../hooks/useImageFiles";
import { Button } from "@/components/Button";
import { DownloadSection } from "@/src/features/components/DownloadSection/DownloadSection";
import { ImageGrid } from "@/src/features/components/ImageGrid/ImageGrid";
import { Loader } from "@/src/features/components/Loader/Loader";
import { UploadSection } from "@/src/features/components/UploadSection/UploadSection";

export const InnerContent = () => {
  const {
    imgFiles,
    uploadImageFiles,
    rotateImage,
    addImage,
    removeImage,
    isLoading,
    generatePdf,
    pdf,
  } = useImageFiles();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await generatePdf();
  };

  return (
    <>
      {isLoading && <Loader />}
      <article className="flex flex-col justify-center gap-4 w-full">
        <UploadSection onUpload={uploadImageFiles} />
        <ImageGrid
          imgFiles={imgFiles}
          onAddImage={addImage}
          onRemoveImage={removeImage}
          onRotate={rotateImage}
        />

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
            <DownloadSection
              totalPages={pdf.getNumberOfPages()}
              blobUrl={pdf.output("bloburl").toString()}
            />
          )}
        </article>
      </article>
    </>
  );
};
