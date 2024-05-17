import { compare } from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { ApiError } from '@/domain/application/useCases/errors/apiError';
import { prisma } from '@/lib/prisma';

export async function authenticateWithPassword(app: FastifyInstance) {
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
      },
    },
    async (req, reply) => {
      const { email, password } = req.body;

      const userFromEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!userFromEmail) throw new ApiError('Unauthorized', 401);

      if (!userFromEmail.passwordHash)
        throw new ApiError('User does not have a password, use social login', 401);

      const isValidPassword = await compare(password, userFromEmail.passwordHash);

      if (!isValidPassword) throw new ApiError('Unauthorized', 401);

      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
        },
        { sign: { expiresIn: '7d' } }
      );

      return reply.status(201).send({ token });
    }
  );
}
