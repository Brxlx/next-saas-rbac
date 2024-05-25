import { Select } from '@/core/types/select';
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
}
