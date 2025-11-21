import { Button } from "@/src/components/Button";

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
  const downloadFileName =
    fileName ??
    `converted-${Intl.DateTimeFormat("ko-KR").format(new Date())}.pdf`;

  return (
    <div className="flex items-center gap-2">
      <div>{totalPages} 페이지</div>
      <Button as="a" href={blobUrl} download={downloadFileName}>
        다운로드
      </Button>
    </div>
  );
};
