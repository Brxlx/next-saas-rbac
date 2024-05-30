import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { ResetPasswordUseCase } from '@/domain/application/useCases/Auth/ResetPassword/ResetPasswordUseCase';

export async function ResetPasswordController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/password/reset',
    {
      schema: {
        tags: ['auth'],
        summary: 'Reset users password',
        body: z.object({
          code: z.string(),
          password: z.string().min(6),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (req, reply) => {
      const { code, password } = req.body;
      await ResetPasswordUseCase({ code, password });

      return reply.status(204).send();
    }
  );
}
