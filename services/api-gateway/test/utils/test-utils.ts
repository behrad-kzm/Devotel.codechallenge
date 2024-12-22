import { ConfigService } from "@nestjs/config";
import { AppModule } from "../../src/app.module";
import { HttpExceptionFilter } from "../../src/utils/interceptors/error-handling";
import { useContainer } from "class-validator";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe, VersioningType } from "@nestjs/common";
import validationOptions from "../../src/utils/common/validation-options";
import { json, urlencoded } from "body-parser";
import request from 'supertest';
import { EntityManager, Repository } from "typeorm";
import { createHash } from "crypto";
import { getRepositoryToken } from "@nestjs/typeorm";

var sharedApp: INestApplication | undefined = undefined;

export async function getSharedApp(): Promise<INestApplication> {
  if (sharedApp !== undefined) {
    return sharedApp;
  }
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const application = moduleFixture.createNestApplication();

  application.useGlobalFilters(new HttpExceptionFilter());
  useContainer(application.select(AppModule), { fallbackOnErrors: true });
  const configService = application.get<ConfigService>(ConfigService);
  application.enableShutdownHooks();
  if (`${configService.get('app.nodeEnv')}` === 'production') {
    application.enableCors({
      origin: [configService.get('app.officeUrl')!, configService.get('app.dashboardUrl')!],
      methods: '*',
      allowedHeaders: '*',
    });
  }
  application.setGlobalPrefix(configService.get('app.apiPrefix')!, {
    exclude: ['/'],
  });
  application.enableVersioning({
    type: VersioningType.URI,
  });
  application.useGlobalFilters(new HttpExceptionFilter);
  application.useGlobalPipes(new ValidationPipe(validationOptions));
  application.use(json({ limit: '5mb' }));
  application.use(urlencoded({ extended: true, limit: '5mb' }));

  await application.listen(configService.get('app.port')!);
  sharedApp = application
  return sharedApp;
}

export async function closeSharedApp() {
  if (sharedApp === undefined) {
    return;
  }

  sharedApp.close();
  sharedApp = undefined;

}

export async function loginSuperAdmin(app: INestApplication) {

  const configService = app.get(ConfigService)
  const superuserEmail = configService.get('auth.superuserEmail');
  const superuserPassword = configService.get('auth.superuserPassword');
  const res = await request(app.getHttpServer())
    .post('/api/v1/auth/dashboard/login')
    .send({
      email: superuserEmail,
      password: superuserPassword,
    });
  return res.body.token;
}

export function getDatabaseManager(app: INestApplication): EntityManager {
  // [TODO] Replace this with your repository
  // const businessRepository = app.get<Repository<Business>>(getRepositoryToken(Business));
  // return businessRepository.manager;
  return app.get(EntityManager);
}

export async function seedDatabase(app: INestApplication) {
  const manager = getDatabaseManager(app);

  // Seed everything here
}

export async function cleanUpDatabase(app: INestApplication) {
  const manager = getDatabaseManager(app);
  await manager.transaction(async transactionalEntityManager => {
    const removeTablesQuery = [
      // [TODO] Replace this with your repository
      // transactionalEntityManager.getRepository(User),
    ].map(repository => repository.query(`DELETE from ${repository.metadata.tableName}`));

    await Promise.all(removeTablesQuery);
  });
}

export async function tearDownTest(app: INestApplication) {
  await cleanUpDatabase(app);
  await closeSharedApp();
}
export function hashObject(obj: any): string {
  // Convert the object to a JSON string
  const jsonString = JSON.stringify(obj);
  
  // Create a hash from the JSON string using SHA-256
  const hash = createHash('sha256');
  hash.update(jsonString);
  return hash.digest('hex');
}

export function setupTest() {
  expect.extend({
    toBeCloseDate(received, expected, toleranceInSeconds = 1) {
        const receivedDate = new Date(received);
        const expectedDate = new Date(expected);

        const diffInSeconds = Math.abs(receivedDate.getTime() - expectedDate.getTime()) / 1000;
        const pass = diffInSeconds <= toleranceInSeconds;

        if (pass) {
            return {
                message: () => `expected ${received} not to be close to ${expected} within ${toleranceInSeconds} second(s)`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to be close to ${expected} within ${toleranceInSeconds} second(s)`,
                pass: false,
            };
        }
    },
});
}
