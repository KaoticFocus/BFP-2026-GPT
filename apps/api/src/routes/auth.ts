import { FastifyPluginAsync } from 'fastify';
import { prisma } from '@buildflow/db';
import { z } from 'zod';

const LoginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  orgSlug: z.string().min(1).optional(),
  orgName: z.string().min(1).optional(),
});

/**
 * Minimal auth routes for deployment.
 *
 * NOTE: This implementation is a demo-friendly flow:
 * - Creates (or reuses) a user + org + membership
 * - Returns a stable demo token stored in the Session table
 *
 * This is enough to unblock the Netlify frontend sign-in and subsequent API calls.
 */
export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/login', async (request, reply) => {
    const parsed = LoginBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid request body' });
    }

    const { email, orgSlug, orgName } = parsed.data;

    // Create or reuse org
    const slug = orgSlug ?? 'demo-org';
    const org =
      (await prisma.organization.findUnique({ where: { slug } })) ??
      (await prisma.organization.create({
        data: { slug, name: orgName ?? 'Demo Organization' },
      }));

    // Create or reuse user
    const user =
      (await prisma.user.findUnique({ where: { email } })) ??
      (await prisma.user.create({
        data: { email, name: email.split('@')[0] ?? 'Demo User' },
      }));

    // Ensure membership (default: owner)
    const membership =
      (await prisma.membership.findFirst({
        where: { userId: user.id, orgId: org.id },
      })) ??
      (await prisma.membership.create({
        data: { userId: user.id, orgId: org.id, role: 'owner' },
      }));

    // Stable demo token (also used by auth plugin)
    const token = 'demo-owner-token';

    // Upsert session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.session.upsert({
      where: { token },
      update: { userId: user.id, orgId: org.id, expiresAt },
      create: { userId: user.id, orgId: org.id, token, expiresAt },
    });

    return {
      accessToken: token,
      user: { id: user.id, email: user.email, name: user.name },
      org: { id: org.id, name: org.name, slug: org.slug },
      role: membership.role,
    };
  });

  fastify.get('/me', async (request, reply) => {
    if (!request.auth) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({ where: { id: request.auth.userId } });
    const org = await prisma.organization.findUnique({ where: { id: request.auth.orgId } });
    if (!user || !org) {
      return reply.status(404).send({ error: 'Not found' });
    }

    return {
      user: { id: user.id, email: user.email, name: user.name },
      org: { id: org.id, name: org.name, slug: org.slug },
      role: request.auth.role,
      permissions: request.auth.permissions,
    };
  });
};

