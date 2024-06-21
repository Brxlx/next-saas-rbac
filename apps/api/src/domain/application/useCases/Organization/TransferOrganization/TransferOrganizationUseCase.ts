import { defineAbilityFor, organizationSchema, userSchema } from '@saas/auth';

import { MembershipRoleEnum } from '@/core/repositories/membership-roles';
import { PrismaMemberRepository } from '@/http/database/prisma/repositories/prisma-members.repository';
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error';

import { ApiError } from '../../errors/apiError';

interface TransferOrganizationUseCaseRequest {
  userId: string;
  transferToUserId: string;
  membership: {
    id: string;
    role: MembershipRoleEnum;
    organizationId: string;
    userId: string;
    projectId: string | null;
  };
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
}

export async function TransferOrganizationUseCase({
  userId,
  transferToUserId,
  membership,
  organization,
}: TransferOrganizationUseCaseRequest) {
  const membersRepository = new PrismaMemberRepository();

  const authUser = userSchema.parse({ id: userId, role: membership.role });
  const authOrganization = organizationSchema.parse(organization);

  const { cannot } = defineAbilityFor(authUser);

  if (cannot('transfer_ownership', authOrganization))
    throw new ApiError(
      new UnauthorizedError('Invalid permissions to transfer ownership').message,
      401
    );

  const transferToMembership = await membersRepository.findByOrganizationIdUserId(
    organization.id,
    transferToUserId
  );

  if (!transferToMembership)
    throw new ApiError('Target user is not member of this organization', 400);

  await membersRepository.updateOwnership(organization.id, userId, transferToUserId);
}
