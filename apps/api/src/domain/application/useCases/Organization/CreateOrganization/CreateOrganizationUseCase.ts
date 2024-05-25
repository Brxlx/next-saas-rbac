import { EntityId } from '@/core/entities/entity-id';
import { Organization } from '@/domain/enterprise/entities/organization';
import { Slug } from '@/domain/enterprise/entities/value-objects/slug';
import { PrismaOrganizationsRepository } from '@/http/database/prisma/repositories/prisma-organizations.repository';

import { ApiError } from '../../errors/apiError';

interface CreateOrganizationUseCaseRequest {
  name: string;
  domain?: string | null;
  shouldAttachUsersByDomain?: boolean;
  userId: string;
}

export async function CreateOrganizationUseCase({
  name,
  domain,
  shouldAttachUsersByDomain,
  userId,
}: CreateOrganizationUseCaseRequest) {
  const organizationsRepository = new PrismaOrganizationsRepository();

  if (domain) {
    const organizationByDomain = await organizationsRepository.findByDomain(domain, {});

    if (organizationByDomain)
      throw new ApiError('Another organization with same domain already exists', 400);
  }

  const organization = await organizationsRepository.createAsAdmin(
    Organization.create({
      name,
      domain,
      slug: Slug.createFromText(name).value,
      shouldAttachUsersByDomain,
      ownerId: new EntityId(userId),
    })
  );

  return {
    organizationId: organization.id,
  };
}
