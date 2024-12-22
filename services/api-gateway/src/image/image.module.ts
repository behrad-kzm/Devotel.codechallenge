import { forwardRef, Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
      ClientsModule.registerAsync([
        {
          name: 'IMAGE_SERVICE',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: configService.get('service.image.host'),
              port: configService.get('service.image.port'),
            },
          }),
        }
      ]),

      forwardRef(() => AuthModule),
      forwardRef(() => UserModule),
    ],
  controllers: [ImageController],
  providers: [ImageService]
})
export class ImageModule {}
