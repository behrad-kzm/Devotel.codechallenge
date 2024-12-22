import { Controller, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { UserResponseDto } from './dto/response/user.response.dto';
import { FindOneUserRequestDto } from './dto/request/find-user.request.dto';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @MessagePattern('user.create')
  async createUser(
    @Payload(new ValidationPipe({ whitelist: true })) dto: CreateUserRequestDto,
  ) {
    const response = await this.service.createUser({ dto });
    return new UserResponseDto(response);
  }

  @MessagePattern('user.find.one')
  async findOneUser(
    @Payload(new ValidationPipe({ whitelist: true, transform: true })) dto: FindOneUserRequestDto,
  ) {
    
    const response = await this.service.findOneUser({ dto });
    return new UserResponseDto(response);
  }
}
