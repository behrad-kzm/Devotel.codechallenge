import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import { validationOptions, HttpExceptionFilter, Logger } from './utils';
import { ClusterService } from './cluster/cluster.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ServiceContractResponseInterceptor } from './utils/interceptors/service-contract-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalInterceptors(new ServiceContractResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService);
  app.enableShutdownHooks();
  app.setGlobalPrefix(configService.get('app.apiPrefix')!, {
    exclude: ['/'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  console.log({
    port: configService.get('service'),
  })
  app.useGlobalPipes(new ValidationPipe(validationOptions.default));
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));
  Logger.setup();
  const swaggerConfig = new DocumentBuilder()
      .setTitle('Swagger API')
      .setDescription('API docs')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
  
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.get('app.port')!);
  
}
ClusterService.buildClusters(bootstrap);
