import { AccountProviderParams } from '@/core/repositories/account-provider-params';
import { Select } from '@/core/types/Select';
import { Account } from '@/domain/enterprise/entities/account';

export interface AccountRepository {
  findById(id: string): Promise<Account | null>;
  findOneByProviderAndUserId(
    { provider, userId }: AccountProviderParams,
    { select }: Select<Account>
  ): Promise<Account | null>;
  create(account: Account): Promise<void>;
}
