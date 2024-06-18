import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { ShutdownOrganizationUseCase } from '@/domain/application/useCases/ShutdownOrganization/ShutdownOrganizationUseCase';
import { authMiddleware } from '@/http/middlewares/auth';

export async function ShutdownOrganizationController(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .delete(
      '/organizations/:slug',

      {
        schema: {
          tags: ['organization'],
          summary: 'Shutdown organization',
          security: [{ bearerToken: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (req, reply) => {
        const { slug } = req.params;
        const userId = await req.getCurrentUserId();
        const { membership, organization } = await req.getUserMembership(slug);

        await ShutdownOrganizationUseCase({
          userId,
          membership,
          organization,
        });

        return reply.status(204).send();
      }
    );
}
