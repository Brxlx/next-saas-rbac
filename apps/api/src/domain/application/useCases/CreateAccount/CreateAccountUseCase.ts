import { hash } from 'bcryptjs';

import { User } from '@/domain/enterprise/entities/user';
import { PrismaUsersRepository } from '@/http/database/prisma/repositories/prisma-users.repository';
import { prisma } from '@/lib/prisma';

import { ApiError } from '../errors/apiError';

interface CreateAccountUseCaseRequest {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string | null;
}

export async function CreateAccountUseCase({
  name,
  email,
  password,
  avatarUrl,
}: CreateAccountUseCaseRequest): Promise<void> {
  const userWithSameEmail = await new PrismaUsersRepository().findByEmail(email);

  if (userWithSameEmail) throw new ApiError('User with same email already exists', 400);
  // return reply.status(400).send({ message: 'User with same email already exists' });

  const usersRepository = new PrismaUsersRepository();

  const [, domain] = email.split('@');

  const autoJoinOrganization = await prisma.organization.findFirst({
    where: {
      domain,
      shouldAttachUsersByDomain: true,
    },
  });

  const passwordHash = await hash(password, 6);

  // TODO: Refactor to repository pattern
  const userToDB = User.create({
    ...autoJoinOrganization,
    name,
    email,
    avatarUrl: avatarUrl ?? null,
    passwordHash,
  });

  await usersRepository.create(userToDB);
  // await prisma.user.create({
  //   data: {
  //     name,
  //     email,
  //     passwordHash,
  //     member_on: autoJoinOrganization
  //       ? {
  //           create: {
  //             organizationId: autoJoinOrganization.id,
  //           },
  //         }
  //       : undefined,
  //   },
  // });
}
