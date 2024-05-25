import { PrismaUsersRepository } from '@/http/database/prisma/repositories/prisma-users.repository';

import { ApiError } from '../../errors/apiError';

interface AuthenticateWithPasswordUseCaseRequest {
  userId: string;
}

export async function GetProfileUseCase({ userId }: AuthenticateWithPasswordUseCaseRequest) {
  const usersRepository = new PrismaUsersRepository();

  const user = await usersRepository.findById(userId, {
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
    },
  });

  if (!user) {
    throw new ApiError('User not found', 400);
  }

  return { user };
}
