import { FastifyPluginAsync } from 'fastify';
import { prisma } from '@buildflow/db';

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  fastify.get('/ready', async (request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'ready', database: 'connected' };
    } catch (error) {
      return reply.status(503).send({ status: 'not_ready', database: 'disconnected' });
    }
  });
};
