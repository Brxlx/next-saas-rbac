import { Entity } from '@/core/entities/entity';
import { EntityId } from '@/core/entities/entity-id';
import { ProvidersEnum } from '@/core/repositories/account-provider-params';

interface AccountProps {
  provider: ProvidersEnum.GITHUB;
  providerAccountId: EntityId;
  userId: EntityId;
}
export class Account extends Entity<AccountProps> {
  get provider() {
    return this.props.provider;
  }

  get providerAccountId() {
    return this.props.providerAccountId;
  }

  get userId() {
    return this.props.userId;
  }

  static create(props: AccountProps, id?: EntityId) {
    return new Account(
      {
        ...props,
      },
      id
    );
  }
}
