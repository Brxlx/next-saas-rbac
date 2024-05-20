import { compare } from 'bcryptjs';

import { prisma } from '@/lib/prisma';

import { ApiError } from '../errors/apiError';

interface AuthenticateWithPasswordUseCaseRequest {
  email: string;
  password: string;
}

export async function AuthenticateWithPasswordUseCase({
  email,
  password,
}: AuthenticateWithPasswordUseCaseRequest) {
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

  return { user: userFromEmail };
}
