import { MemberRepository } from '@/domain/application/repositories/member.repository';
import { Member } from '@/domain/enterprise/entities/member';
import { prisma } from '@/lib/prisma';

import { PrismaMemberMapper } from '../mappers/prisma-member.mapper';

export class PrismaMemberRepository implements MemberRepository {
  async findByOrganizationIdUserId(
    organizationId: string,
    transferToUserId: string
  ): Promise<Member | null> {
    const getOrgByOrgIdAndUserId = await prisma.member.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: transferToUserId,
        },
      },
    });

    if (!getOrgByOrgIdAndUserId) return null;

    return PrismaMemberMapper.toDomain(getOrgByOrgIdAndUserId);
  }

  async updateOwnership(
    organizationId: string,
    userId: string,
    transferToUserId: string
  ): Promise<void> {
    await prisma.$transaction([
      prisma.member.update({
        where: {
          organizationId_userId: {
            organizationId,
            userId: transferToUserId,
          },
        },
        data: {
          role: 'ADMIN',
        },
      }),
      prisma.member.update({
        where: {
          organizationId_userId: {
            organizationId,
            userId,
          },
        },
        data: {
          role: 'MEMBER',
        },
      }),
      prisma.organization.update({
        where: {
          id: organizationId,
        },
        data: {
          ownerId: transferToUserId,
        },
      }),
    ]);
  }
}
