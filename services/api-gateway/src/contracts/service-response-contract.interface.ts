import { HttpStatus } from "@nestjs/common";

export interface IServiceResponseContract {
  status: HttpStatus;
  data: any;
}