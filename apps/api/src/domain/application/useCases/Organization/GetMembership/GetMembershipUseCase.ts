import { MembershipRoleEnum } from '@/core/repositories/membership-roles';

import { ApiError } from '../../errors/apiError';

interface AuthenticateWithPasswordUseCaseRequest {
  membership: {
    id: string;
    role: MembershipRoleEnum;
    organizationId: string;
    userId: string;
    projectId: string | null;
  } | null;
}

export async function GetMembershipUseCase({ membership }: AuthenticateWithPasswordUseCaseRequest) {
  if (!membership?.id || !membership.organizationId || !membership.userId)
    throw new ApiError('Invalid membership or you are not member on this organization', 401);

  return {
    membership: {
      id: membership.id,
      role: membership.role,
      organizationId: membership.organizationId,
    },
  };
}
