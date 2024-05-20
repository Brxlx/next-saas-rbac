import { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';

import { ApiError } from '@/domain/application/useCases/errors/apiError';

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
  });
});
