import { defineAbilityFor, organizationSchema, userSchema } from '@saas/auth';

import { EntityId } from '@/core/entities/entity-id';
import { MembershipRoleEnum } from '@/core/repositories/membership-roles';
import { Organization } from '@/domain/enterprise/entities/organization';
import { Slug } from '@/domain/enterprise/entities/value-objects/slug';
import { PrismaOrganizationsRepository } from '@/http/database/prisma/repositories/prisma-organizations.repository';
import { BadRequestError } from '@/http/routes/_errors/bad-request-error';
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error';

import { ApiError } from '../../errors/apiError';

interface UpdateOrganizationUseCaseRequest {
  userId: string;
  name: string;
  domain?: string | null;
  shouldAttachUsersByDomain?: boolean | null;
  slug: string;
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

export async function UpdateOrganizationUseCase({
  userId,
  slug,
  name,
  domain,
  shouldAttachUsersByDomain,
  membership,
  organization,
}: UpdateOrganizationUseCaseRequest) {
  const organizationsRepository = new PrismaOrganizationsRepository();

  const authUser = userSchema.parse({ id: userId, role: membership.role });
  const authOrganization = organizationSchema.parse(organization);

  const { cannot } = defineAbilityFor(authUser);

  if (cannot('update', authOrganization))
    throw new ApiError(new UnauthorizedError('Invalid permissions').message, 401);

  if (domain) {
    const organizationInDb = await organizationsRepository.findByDomainAndNotSlug(
      domain,
      authOrganization.id,
      {}
    );

    if (organizationInDb)
      throw new ApiError(
        new BadRequestError('Another organization with same name already exists').message,
        400
      );

    const updatedOrg = await organizationsRepository.update(
      Organization.create(
        {
          name,
          domain,
          slug: Slug.create(slug),
          shouldAttachUsersByDomain,
          ownerId: new EntityId(organization.ownerId),
        },
        new EntityId(organization.id)
      )
    );

    if (!updatedOrg) throw new ApiError('Error trying to update organization', 400);
  }
}
