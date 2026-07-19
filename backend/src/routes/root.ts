import type { FastifyPluginAsync } from 'fastify';
import { getRoot } from '../controllers/root.controller.js';

export const rootRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', getRoot);
};