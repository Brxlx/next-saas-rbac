import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { RequestPasswordRecoverUseCase } from '@/domain/application/useCases/Auth/RequestPasswordRecover/RequestPasswordRecoverUseCase';

export async function RequestPasswordRecoverController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/recover',
    {
      schema: {
        tags: ['auth'],
        summary: "Request user's password recover",
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
