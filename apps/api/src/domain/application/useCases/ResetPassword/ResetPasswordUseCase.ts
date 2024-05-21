import { hash } from 'bcryptjs';

import { PrismaTokensRepository } from '@/http/database/prisma/repositories/prisma-token.repository';
import { PrismaUsersRepository } from '@/http/database/prisma/repositories/prisma-users.repository';
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error';

import { ApiError } from '../errors/apiError';

interface ResetPasswordUseCaseRequest {
  code: string;
  password: string;
}

export async function ResetPasswordUseCase({
  code,
  password,
}: ResetPasswordUseCaseRequest): Promise<void> {
  const usersRepository = new PrismaUsersRepository();
  const tokensRepository = new PrismaTokensRepository();

  const token = await tokensRepository.findById(code);

  if (!token) throw new ApiError(new UnauthorizedError().message, 401);

  // TODO: refactor to hash provider (CA)
  const newPasswordHash = await hash(password, 6);

  await usersRepository.updatePassword(token.userId, newPasswordHash);
}
