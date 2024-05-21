import { TokenRepository } from '@/domain/application/repositories/token.repository';
import { Token } from '@/domain/enterprise/entities/token';
import { prisma } from '@/lib/prisma';

import { PrismaTokenMapper } from '../mappers/prisma-token.mapper';

export class PrismaTokensRepository implements TokenRepository {
  async findById(id: string): Promise<Token | null> {
    const token = await prisma.token.findUnique({
      where: {
        id,
      },
    });

    if (!token) return null;

    return PrismaTokenMapper.toDomain(token);
  }

  async create(token: Token): Promise<Token> {
    const prismaToken = await prisma.token.create({
      data: PrismaTokenMapper.toPrisma(token),
    });

    return PrismaTokenMapper.toDomain(prismaToken);
  }
}
