export class ImageFile {
  options: {
    degree: number;
  } = {
    degree: 0,
  };
  constructor(
    public file: File,
    options?: {
      degree: number;
    },
  ) {
    if (options) {
      this.options = options;
    }
  }
}
