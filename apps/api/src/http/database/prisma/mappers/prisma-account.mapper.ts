import { Account as PrismaAccount, Prisma } from '@prisma/client';

import { EntityId } from '@/core/entities/entity-id';
import { Account } from '@/domain/enterprise/entities/account';

export class PrismaAccountMapper {
  static toDomain(raw: PrismaAccount): Account {
    return Account.create(
      {
        provider: raw.provider,
        providerAccountId: new EntityId(raw.providerAccountId),
        userId: new EntityId(raw.userId),
      },
      new EntityId(raw.id)
    );
  }

  static toPrisma(account: Account): Prisma.AccountUncheckedCreateInput {
    return {
      id: account.id.toString(),
      provider: account.provider,
      providerAccountId: account.providerAccountId.toString(),
      userId: account.userId.toString(),
    };
  }
}
