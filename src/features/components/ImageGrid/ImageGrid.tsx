import { Button } from "@/src/components/Button";
import { ImageFile } from "../../models/ImageFile";
import { ImageItem } from "../ImageItem/ImageItem";

interface ImageGridProps {
  imgFiles: ImageFile[];
  onAddImage: (index: number) => void;
  onRemoveImage: (id: string) => void;
  onRotate?: (id: string, degree: number) => void;
}

export const ImageGrid = ({
  imgFiles,
  onAddImage,
  onRemoveImage,
  onRotate,
}: ImageGridProps) => {
  return (
    <article className="w-full">
      <h2 className="text-lg font-bold">업로드한 이미지</h2>
      <ul className="grid grid-cols-4 gap-4 justify-center">
        {imgFiles.map((file, index) => (
          <li key={file.id} className="flex items-center gap-2">
            <ImageItem
              src={URL.createObjectURL(file.file)}
              alt={`업로드한 이미지 ${index + 1}번째 ${file.file.name}`}
              width={"200"}
              height={"200"}
              onRotate={(degree) => onRotate?.(file.id, degree)}
            />
            {/* Toolbar */}
            <div className="flex flex-col items-center gap-2">
              <Button
                className="w-10 h-10 bg-green-400 hover:bg-green-500"
                onClick={() => onAddImage(index)}
              >
                +
              </Button>
              <Button
                className="w-10 h-10 bg-red-400 hover:bg-red-500"
                onClick={() => onRemoveImage(file.id)}
              >
                -
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
};
