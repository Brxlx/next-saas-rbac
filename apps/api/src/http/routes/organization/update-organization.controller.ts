import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { UpdateOrganizationUseCase } from '@/domain/application/useCases/Organization/UpdateOrganization/UpdateOrganizationUseCase';
import { authMiddleware } from '@/http/middlewares/auth';

export async function UpdateOrganizationController(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .put(
      '/organizations/:slug',

      {
        schema: {
          tags: ['organization'],
          summary: 'Update organization details',
          security: [{ bearerToken: [] }],
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
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
        const { name, domain, shouldAttachUsersByDomain } = req.body;

        await UpdateOrganizationUseCase({
          userId,
          name,
          domain,
          slug,
          shouldAttachUsersByDomain,
          membership,
          organization,
        });

        return reply.status(201).send();
      }
    );
}
