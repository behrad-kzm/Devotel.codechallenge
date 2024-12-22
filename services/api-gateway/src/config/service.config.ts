import { registerAs } from "@nestjs/config";

export default registerAs('service', () => ({
  auth: {
    host: process.env.AUTH_SERVICE_HOST || 'localhost',
    port: parseInt(process.env.AUTH_SERVICE_PORT, 10) || 3001,
  },
  user: {
    host: process.env.USER_SERVICE_HOST || 'localhost',
    port: parseInt(process.env.USER_SERVICE_PORT, 10) || 3002,
  },
  post: {
    host: process.env.POST_SERVICE_HOST || 'localhost',
    port: parseInt(process.env.POST_SERVICE_PORT, 10) || 3003,
  },
  image: {
    host: process.env.IMAGE_SERVICE_HOST || 'localhost',
    port: parseInt(process.env.IMAGE_SERVICE_PORT, 10) || 3004,
  },

}));
