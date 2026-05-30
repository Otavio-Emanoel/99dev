import type { FastifyPluginAsync } from 'fastify';

export const rootRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async () => {
    return {
      message: '99dev API is running',
    };
  });
};