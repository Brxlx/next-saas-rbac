import { Prisma, Token as PrismaToken } from '@prisma/client';

import { EntityId } from '@/core/entities/entity-id';
import { Optional } from '@/core/types/Optional';
import { Token } from '@/domain/enterprise/entities/token';

export class PrismaTokenMapper {
  static toDomain(raw: Optional<PrismaToken, 'id'>): Token {
    return Token.create(
      {
        type: raw.type,
        userId: raw.userId,
        createdAt: raw.createdAt,
      },
      new EntityId(raw.id)
    );
  }

  static toPrisma(token: Token): Prisma.TokenUncheckedCreateInput {
    return {
      id: token.id.toString(),
      type: token.type,
      userId: token.userId,
      createdAt: token.createdAt,
    };
  }
}
