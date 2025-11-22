import { RefObject } from "react";
import { ImageFile } from "../../models/ImageFile";
import { ImageItem } from "../ImageItem/ImageItem";
import { useDrop } from "react-dnd";
import { UploadSection } from "../UploadSection/UploadSection";

interface ImageGridProps {
  imgFiles: ImageFile[];
  onAddImage: (index: number) => void;
  onRemoveImage: (id: string) => void;
  onRotate?: (id: string, degree: number) => void;
  onSwitchImage?: (dragId: string, dropId: string) => void;
  onUpload: (fileList: File[]) => void;
}

export const ImageGrid = ({
  imgFiles,
  onAddImage,
  onRemoveImage,
  onRotate,
  onSwitchImage,
  onUpload,
}: ImageGridProps) => {
  const [, dropRef] = useDrop<{ dragId: string }>(() => ({
    accept: "IMAGE_ITEM",
    drop: (item) => {
      console.log(item);
    },
  }));
  const isEmpty = imgFiles.length === 0;

  return (
    <article className="w-full">
      <h2 className="text-lg font-bold">업로드한 이미지</h2>
      {isEmpty ? (
        <UploadSection onUpload={onUpload} />
      ) : (
        <ul className="grid grid-cols-4 gap-4 justify-center">
          {imgFiles.map((file, index) => (
            <ImageItemWrapper
              key={file.id}
              dropId={file.id}
              onSwitchImage={onSwitchImage}
            >
              <ImageItem
                key={file.id}
                file={file}
                index={index}
                onClickAddImageButton={onAddImage}
                onClickRemoveButton={() => onRemoveImage(file.id)}
                onRotate={(degree) => onRotate?.(file.id, degree)}
              />
            </ImageItemWrapper>
          ))}
        </ul>
      )}
    </article>
  );
};

const ImageItemWrapper = ({
  children,
  onSwitchImage,
  dropId,
}: {
  children: React.ReactNode;
  onSwitchImage?: (dragId: string, dropId: string) => void;
  dropId: string;
}) => {
  const [, dropRef] = useDrop<{ dragId: string }>(() => ({
    accept: "IMAGE_ITEM",
    canDrop(item) {
      return item.dragId !== dropId;
    },
    drop: (item) => {
      const dragId = item.dragId;
      onSwitchImage?.(dragId, dropId);
    },
  }));

  return (
    <li ref={dropRef as unknown as RefObject<HTMLLIElement>}>{children}</li>
  );
};
