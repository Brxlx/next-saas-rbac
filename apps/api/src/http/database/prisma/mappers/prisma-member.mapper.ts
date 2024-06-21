import { Member as PrismaMember, Prisma } from '@prisma/client';

import { EntityId } from '@/core/entities/entity-id';
import { MembershipRoleEnum } from '@/core/repositories/membership-roles';
import { Member } from '@/domain/enterprise/entities/member';

export class PrismaMemberMapper {
  static toDomain(raw: PrismaMember): Member {
    return Member.create(
      {
        organizationId: new EntityId(raw.organizationId),
        userId: new EntityId(raw.userId),
        projectId: raw.projectId ? new EntityId(raw.projectId) : null,
        role: raw.role as MembershipRoleEnum,
      },
      new EntityId(raw.id)
    );
  }

  static toPrisma(member: Member): Prisma.MemberUncheckedCreateInput {
    return {
      id: member.id.toString(),
      organizationId: member.organizationId.toString(),
      userId: member.userId.toString(),
      projectId: member.projectId?.toString(),
      role: member.role as MembershipRoleEnum,
    };
  }
}
