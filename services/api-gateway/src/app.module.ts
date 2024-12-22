import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ImageModule } from './image/image.module';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';
import serviceConfig from './config/service.config';

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        serviceConfig
      ],
      envFilePath: ['envs/.app.env', 'envs/.service-discovery.env'],
    }),
    
    UserModule,
    
    PostModule,
    
    ImageModule,
    
    AuthModule,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
