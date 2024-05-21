import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { GetProfileUseCase } from '@/domain/application/useCases/GetProfile/GetProfileUseCase';
import { authMiddleware } from '@/http/middlewares/auth';
import { UserPresenter } from '@/http/presenters/user.presenter';

export async function GetProfileController(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .get(
      '/profile',
      {
        schema: {
          tags: ['auth'],
          summary: 'Get authenticated user profile',
          response: {
            200: z.object({
              user: z.object({
                id: z.string().uuid(),
                name: z.string().nullable(),
                email: z.string().email(),
                avatarUrl: z.string().url().nullable(),
              }),
            }),
            400: z.object({
              statusCode: z.number(),
              error: z.string(),
              message: z.string(),
            }),
          },
        },
      },
      async (req, reply) => {
        const userId = await req.getCurrentUserId();

        const { user } = await GetProfileUseCase({ userId });

        return reply.status(200).send({ user: UserPresenter.toHTTP(user) });
      }
    );
}
