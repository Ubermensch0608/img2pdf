import { Button } from "@/src/components/Button";

const FILE_INPUT_ID = "files";

interface UploadSectionProps {
  onUpload: (fileList: FileList | null) => void;
}

export const UploadSection = ({ onUpload }: UploadSectionProps) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpload(e.target.files);
  };

  return (
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
  );
};
