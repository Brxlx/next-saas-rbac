import { AccountProviderParams } from '@/core/repositories/account-provider-params';
import { Account } from '@/domain/enterprise/entities/account';

export interface AccountRepository {
  findById(id: string): Promise<Account | null>;
  findOneByProviderAnduserId({ provider, userId }: AccountProviderParams): Promise<Account | null>;
  create(account: Account): Promise<void>;
}
