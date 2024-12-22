import { ImageDetails } from "../../entities/image.entity";

export class ImageResponseDto {
  url: string;
  constructor(rawValue: ImageDetails) {
    this.url = rawValue.url;
  }
}
