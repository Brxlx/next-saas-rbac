import { roleSchema } from '@saas/auth';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { GetOrganizationsUseCase } from '@/domain/application/useCases/Organization/GetOrganizations/GetOrganizationsUseCase';
import { authMiddleware } from '@/http/middlewares/auth';
import { GetOrganizationsPresenter } from '@/http/presenters/get-organizations.presenter';

export async function GetOrganizationsController(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .get(
      '/organizations',

      {
        schema: {
          tags: ['organization'],
          summary: 'Get organization where user is member',
          security: [{ bearerToken: [] }],
          response: {
            200: z.object({
              organizations: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  avatarUrl: z.string().url().nullable(),
                  role: roleSchema,
                })
              ),
            }),
          },
        },
      },

      async (req, reply) => {
        const userId = await req.getCurrentUserId();

        const { organizations } = await GetOrganizationsUseCase({
          userId,
        });
        return reply
          .status(200)
          .send({ organizations: GetOrganizationsPresenter.toHTTP(organizations) });
      }
    );
}
