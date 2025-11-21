import { ImageFile } from "../../models/ImageFile";
import { ImageItem } from "../ImageItem/ImageItem";

interface ImageGridProps {
  imgFiles: ImageFile[];
}

export const ImageGrid = ({ imgFiles }: ImageGridProps) => {
  return (
    <article className="w-full">
      <h2 className="text-lg font-bold">업로드한 이미지</h2>
      <ul className="grid grid-cols-4 gap-4 justify-center">
        {imgFiles.map((file) => (
          <li key={file.file.name}>
            <ImageItem
              src={URL.createObjectURL(file.file)}
              alt={file.file.name}
              width={"200"}
              height={"200"}
            />
          </li>
        ))}
      </ul>
    </article>
  );
};
