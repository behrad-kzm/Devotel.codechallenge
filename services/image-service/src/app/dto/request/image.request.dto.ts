import { IsNotEmpty, IsString } from "class-validator";

export class GetImageRequestDto {
  @IsNotEmpty()
  @IsString()
  fileName: string;
}
