import { Button } from "@/src/components/Button";
import { useTranslations } from "next-intl";

interface DownloadSectionProps {
  totalPages: number;
  blobUrl: string;
  fileName?: string;
}

export const DownloadSection = ({
  totalPages,
  blobUrl,
  fileName,
}: DownloadSectionProps) => {
  const t = useTranslations("HomePage.downloadSection");
  const downloadFileName =
    fileName ??
    `converted-${Intl.DateTimeFormat("ko-KR").format(new Date())}.pdf`;

  return (
    <div className="flex items-center gap-2">
      <div>{t("pageCount", { count: totalPages })}</div>
      <Button
        as="a"
        href={blobUrl}
        download={downloadFileName}
        aria-label={t("downloadButtonAriaLabel")}
      >
        {t("downloadButtonText")}
      </Button>
    </div>
  );
};
