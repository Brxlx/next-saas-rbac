import { PrismaOrganizationsRepository } from '@/http/database/prisma/repositories/prisma-organizations.repository';

import { ApiError } from '../../errors/apiError';

interface GetOrganizationsUseCaseRequest {
  userId: string;
}

export async function GetOrganizationsUseCase({ userId }: GetOrganizationsUseCaseRequest) {
  const organizationsRepository = new PrismaOrganizationsRepository();

  if (!userId) throw new ApiError('Invalid permissions', 401);

  const organizations = await organizationsRepository.findWhereUserIsIn(userId, {
    select: {
      id: true,
      name: true,
      slug: true,
      avatarUrl: true,
    },
  });

  return { organizations };
}
