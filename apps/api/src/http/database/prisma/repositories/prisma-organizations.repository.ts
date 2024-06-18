import { OmitFromClass } from '@/core/types/OmitFromClass';
import { Select } from '@/core/types/Select';
import { OrganizationRepository } from '@/domain/application/repositories/organization.repository';
import { Organization } from '@/domain/enterprise/entities/organization';
import { prisma } from '@/lib/prisma';

import { PrismaOrganizationMapper } from '../mappers/prisma-organization.mapper';

export class PrismaOrganizationsRepository implements OrganizationRepository {
  async findById(id: string, { select }: Select<Organization>): Promise<Organization | null> {
    const organization = await prisma.organization.findUnique({
      where: {
        id,
      },
      select,
    });

    if (!organization) return null;

    return PrismaOrganizationMapper.toDomain(organization);
  }

  async findByDomain(
    domain: string,
    { select }: Select<Organization>
  ): Promise<Organization | null> {
    const organization = await prisma.organization.findUnique({
      where: {
        domain,
      },
      select,
    });

    if (!organization) return null;

    return PrismaOrganizationMapper.toDomain(organization);
  }

  async findByDomainAndNotSlug(
    domain: string,
    id: string,
    { select }: Select<Organization>
  ): Promise<Organization | null> {
    const organization = await prisma.organization.findFirst({
      where: { domain, id: { not: id } },
      select,
    });

    if (!organization) return null;

    return PrismaOrganizationMapper.toDomain(organization);
  }

  async findWhereUserIsIn(
    userId: string,
    { select }: Select<OmitFromClass<Organization, 'role'>>
  ): Promise<Organization[]> {
    const organizations = await prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      select: {
        // id: true,
        // name: true,
        // slug: true,
        // avatarUrl: true,
        ...select,
        members: {
          select: { role: true },
          where: { userId },
        },
      },
    });

    // TODO: refactor
    return organizations.map(({ members, ...all }) => {
      const role = members[0].role;
      return PrismaOrganizationMapper.toDomain({ ...all, role });
    });
  }

  async createAsAdmin(organization: Organization): Promise<Organization> {
    const prismaOrganization = PrismaOrganizationMapper.toPrisma(organization);
    const newOrganization = await prisma.organization.create({
      data: {
        ...prismaOrganization,
        members: {
          create: {
            userId: prismaOrganization.ownerId,
            role: 'ADMIN',
          },
        },
      },
    });

    return PrismaOrganizationMapper.toDomain(newOrganization);
  }

  async update(organization: Organization): Promise<Organization | null> {
    const prismaOrganization = PrismaOrganizationMapper.toPrisma(organization);

    const updatedOrg = await prisma.organization.update({
      where: {
        id: prismaOrganization.id,
      },
      data: {
        name: prismaOrganization.name,
        domain: prismaOrganization.domain,
        shouldAttachUsersByDomain: prismaOrganization.shouldAttachUsersByDomain,
      },
    });

    return PrismaOrganizationMapper.toDomain(updatedOrg);
  }

  async delete(organizationId: string): Promise<void> {
    await prisma.organization.delete({
      where: {
        id: organizationId,
      },
    });
  }
}
