import { AccountProviderParams } from '@/core/repositories/account-provider-params';
import { Select } from '@/core/types/select';
import { AccountRepository } from '@/domain/application/repositories/account.repository';
import { Account } from '@/domain/enterprise/entities/account';
import { prisma } from '@/lib/prisma';

import { PrismaAccountMapper } from '../mappers/prisma-account.mapper';

export class PrismaAccountsRepository implements AccountRepository {
  async findById(id: string): Promise<Account | null> {
    const account = await prisma.account.findUnique({
      where: {
        id,
      },
    });

    if (!account) return null;

    return PrismaAccountMapper.toDomain(account);
  }

  async findOneByProviderAnduserId(
    { provider, userId }: AccountProviderParams,
    { select }: Select<Account>
  ): Promise<Account | null> {
    const account = await prisma.account.findUnique({
      where: {
        provider_userId: {
          provider,
          userId,
        },
      },
      select,
    });

    if (!account) return null;

    return PrismaAccountMapper.toDomain(account);
  }

  async create(account: Account): Promise<void> {
    await prisma.account.create({
      data: PrismaAccountMapper.toPrisma(account),
    });
  }
}
