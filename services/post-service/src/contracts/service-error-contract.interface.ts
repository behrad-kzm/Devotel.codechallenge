import { HttpStatus } from "@nestjs/common";

export interface IServiceErrorContract {
  status: HttpStatus;
  messages: { message: string, identifier: string }[]
}