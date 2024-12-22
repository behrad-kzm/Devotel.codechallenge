import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: {
    master: process.env.DATABASE_HOST_MASTER,
  },
  port: parseInt(process.env.DATABASE_PORT ?? "5432", 10),
  username: `${process.env.DATABASE_USERNAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  name: `${process.env.DATABASE_NAME}`,
  synchronize: `${process.env.DATABASE_SYNCHRONIZE}` === 'true',
}));
