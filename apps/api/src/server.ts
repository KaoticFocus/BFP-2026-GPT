// BuildFlow Pro AI - API Server

import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import authPlugin from './plugins/auth';
import rbacPlugin from './plugins/rbac';

import { healthRoutes } from './routes/health';
import { authRoutes } from './routes/auth';

import { initializeConsumers } from './events/consumerRegistry';
import { startOutboxPublisher, stopOutboxPublisher } from './workers/outboxPublisher';

const PORT = parseInt(process.env.PORT ?? '4000', 10);
const HOST = process.env.HOST ?? '0.0.0.0';

async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
      transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
    },
  });

  await fastify.register(cors, { origin: process.env.WEB_URL ?? 'http://localhost:3000', credentials: true });
  await fastify.register(jwt, { secret: process.env.JWT_SECRET ?? 'dev-jwt-secret-change-in-production' });
  await fastify.register(multipart, { limits: { fileSize: 50 * 1024 * 1024 } });
  await fastify.register(swagger, {
    openapi: {
      info: { title: 'BuildFlow Pro AI API', version: '0.1.0' },
      components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
    },
  });
  await fastify.register(swaggerUi, { routePrefix: '/docs' });
  await fastify.register(authPlugin);
  await fastify.register(rbacPlugin);

  // Register routes
  await fastify.register(healthRoutes, { prefix: '/v1/health' });
  await fastify.register(authRoutes, { prefix: '/v1/auth' });

  return fastify;
}

async function main() {
  const server = await buildServer();
  if (!process.env.DATABASE_URL) {
    server.log.error(
      'Missing required env DATABASE_URL. API will run, but DB-backed features (auth/outbox/etc.) will not work until it is set.'
    );
  } else {
    initializeConsumers();
    startOutboxPublisher();
  }
  
  const shutdown = async () => {
    if (process.env.DATABASE_URL) {
      stopOutboxPublisher();
    }
    await server.close();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  try {
    await server.listen({ port: PORT, host: HOST });
    console.log(`🚀 BuildFlow Pro AI API running at http://${HOST}:${PORT}`);
    console.log(`📚 API docs at http://${HOST}:${PORT}/docs`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
