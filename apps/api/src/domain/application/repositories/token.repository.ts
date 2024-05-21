import { Token } from '@/domain/enterprise/entities/token';
export interface TokenRepository {
  findById(id: string): Promise<Token | null>;
  create(token: Token): Promise<Token>;
}
