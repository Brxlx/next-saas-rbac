import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { AuthenticateWithGithubUseCase } from '@/domain/application/useCases/Auth/AuthenticateWithGithub/AuthenticateWithGithubUseCase';

export async function AuthenticateWithGithubController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with github',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
          400: z.object({
            statusCode: z.number().default(400),
            message: z.string(),
          }),
        },
      },
    },
    async (req, reply) => {
      const { code } = req.body;

      const { user } = await AuthenticateWithGithubUseCase({ code });

      const token = await reply.jwtSign(
        {
          sub: user.id.toString(),
        },
        {
          sign: {
            expiresIn: '7d',
          },
        }
      );

      return reply.status(201).send({ token });
    }
  );
}
