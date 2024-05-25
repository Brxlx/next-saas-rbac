import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { AuthenticateWithPasswordUseCase } from '@/domain/application/useCases/Auth/AuthenticateWithPassword/AuthenticateWithPasswordUseCase';

export async function AuthenticateWithPasswordController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with email and password',
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
          400: z.object({
            statusCode: z.number(),
            error: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (req, reply) => {
      const { email, password } = req.body;

      const { user } = await AuthenticateWithPasswordUseCase({ email, password });

      // TODO: Verify if necessary to put on presenter
      const token = await reply.jwtSign(
        {
          sub: user.id,
        },
        { sign: { expiresIn: '7d' } }
      );

      return reply.status(201).send({ token });
    }
  );
}
