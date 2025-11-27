"use client";

import { useImageFiles } from "../hooks/useImageFiles";
import { Button } from "@/components/Button";
import { DownloadSection } from "@/src/features/components/DownloadSection/DownloadSection";
import { ImageGrid } from "@/src/features/components/ImageGrid/ImageGrid";
import { Loader } from "@/src/features/components/Loader/Loader";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const InnerContent = () => {
  const t = useTranslations("HomePage.innerContent");
  const {
    imgFiles,
    uploadImageFiles,
    rotateImage,
    addImage,
    switchImage,
    removeImage,
    isLoading,
    generatePdf,
    pdf,
  } = useImageFiles();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      await generatePdf();
    },
    [generatePdf],
  );

  return (
    <>
      {isLoading && <Loader />}
      <article className="flex flex-col justify-center gap-4 w-full">
        <DndProvider backend={HTML5Backend}>
          <ImageGrid
            imgFiles={imgFiles}
            onAddImage={addImage}
            onRemoveImage={removeImage}
            onRotate={rotateImage}
            onSwitchImage={switchImage}
            onUpload={uploadImageFiles}
          />
        </DndProvider>

        <form onSubmit={handleSubmit}>
          <Button type="submit">{t("convertButton")}</Button>
        </form>

        <article className="flex flex-col justify-center gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">{t("convertedPdfTitle")}</h2>
            <p className="text-sm text-gray-500">{t("downloadDescription")}</p>
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
