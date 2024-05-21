import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { CreateAccountUseCase } from '@/domain/application/useCases/CreateAccount/CreateAccountUseCase';

export async function CreateAccountController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['auth'],
        summary: 'Create a new account',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
          avatarUrl: z.string().nullable(),
        }),
      },
    },
    async (req, reply) => {
      const { name, email, password, avatarUrl } = req.body;

      await CreateAccountUseCase({ name, email, password, avatarUrl });

      return reply.status(201).send();
    }
  );
}
