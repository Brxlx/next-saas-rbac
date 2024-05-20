import { prisma } from '@/lib/prisma';

import { ApiError } from '../errors/apiError';

interface AuthenticateWithPasswordUseCaseRequest {
  userId: string;
}

export async function GetProfileUseCase({ userId }: AuthenticateWithPasswordUseCaseRequest) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  });

  if (!user) {
    throw new ApiError('User not found', 400);
  }

  return { user };
}
