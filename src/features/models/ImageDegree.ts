import { nanoid } from "@/src/components/utils/nanoid";

export class ImageDegree {
  constructor(
    public id: string = nanoid(),
    private _degree: number = 0,
  ) {}

  get degree() {
    return this._degree;
  }

  updateDegree(degree: number) {
    this._degree = degree;
  }
}
