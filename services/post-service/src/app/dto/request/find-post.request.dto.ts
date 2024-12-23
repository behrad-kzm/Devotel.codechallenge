import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsUUID, Max, Min } from "class-validator";

export class FindPostByIdRequestDto {
  @ApiProperty({ example: '67603962-ee54-8001-8882-c0923fc882a0' })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class FindManyPostsRequestDto {
  @ApiProperty({ example: '67603962-ee54-8001-8882-c0923fc882a0' })
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @Min(1)
  @Max(1000)
  page: number;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @Min(1)
  @Max(100)
  limit: number;

}