import { Button } from "@/src/components/Button";

const FILE_INPUT_ID = "files";
const MAX_IMAGE_UPLOAD_COUNT = 10;

const fileListToFiles = (fileList: FileList | null) => {
  return Array.from(fileList ?? []);
};

const filterOnlyImageFiles = (fileList: File[]) => {
  return fileList.filter((file) => file.type.startsWith("image/"));
};

interface UploadSectionProps {
  onUpload: (fileList: File[]) => void;
}

export const UploadSection = ({ onUpload }: UploadSectionProps) => {
  const validateFileList = (FileList: FileList | null) => {
    const files = fileListToFiles(FileList);
    if (files.length > MAX_IMAGE_UPLOAD_COUNT) {
      throw new Error(
        `최대 ${MAX_IMAGE_UPLOAD_COUNT}개의 이미지만 업로드할 수 있습니다.`,
      );
    }
    return filterOnlyImageFiles(files);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = validateFileList(e.target.files);
      onUpload(files);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const handleDropToUpload = (e: React.DragEvent<HTMLLabelElement>) => {
    const files = validateFileList(e.dataTransfer.files);
    onUpload(files);
  };

  return (
    <Button
      type="button"
      as="label"
      className="w-full bg-amber-50 hover:bg-amber-100 flex flex-col items-center justify-center h-70 border-2 border-gray-300 rounded-md border-dotted"
      htmlFor={FILE_INPUT_ID}
      onDrop={handleDropToUpload}
      aria-label="이미지 파일 업로드"
    >
      <p
        className="text-center text-gray-500"
        aria-label="이미지 파일 업로드 설명"
      >
        이미지 파일을 드래그하거나 클릭하여 선택하세요
      </p>
      <input
        id={FILE_INPUT_ID}
        name={FILE_INPUT_ID}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="sr-only"
        aria-label="이미지 파일 업로드 입력"
      />
      <span className="sr-only">이미지 파일 업로드</span>
    </Button>
  );
};
