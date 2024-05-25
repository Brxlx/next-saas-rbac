import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { CreateOrganizationUseCase } from '@/domain/application/useCases/Organization/CreateOrganization/CreateOrganizationUseCase';
import { authMiddleware } from '@/http/middlewares/auth';

export async function CreateOrganizationController(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .post(
      '/organizations',

      {
        schema: {
          tags: ['organization'],
          summary: 'Create a new organization',
          security: [{ bearerToken: [] }],
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          response: {
            201: z.object({
              organizationId: z.string().uuid(),
            }),
          },
        },
      },
      async (req, reply) => {
        const userId = await req.getCurrentUserId();
        const { name, domain, shouldAttachUsersByDomain } = req.body;

        const { organizationId } = await CreateOrganizationUseCase({
          name,
          domain,
          shouldAttachUsersByDomain,
          userId,
        });

        return reply.status(201).send({ organizationId: organizationId.toString() });
      }
    );
}
