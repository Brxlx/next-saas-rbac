import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { GetOrganizationUseCase } from '@/domain/application/useCases/Organization/GetOrganization/GetOrganizationUseCase';
import { authMiddleware } from '@/http/middlewares/auth';

export async function GetOrganizationController(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .get(
      '/organizations/:slug',

      {
        schema: {
          tags: ['organization'],
          summary: 'Get details from an organization',
          security: [{ bearerToken: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              organization: z.object({
                id: z.string().uuid(),
                name: z.string(),
                slug: z.string(),
                domain: z.string().nullable(),
                shouldAttachUsersByDomain: z.boolean(),
                avatarUrl: z.string().nullable(),
                createdAt: z.date(),
                updatedAt: z.date().nullish(),
                ownerId: z.string().uuid(),
              }),
            }),
          },
        },
      },

      async (req, reply) => {
        const { slug } = req.params;
        const { organization } = await req.getUserMembership(slug);

        const { organization: organizationDetails } = await GetOrganizationUseCase({
          organization,
        });
        return reply.status(200).send({ organization: organizationDetails });
      }
    );
}
