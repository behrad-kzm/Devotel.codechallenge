import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { validationOptions, Logger, TcpExceptionFilter } from './utils';
import { ClusterService } from './cluster/cluster.service';
import { useContainer } from 'class-validator';
import { ServiceResponseInterceptor } from './utils/interceptors/service-response-contract.interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.APP_HOST ?? 'localhost',
        port: parseInt(process.env.APP_PORT ?? '3002') || 3002,
      },
    },
  );

  app.useGlobalFilters(new TcpExceptionFilter());
  app.useGlobalInterceptors(new ServiceResponseInterceptor())
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe(validationOptions.default));
  Logger.setup();

  await app.listen();
  
}
ClusterService.buildClusters(bootstrap);
