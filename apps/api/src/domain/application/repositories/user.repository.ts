import { User } from '@/domain/enterprise/entities/user';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<void>;
  update(user: User): Promise<void>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
}
