import { $Enums, Organization as PrismaOrganization, Prisma } from '@prisma/client';

import { EntityId } from '@/core/entities/entity-id';
import { MembershipRoleEnum } from '@/core/repositories/membership-roles';
import { Organization } from '@/domain/enterprise/entities/organization';

export class PrismaOrganizationMapper {
  static toDomain(raw: Partial<PrismaOrganization> & Partial<{ role: $Enums.Role }>): Organization {
    return Organization.create(
      {
        name: raw.name!,
        domain: raw.domain ?? null,
        slug: raw.slug!,
        shouldAttachUsersByDomain: raw.shouldAttachUsersByDomain,
        ownerId: new EntityId(raw.ownerId),
        avatarUrl: raw.avatarUrl ?? null,
        role: raw.role as MembershipRoleEnum,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new EntityId(raw.id)
    );
  }

  static toPrisma(organization: Organization): Prisma.OrganizationUncheckedCreateInput {
    return {
      id: organization.id.toString(),
      name: organization.name,
      domain: organization.domain,
      slug: organization.slug,
      shouldAttachUsersByDomain: organization.shouldAttachUsersByDomain,
      ownerId: organization.ownerId.toString(),
      avatarUrl: organization.avatarUrl,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    };
  }
}
