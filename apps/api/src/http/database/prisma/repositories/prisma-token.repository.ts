import { Token as PrismaToken } from '@prisma/client';

import { TokenRepository } from '@/domain/application/repositories/token.repository';
import { Token } from '@/domain/enterprise/entities/token';
import { prisma } from '@/lib/prisma';

import { PrismaTokenMapper } from '../mappers/prisma-token.mapper';

export class PrismaTokensRepository implements TokenRepository {
  async create(token: Token): Promise<PrismaToken> {
    return await prisma.token.create({
      data: PrismaTokenMapper.toPrisma(token),
    });
  }
}
