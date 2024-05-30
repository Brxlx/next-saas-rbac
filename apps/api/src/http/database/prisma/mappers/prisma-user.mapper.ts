import { Prisma, User as PrismaUser } from '@prisma/client';

import { EntityId } from '@/core/entities/entity-id';
import { Optional } from '@/core/types/Optional';
import { User } from '@/domain/enterprise/entities/user';

export class PrismaUserMapper {
  static toDomain(
    raw: Optional<PrismaUser, 'id' | 'passwordHash' | 'createdAt' | 'updatedAt'>
  ): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        passwordHash: raw.passwordHash,
        avatarUrl: raw.avatarUrl,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new EntityId(raw.id)
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
