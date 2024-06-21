import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { TransferOrganizationUseCase } from '@/domain/application/useCases/Organization/TransferOrganization/TransferOrganizationUseCase';
import { authMiddleware } from '@/http/middlewares/auth';

export async function TransferOrganizationController(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .patch(
      '/organizations/:slug/owner',

      {
        schema: {
          tags: ['organization'],
          summary: 'Transfer organization ownership',
          security: [{ bearerToken: [] }],
          body: z.object({
            transferToUserId: z.string().uuid(),
          }),
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
        const { transferToUserId } = req.body;

        await TransferOrganizationUseCase({
          userId,
          transferToUserId,
          membership,
          organization,
        });

        return reply.status(204).send();
      }
    );
}
