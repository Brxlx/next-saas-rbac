import { ApiError } from '../../errors/apiError';

interface GetOrganizationUseCaseRequest {
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

export async function GetOrganizationUseCase({ organization }: GetOrganizationUseCaseRequest) {
  if (!organization.id) throw new ApiError('Invalid request', 400);

  return {
    organization,
  };
}
