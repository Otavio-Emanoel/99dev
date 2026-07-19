import type { FastifyRequest, FastifyReply } from 'fastify';

export async function getRoot(request: FastifyRequest, reply: FastifyReply) {
  return {
    message: '99dev API is running',
  };
}
