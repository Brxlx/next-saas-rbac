import { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';

import { ApiError } from '@/domain/application/useCases/errors/apiError';
import { prisma } from '@/lib/prisma';

import { UnauthorizedError } from '../routes/_errors/unauthorized-error';

export const authMiddleware = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (req) => {
    req.getCurrentUserId = async () => {
      try {
        const { sub } = await req.jwtVerify<{ sub: string }>();
        return sub;
      } catch (err) {
        throw new ApiError('Invalid permissions', 401);
      }
    };

    req.getUserMembership = async (slug: string) => {
      const userId = await req.getCurrentUserId();

      const member = await prisma.member.findFirst({
        where: {
          userId,
          organization: {
            slug,
          },
        },
        include: {
          organization: true,
        },
      });

      if (!member)
        throw new ApiError(
          new UnauthorizedError('You are not member of this organization').message,
          401
        );

      const { organization, ...membership } = member;

      return {
        organization,
        membership,
      };
    };
  });
});
