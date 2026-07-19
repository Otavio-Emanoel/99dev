import type { FastifyRequest, FastifyReply } from 'fastify';

export async function getHealth(request: FastifyRequest, reply: FastifyReply) {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
}
