import { Select } from '@/core/types/select';
import { User } from '@/domain/enterprise/entities/user';

export interface UserRepository {
  findById(id: string, select: Select<User>): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<void>;
  update(user: User): Promise<void>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
}
