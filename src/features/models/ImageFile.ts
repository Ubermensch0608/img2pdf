import { nanoid } from "@/src/components/utils/nanoid";

export class ImageFile {
  public id: string;

  constructor(public file: File) {
    this.id = nanoid();
  }
}
