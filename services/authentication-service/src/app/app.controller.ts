import { Controller, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { VerifyTokenRequestDto } from './dto/request/verify-token.request.dto';
import { VerifyTokenResponseDto } from './dto/response/verify-token.response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('auth.verify.firebase.idToken')
  async verifyFirebaseIdToken(
    @Payload(new ValidationPipe({ whitelist: true })) dto: VerifyTokenRequestDto,
  ): Promise<VerifyTokenResponseDto> {
    const response = await this.appService.verifyFirebaseIdToken({ dto });
    return new VerifyTokenResponseDto(response);
  }
}
