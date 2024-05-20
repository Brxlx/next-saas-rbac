import { hash } from 'bcryptjs';

import { prisma } from '@/lib/prisma';

import { ApiError } from '../errors/apiError';

interface CreateAccountUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export async function CreateAccountUseCase({
  name,
  email,
  password,
}: CreateAccountUseCaseRequest): Promise<void> {
  const userWithSameEmail = await prisma.user.findUnique({ where: { email } });

  if (userWithSameEmail) throw new ApiError('User with same email already exists', 400);
  // return reply.status(400).send({ message: 'User with same email already exists' });

  const [, domain] = email.split('@');

  const autoJoinOrganization = await prisma.organization.findFirst({
    where: {
      domain,
      shouldAttachUsersByDomain: true,
    },
  });

  const passwordHash = await hash(password, 6);

  // TODO: Refactor to repository pattern
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      member_on: autoJoinOrganization
        ? {
            create: {
              organizationId: autoJoinOrganization.id,
            },
          }
        : undefined,
    },
  });
}
