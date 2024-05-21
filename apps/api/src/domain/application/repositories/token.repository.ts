import { Token as PrismaToken } from '@prisma/client';

import { Token } from '@/domain/enterprise/entities/token';
export interface TokenRepository {
  create(token: Token): Promise<PrismaToken>;
}
