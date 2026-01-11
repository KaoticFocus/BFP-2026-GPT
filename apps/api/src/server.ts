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
import { orgRoutes } from './routes/orgs';
import { syncRoutes } from './routes/sync';
import { uploadRoutes } from './routes/uploads';
import { intakeRoutes } from './routes/intake';
import { aiRoutes } from './routes/ai';
import { docsRoutes } from './routes/docs';
import { transformerRoutes } from './routes/transformers';
import { approvalRoutes } from './routes/approvals';
import { messageRoutes } from './routes/messages';
import { meetingRoutes } from './routes/meetings';
import { taskRoutes } from './routes/tasks';
import { checklistRoutes } from './routes/checklists';
import { punchRoutes } from './routes/punch';
import { dailyPlanRoutes } from './routes/dailyPlans';
import { leadRoutes } from './routes/leads';
import { salesDocsRoutes } from './routes/salesDocs';
import { scheduleRoutes } from './routes/schedules';
import { timeRoutes } from './routes/time';
import { jobCostRoutes } from './routes/jobCost';
import { changeOrderRoutes } from './routes/changeOrders';
import { procurementRoutes } from './routes/procurement';
import { sopRoutes } from './routes/sops';
import { closeoutRoutes } from './routes/closeout';

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
  await fastify.register(orgRoutes, { prefix: '/v1/orgs' });
  await fastify.register(syncRoutes, { prefix: '/v1/sync' });
  await fastify.register(uploadRoutes, { prefix: '/v1/uploads' });
  await fastify.register(intakeRoutes, { prefix: '/v1/intake' });
  await fastify.register(aiRoutes, { prefix: '/v1/ai' });
  await fastify.register(docsRoutes, { prefix: '/v1/docs' });
  await fastify.register(transformerRoutes, { prefix: '/v1/transformers' });
  await fastify.register(approvalRoutes, { prefix: '/v1/approvals' });
  await fastify.register(messageRoutes, { prefix: '/v1/messages' });
  await fastify.register(meetingRoutes, { prefix: '/v1/meetings' });
  await fastify.register(taskRoutes, { prefix: '/v1/tasks' });
  await fastify.register(checklistRoutes, { prefix: '/v1/checklists' });
  await fastify.register(punchRoutes, { prefix: '/v1/punch' });
  await fastify.register(dailyPlanRoutes, { prefix: '/v1/daily-plans' });
  await fastify.register(leadRoutes, { prefix: '/v1/leads' });
  await fastify.register(salesDocsRoutes, { prefix: '/v1/sales-docs' });
  await fastify.register(scheduleRoutes, { prefix: '/v1/schedules' });
  await fastify.register(timeRoutes, { prefix: '/v1/time' });
  await fastify.register(jobCostRoutes, { prefix: '/v1/job-cost' });
  await fastify.register(changeOrderRoutes, { prefix: '/v1/change-orders' });
  await fastify.register(procurementRoutes, { prefix: '/v1/procurement' });
  await fastify.register(sopRoutes, { prefix: '/v1/sops' });
  await fastify.register(closeoutRoutes, { prefix: '/v1/closeout' });

  return fastify;
}

async function main() {
  const server = await buildServer();
  initializeConsumers();
  startOutboxPublisher();
  
  const shutdown = async () => {
    stopOutboxPublisher();
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
