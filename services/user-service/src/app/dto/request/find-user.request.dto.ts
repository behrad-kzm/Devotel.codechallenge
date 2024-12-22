import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class FindOneUserRequestDto {
  @ApiProperty({ example: '67603962-ee54-8001-8882-c0923fc882a0' })
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty({ example: '67603962-ee54-8001-8882-c0923fc882a0' })
  @IsOptional()
  @IsString()
  sub: string;
}