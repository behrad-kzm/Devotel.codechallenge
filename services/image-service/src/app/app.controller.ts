import { Controller, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ImageValidationPipe } from '../utils/pipes/image-validation.pipe';
import { ImageResponseDto } from './dto/response/image.response.dto';
import { GetImageRequestDto } from './dto/request/image.request.dto';
import { streamToRx } from 'rxjs-stream';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @MessagePattern('image.upload')
  async uploadImage(
    @Payload(new ImageValidationPipe()) file: Express.Multer.File,
  ) {
    const response = await this.service.uploadImage({ file });
    return new ImageResponseDto(response);
  }

  @MessagePattern('image.get')
  async findOneImage(
    @Payload(new ValidationPipe({ whitelist: true, transform: true })) dto: GetImageRequestDto,
  ) {
    const stream = await this.service.getImage({ dto });
    return streamToRx(stream.getStream());
  }
}
