import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Global()
@Module({
  providers: [
    {
      provide: 'AUTH_SERVICE', 
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('service.auth.host'),
            port: configService.get<number>('service.auth.port'),
          },
        });
      },
    },
  ],
  exports: ['AUTH_SERVICE'], 
})
export class AuthModule {}
