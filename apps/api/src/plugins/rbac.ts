import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { Permission } from '@buildflow/shared';

declare module 'fastify' {
  interface FastifyInstance {
    requireAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requirePermission: (permission: Permission) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const rbacPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('requireAuth', async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.auth) {
      return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
    }
  });

  fastify.decorate('requirePermission', (permission: Permission) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      if (!request.auth) {
        return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
      }
      if (!request.auth.permissions.includes(permission)) {
        return reply.status(403).send({ error: { code: 'FORBIDDEN', message: `Missing permission: ${permission}` } });
      }
    };
  });
};

export default fp(rbacPlugin, { name: 'rbac', dependencies: ['auth'] });
