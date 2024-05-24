import { Select } from '@/core/types/select';
import { UserRepository } from '@/domain/application/repositories/user.repository';
import { User } from '@/domain/enterprise/entities/user';
import { prisma } from '@/lib/prisma';

import { PrismaUserMapper } from '../mappers/prisma-user.mapper';

export class PrismaUsersRepository implements UserRepository {
  async findById(id: string, { select }: Select<User>): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select,
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

  async create(user: User): Promise<void> {
    await prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });
  }

  async update(user: User): Promise<void> {
    await prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data: {
        ...user,
      },
    });
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        passwordHash,
      },
    });
  }
}
