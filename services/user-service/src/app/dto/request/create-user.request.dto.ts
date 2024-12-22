import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsAlpha, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { USER_ROLE } from "../../enums/user-roles.enum";

export class CreateUserRequestDto {
  @ApiProperty({ example: 'authId' })
  @IsNotEmpty()
  @IsString()
  sub: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsAlpha()
  name: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({ enum: USER_ROLE, example: Object.values(USER_ROLE) })
  @IsNotEmpty()
  @IsEnum(USER_ROLE)
  role!: USER_ROLE;
}
