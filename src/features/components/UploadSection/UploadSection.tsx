import { Button } from "@/src/components/Button";

const FILE_INPUT_ID = "files";

interface UploadSectionProps {
  onUpload: (fileList: File[]) => void;
}

export const UploadSection = ({ onUpload }: UploadSectionProps) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpload(Array.from(e.target.files ?? []));
  };

  const handleDropToUpload = (e: React.DragEvent<HTMLLabelElement>) => {
    const files = e.dataTransfer.files;
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );
    onUpload(imageFiles);
  };

  return (
    <Button
      type="button"
      as="label"
      className="w-full bg-amber-50 hover:bg-amber-100 flex flex-col items-center justify-center h-70 border-2 border-gray-300 rounded-md border-dotted"
      htmlFor={FILE_INPUT_ID}
      onDrop={handleDropToUpload}
    >
      <p className="text-center text-gray-500">
        이미지 파일을 드래그하거나 클릭하여 선택하세요
      </p>
      <input
        id={FILE_INPUT_ID}
        name={FILE_INPUT_ID}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          console.log("change", e);
          handleFileUpload(e);
        }}
        onDrop={(e) => {
          console.log("drop", e);
        }}
        className="hidden"
      />
    </Button>
  );
};
