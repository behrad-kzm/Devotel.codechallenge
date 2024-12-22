import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl, IsUUID } from "class-validator";

export class CreatePostRequestDto {
  @ApiProperty({ example: 'Title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Description' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsNotEmpty()
  @IsUrl()
  imageUrl!: string;

  @ApiProperty({ example: '67603962-ee54-8001-8882-c0923fc882a0' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
