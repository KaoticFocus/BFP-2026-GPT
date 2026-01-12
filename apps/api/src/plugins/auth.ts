import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { prisma } from '@buildflow/db';
import { AuthContext, ROLE_PERMISSIONS, UserRole } from '@buildflow/shared';

declare module 'fastify' {
  interface FastifyRequest {
    auth?: AuthContext;
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('auth', undefined);

  fastify.addHook('onRequest', async (request) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return;

    const token = authHeader.slice(7);
    
    // Check for demo token
    if (token === 'demo-owner-token') {
      const session = await prisma.session.findUnique({
        where: { token },
      });
      if (session && session.expiresAt > new Date()) {
        const membership = await prisma.membership.findFirst({
          where: { userId: session.userId, orgId: session.orgId },
        });
        if (membership) {
          request.auth = {
            userId: session.userId,
            orgId: session.orgId,
            role: membership.role as UserRole,
            permissions: ROLE_PERMISSIONS[membership.role as UserRole] || [],
          };
        }
      }
      return;
    }

    // JWT verification
    try {
      const decoded = await request.jwtVerify<{ sub: string; org: string; role: string }>();
      request.auth = {
        userId: decoded.sub,
        orgId: decoded.org,
        role: decoded.role as UserRole,
        permissions: ROLE_PERMISSIONS[decoded.role as UserRole] || [],
      };
    } catch {
      // Invalid token - auth remains undefined
    }
  });
};

export default fp(authPlugin, { name: 'auth' });
