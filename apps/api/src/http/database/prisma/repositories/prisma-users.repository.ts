import { UserRepository } from '@/domain/application/repositories/user.repository';
import { User } from '@/domain/enterprise/entities/user';
import { prisma } from '@/lib/prisma';

import { PrismaUserMapper } from '../mappers/prisma-user.mapper';

export class PrismaUsersRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }
}
