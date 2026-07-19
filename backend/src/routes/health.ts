import type { FastifyPluginAsync } from 'fastify';
import { getHealth } from '../controllers/health.controller.js';

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/health', getHealth);
};