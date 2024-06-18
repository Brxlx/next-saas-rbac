import { defineAbilityFor, organizationSchema, userSchema } from '@saas/auth';

import { MembershipRoleEnum } from '@/core/repositories/membership-roles';
import { PrismaOrganizationsRepository } from '@/http/database/prisma/repositories/prisma-organizations.repository';
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error';

import { ApiError } from '../errors/apiError';

interface ShutdownOrganizationUseCaseRequest {
  userId: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    domain: string | null;
    shouldAttachUsersByDomain: boolean;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    ownerId: string;
  };
  membership: {
    id: string;
    role: MembershipRoleEnum;
    organizationId: string;
    userId: string;
    projectId: string | null;
  };
}

export async function ShutdownOrganizationUseCase({
  userId,
  organization,
  membership,
}: ShutdownOrganizationUseCaseRequest) {
  const organizationsRepository = new PrismaOrganizationsRepository();

  const authUser = userSchema.parse({ id: userId, role: membership.role });
  const authOrganization = organizationSchema.parse(organization);

  const { cannot } = defineAbilityFor(authUser);

  if (cannot('delete', authOrganization))
    throw new ApiError(new UnauthorizedError('Invalid permissions').message, 401);

  try {
    await organizationsRepository.delete(organization.id);
  } catch {
    throw new ApiError('Error trying to shutdown organization', 400);
  }
}
