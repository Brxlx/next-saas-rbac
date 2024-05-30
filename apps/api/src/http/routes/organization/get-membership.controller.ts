import { roleSchema } from '@saas/auth';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { GetMembershipUseCase } from '@/domain/application/useCases/Organization/GetMembership/GetMembershipUseCase';
import { authMiddleware } from '@/http/middlewares/auth';

export async function GetMembershipController(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .get(
      '/organizations/:slug/membership',

      {
        schema: {
          tags: ['organization'],
          summary: 'Get user membership on organization',
          security: [{ bearerToken: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              membership: z.object({
                id: z.string().uuid(),
                organizationId: z.string().uuid(),
                role: roleSchema,
              }),
            }),
            401: z.object({
              message: z.string().default('Unauthorized'),
              statusCode: z.number().default(401),
            }),
          },
        },
      },
      async (req, reply) => {
        const { slug } = req.params;
        const { membership } = await req.getUserMembership(slug);

        const { membership: userMembership } = await GetMembershipUseCase({ membership });

        return reply.status(200).send({ membership: userMembership });
      }
    );
}
