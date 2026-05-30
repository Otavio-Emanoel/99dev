import type { FastifyInstance } from 'fastify';
import { healthRoutes } from './health.js';
import { rootRoutes } from './root.js';

export async function registerRoutes(app: FastifyInstance) {
  await app.register(healthRoutes);
  await app.register(rootRoutes);
}