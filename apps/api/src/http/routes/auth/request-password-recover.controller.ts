import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { RequestPasswordRecoverUseCase } from '@/domain/application/useCases/RequestPasswordRecover/RequestPasswordRecoverUseCase';

export async function RequestPasswordRecoverController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/password/recover',
    {
      schema: {
        tags: ['auth'],
        summary: 'Get authenticated user profile',
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (req, reply) => {
      const { email } = req.body;
      await RequestPasswordRecoverUseCase({ email });

      return reply.status(201).send();
    }
  );
}
